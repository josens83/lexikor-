"""
Analytics API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from typing import Dict, List
from datetime import datetime, timedelta

from app.db.session import get_db
from app.models.user import User
from app.models.conversation import Conversation, Message
from app.models.document import Document
from app.api.v1.auth import get_current_active_user

router = APIRouter()


# Pydantic models
class UsageStats(BaseModel):
    total_queries: int
    total_documents: int
    total_conversations: int
    queries_this_month: int
    documents_this_month: int


class ActivityData(BaseModel):
    date: str
    queries: int
    documents: int


# API Endpoints
@router.get("/dashboard")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get dashboard analytics
    """
    # Total conversations
    conv_result = await db.execute(
        select(func.count(Conversation.id)).where(Conversation.user_id == current_user.id)
    )
    total_conversations = conv_result.scalar()

    # Total messages
    msg_result = await db.execute(
        select(func.count(Message.id))
        .join(Conversation)
        .where(Conversation.user_id == current_user.id)
    )
    total_messages = msg_result.scalar()

    # Total documents
    doc_result = await db.execute(
        select(func.count(Document.id)).where(Document.owner_id == current_user.id)
    )
    total_documents = doc_result.scalar()

    # This month's activity
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # Messages this month
    msg_month_result = await db.execute(
        select(func.count(Message.id))
        .join(Conversation)
        .where(
            Conversation.user_id == current_user.id,
            Message.created_at >= month_start
        )
    )
    messages_this_month = msg_month_result.scalar()

    # Documents this month
    doc_month_result = await db.execute(
        select(func.count(Document.id)).where(
            Document.owner_id == current_user.id,
            Document.created_at >= month_start
        )
    )
    documents_this_month = doc_month_result.scalar()

    return {
        "overview": {
            "total_conversations": total_conversations,
            "total_queries": total_messages,
            "total_documents": total_documents,
            "queries_this_month": messages_this_month,
            "documents_this_month": documents_this_month
        },
        "subscription": {
            "plan": current_user.subscription.plan if current_user.subscription else None,
            "queries_used": current_user.subscription.queries_used if current_user.subscription else 0,
            "query_limit": current_user.subscription.query_limit if current_user.subscription else 0,
        }
    }


@router.get("/activity")
async def get_activity_chart(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
    days: int = 30
):
    """
    Get activity chart data for the past N days
    """
    activity_data = []
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)

    for i in range(days):
        date = start_date + timedelta(days=i)
        next_date = date + timedelta(days=1)

        # Count messages for this day
        msg_result = await db.execute(
            select(func.count(Message.id))
            .join(Conversation)
            .where(
                Conversation.user_id == current_user.id,
                Message.created_at >= date,
                Message.created_at < next_date
            )
        )
        messages_count = msg_result.scalar()

        # Count documents for this day
        doc_result = await db.execute(
            select(func.count(Document.id)).where(
                Document.owner_id == current_user.id,
                Document.created_at >= date,
                Document.created_at < next_date
            )
        )
        documents_count = doc_result.scalar()

        activity_data.append(ActivityData(
            date=date.strftime("%Y-%m-%d"),
            queries=messages_count,
            documents=documents_count
        ))

    return {"activity": activity_data}


@router.get("/popular-topics")
async def get_popular_topics(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get popular legal topics from conversations
    """
    # Get conversations with legal areas
    result = await db.execute(
        select(Conversation.legal_area, func.count(Conversation.id))
        .where(
            Conversation.user_id == current_user.id,
            Conversation.legal_area.isnot(None)
        )
        .group_by(Conversation.legal_area)
        .order_by(func.count(Conversation.id).desc())
        .limit(10)
    )

    topics = []
    for area, count in result.all():
        topics.append({
            "topic": area,
            "count": count
        })

    return {"topics": topics}
