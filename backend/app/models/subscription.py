"""
Subscription model
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, Enum, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from app.db.base import Base


class SubscriptionPlan(str, enum.Enum):
    """Subscription plan enum"""
    FREE = "free"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"


class SubscriptionStatus(str, enum.Enum):
    """Subscription status enum"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    TRIAL = "trial"


class Subscription(Base):
    """Subscription model"""
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)

    # Plan details
    plan = Column(Enum(SubscriptionPlan), default=SubscriptionPlan.FREE)
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.TRIAL)

    # Usage limits
    query_limit = Column(Integer, default=20)  # queries per month
    queries_used = Column(Integer, default=0)
    document_limit = Column(Integer, default=5)
    documents_count = Column(Integer, default=0)

    # Billing
    price = Column(Numeric(10, 2), default=0)
    currency = Column(String, default="KRW")
    billing_cycle = Column(String, default="monthly")  # monthly, yearly

    # Payment gateway IDs
    stripe_subscription_id = Column(String, unique=True, nullable=True)
    stripe_customer_id = Column(String, nullable=True)
    toss_customer_id = Column(String, nullable=True)

    # Dates
    trial_ends_at = Column(DateTime(timezone=True), nullable=True)
    current_period_start = Column(DateTime(timezone=True), nullable=True)
    current_period_end = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="subscription")

    def __repr__(self):
        return f"<Subscription {self.plan.value} - {self.status.value}>"

    def reset_monthly_usage(self):
        """Reset monthly query usage"""
        self.queries_used = 0

    def can_use_service(self) -> bool:
        """Check if user can use the service"""
        if self.status not in [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL]:
            return False

        if self.plan == SubscriptionPlan.FREE and self.queries_used >= self.query_limit:
            return False

        return True
