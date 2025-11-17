"""
Billing and subscription API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import stripe

from app.db.session import get_db
from app.models.user import User
from app.models.subscription import Subscription, SubscriptionPlan, SubscriptionStatus
from app.api.v1.auth import get_current_active_user
from app.core.config import settings

router = APIRouter()

# Configure Stripe
if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY


# Pydantic models
class SubscriptionResponse(BaseModel):
    id: int
    plan: SubscriptionPlan
    status: SubscriptionStatus
    query_limit: int
    queries_used: int
    document_limit: int
    documents_count: int
    price: float
    current_period_end: Optional[datetime]

    class Config:
        from_attributes = True


class UpgradePlanRequest(BaseModel):
    plan: SubscriptionPlan
    payment_method_id: Optional[str] = None


class CreateCheckoutSessionResponse(BaseModel):
    checkout_url: str
    session_id: str


# API Endpoints
@router.get("/subscription", response_model=SubscriptionResponse)
async def get_subscription(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get current user's subscription
    """
    if not current_user.subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No subscription found"
        )

    return current_user.subscription


@router.post("/upgrade", response_model=SubscriptionResponse)
async def upgrade_subscription(
    upgrade_request: UpgradePlanRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Upgrade subscription plan
    """
    if not current_user.subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No subscription found"
        )

    subscription = current_user.subscription

    # Validate upgrade
    if upgrade_request.plan == SubscriptionPlan.FREE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot downgrade to free plan through this endpoint"
        )

    # Calculate new limits and price
    if upgrade_request.plan == SubscriptionPlan.PROFESSIONAL:
        query_limit = -1  # Unlimited
        document_limit = 100
        price = settings.PRO_PLAN_MONTHLY_PRICE
    elif upgrade_request.plan == SubscriptionPlan.ENTERPRISE:
        query_limit = -1  # Unlimited
        document_limit = -1  # Unlimited
        price = 0  # Custom pricing
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid plan"
        )

    # TODO: Process payment with Stripe/Toss
    # For now, just update the subscription

    subscription.plan = upgrade_request.plan
    subscription.status = SubscriptionStatus.ACTIVE
    subscription.query_limit = query_limit
    subscription.document_limit = document_limit
    subscription.price = price
    subscription.current_period_start = datetime.utcnow()
    subscription.current_period_end = datetime.utcnow() + timedelta(days=30)

    await db.commit()
    await db.refresh(subscription)

    return subscription


@router.post("/checkout/create")
async def create_checkout_session(
    plan: SubscriptionPlan,
    current_user: User = Depends(get_current_active_user)
):
    """
    Create Stripe checkout session
    """
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Payment system not configured"
        )

    # Map plan to price
    price_mapping = {
        SubscriptionPlan.PROFESSIONAL: 99000,
        SubscriptionPlan.ENTERPRISE: 500000  # Example price
    }

    if plan not in price_mapping:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid plan for checkout"
        )

    try:
        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'krw',
                    'product_data': {
                        'name': f'LexiKor {plan.value.capitalize()} Plan',
                    },
                    'unit_amount': price_mapping[plan],
                    'recurring': {
                        'interval': 'month',
                    },
                },
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f'{settings.FRONTEND_URL}/billing/success?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'{settings.FRONTEND_URL}/billing/cancel',
            customer_email=current_user.email,
            metadata={
                'user_id': current_user.id,
                'plan': plan.value
            }
        )

        return CreateCheckoutSessionResponse(
            checkout_url=checkout_session.url,
            session_id=checkout_session.id
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create checkout session: {str(e)}"
        )


@router.post("/webhook/stripe")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Handle Stripe webhooks

    Handles the following events:
    - checkout.session.completed: When a user completes a purchase
    - invoice.payment_succeeded: When a recurring payment succeeds
    - customer.subscription.updated: When subscription is modified
    - customer.subscription.deleted: When subscription is cancelled
    """
    if not settings.STRIPE_WEBHOOK_SECRET:
        return {"status": "webhook_not_configured"}

    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    event_type = event['type']
    data_object = event['data']['object']

    try:
        # Handle checkout.session.completed
        if event_type == 'checkout.session.completed':
            session = data_object

            # Get user from metadata
            user_id = int(session['metadata']['user_id'])
            plan_str = session['metadata']['plan']

            # Find user
            result = await db.execute(select(User).where(User.id == user_id))
            user = result.scalar_one_or_none()

            if not user or not user.subscription:
                raise Exception(f"User {user_id} or subscription not found")

            # Map plan string to enum
            plan = SubscriptionPlan(plan_str)

            # Update subscription
            subscription = user.subscription
            subscription.plan = plan
            subscription.status = SubscriptionStatus.ACTIVE
            subscription.stripe_customer_id = session.get('customer')
            subscription.stripe_subscription_id = session.get('subscription')
            subscription.current_period_start = datetime.utcnow()
            subscription.current_period_end = datetime.utcnow() + timedelta(days=30)

            # Set limits based on plan
            if plan == SubscriptionPlan.PROFESSIONAL:
                subscription.query_limit = -1  # Unlimited
                subscription.document_limit = 100
                subscription.price = settings.PRO_PLAN_MONTHLY_PRICE
            elif plan == SubscriptionPlan.ENTERPRISE:
                subscription.query_limit = -1  # Unlimited
                subscription.document_limit = -1  # Unlimited
                subscription.price = 500000  # Example price

            await db.commit()
            print(f"✅ Subscription activated for user {user_id}, plan: {plan}")

        # Handle invoice.payment_succeeded
        elif event_type == 'invoice.payment_succeeded':
            invoice = data_object
            subscription_id = invoice.get('subscription')

            if subscription_id:
                # Find subscription by Stripe subscription ID
                result = await db.execute(
                    select(Subscription).where(
                        Subscription.stripe_subscription_id == subscription_id
                    )
                )
                subscription = result.scalar_one_or_none()

                if subscription:
                    # Reset monthly usage
                    subscription.queries_used = 0
                    subscription.documents_count = 0
                    subscription.current_period_start = datetime.utcnow()
                    subscription.current_period_end = datetime.utcnow() + timedelta(days=30)
                    subscription.status = SubscriptionStatus.ACTIVE

                    await db.commit()
                    print(f"✅ Monthly usage reset for subscription {subscription.id}")

        # Handle customer.subscription.updated
        elif event_type == 'customer.subscription.updated':
            stripe_subscription = data_object
            subscription_id = stripe_subscription['id']

            # Find subscription
            result = await db.execute(
                select(Subscription).where(
                    Subscription.stripe_subscription_id == subscription_id
                )
            )
            subscription = result.scalar_one_or_none()

            if subscription:
                # Update status based on Stripe status
                stripe_status = stripe_subscription['status']
                if stripe_status == 'active':
                    subscription.status = SubscriptionStatus.ACTIVE
                elif stripe_status == 'canceled':
                    subscription.status = SubscriptionStatus.CANCELLED
                    subscription.cancelled_at = datetime.utcnow()
                elif stripe_status == 'past_due':
                    subscription.status = SubscriptionStatus.EXPIRED

                await db.commit()
                print(f"✅ Subscription {subscription.id} updated to {subscription.status}")

        # Handle customer.subscription.deleted
        elif event_type == 'customer.subscription.deleted':
            stripe_subscription = data_object
            subscription_id = stripe_subscription['id']

            # Find subscription
            result = await db.execute(
                select(Subscription).where(
                    Subscription.stripe_subscription_id == subscription_id
                )
            )
            subscription = result.scalar_one_or_none()

            if subscription:
                # Downgrade to free plan
                subscription.plan = SubscriptionPlan.FREE
                subscription.status = SubscriptionStatus.CANCELLED
                subscription.cancelled_at = datetime.utcnow()
                subscription.query_limit = settings.FREE_PLAN_QUERY_LIMIT
                subscription.document_limit = 5
                subscription.price = 0
                subscription.stripe_customer_id = None
                subscription.stripe_subscription_id = None

                await db.commit()
                print(f"✅ Subscription {subscription.id} cancelled and downgraded to FREE")

        else:
            print(f"ℹ️  Unhandled event type: {event_type}")

    except Exception as e:
        print(f"❌ Error processing webhook: {str(e)}")
        # Don't raise - return 200 to acknowledge receipt
        # Stripe will retry failed webhooks
        return {"status": "error", "message": str(e)}

    return {"status": "success", "event_type": event_type}


@router.post("/cancel")
async def cancel_subscription(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Cancel subscription
    """
    if not current_user.subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No subscription found"
        )

    subscription = current_user.subscription

    # TODO: Cancel on payment provider (Stripe/Toss)

    subscription.status = SubscriptionStatus.CANCELLED
    subscription.cancelled_at = datetime.utcnow()

    await db.commit()

    return {"message": "Subscription cancelled successfully"}


@router.get("/usage")
async def get_usage_stats(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get usage statistics
    """
    if not current_user.subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No subscription found"
        )

    subscription = current_user.subscription

    return {
        "plan": subscription.plan,
        "queries": {
            "used": subscription.queries_used,
            "limit": subscription.query_limit,
            "percentage": (subscription.queries_used / subscription.query_limit * 100) if subscription.query_limit > 0 else 0
        },
        "documents": {
            "count": subscription.documents_count,
            "limit": subscription.document_limit,
            "percentage": (subscription.documents_count / subscription.document_limit * 100) if subscription.document_limit > 0 else 0
        },
        "period": {
            "start": subscription.current_period_start,
            "end": subscription.current_period_end
        }
    }
