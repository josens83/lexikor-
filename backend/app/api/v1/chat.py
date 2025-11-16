"""
Chat API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional, AsyncGenerator
from datetime import datetime
import json
import asyncio

from app.db.session import get_db
from app.models.user import User
from app.models.conversation import Conversation, Message, MessageRole
from app.models.subscription import SubscriptionStatus
from app.api.v1.auth import get_current_active_user
from app.core.llm.openai_service import OpenAIService
from app.core.rag.retriever import RAGRetriever

router = APIRouter()


# Pydantic models
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None
    legal_area: Optional[str] = None
    stream: bool = True


class ChatResponse(BaseModel):
    conversation_id: int
    message_id: int
    role: MessageRole
    content: str
    citations: Optional[List[dict]] = None
    created_at: datetime


class ConversationResponse(BaseModel):
    id: int
    title: str
    legal_area: Optional[str]
    message_count: int
    created_at: datetime
    last_message_at: Optional[datetime]

    class Config:
        from_attributes = True


# Helper function
async def check_subscription_limit(user: User, db: AsyncSession):
    """Check if user has exceeded subscription limits"""
    if not user.subscription:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No active subscription"
        )

    subscription = user.subscription

    if not subscription.can_use_service():
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Subscription limit exceeded or inactive. Please upgrade your plan."
        )

    # Increment usage
    subscription.queries_used += 1
    await db.commit()


# API Endpoints
@router.post("/send", response_model=ChatResponse)
async def send_message(
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Send a chat message and get AI response
    """
    # Check subscription limits
    await check_subscription_limit(current_user, db)

    # Get or create conversation
    if chat_request.conversation_id:
        result = await db.execute(
            select(Conversation).where(
                Conversation.id == chat_request.conversation_id,
                Conversation.user_id == current_user.id
            )
        )
        conversation = result.scalar_one_or_none()
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
    else:
        # Create new conversation
        conversation = Conversation(
            title=chat_request.message[:50] + "..." if len(chat_request.message) > 50 else chat_request.message,
            user_id=current_user.id,
            legal_area=chat_request.legal_area
        )
        db.add(conversation)
        await db.flush()

    # Save user message
    user_message = Message(
        role=MessageRole.USER,
        content=chat_request.message,
        conversation_id=conversation.id
    )
    db.add(user_message)
    await db.flush()

    # Get AI response
    try:
        # Use RAG to find relevant legal documents
        rag_retriever = RAGRetriever()
        relevant_docs = await rag_retriever.retrieve(chat_request.message, top_k=5)

        # Generate response with OpenAI
        llm_service = OpenAIService()
        ai_response = await llm_service.generate_response(
            user_message=chat_request.message,
            conversation_history=[],  # TODO: Load conversation history
            relevant_docs=relevant_docs,
            legal_area=chat_request.legal_area
        )

        # Save assistant message
        assistant_message = Message(
            role=MessageRole.ASSISTANT,
            content=ai_response["content"],
            conversation_id=conversation.id,
            citations=ai_response.get("citations"),
            sources=ai_response.get("sources"),
            tokens_used=ai_response.get("tokens_used"),
            model_used=ai_response.get("model")
        )
        db.add(assistant_message)

        # Update conversation
        conversation.last_message_at = datetime.utcnow()
        await db.commit()
        await db.refresh(assistant_message)

        return ChatResponse(
            conversation_id=conversation.id,
            message_id=assistant_message.id,
            role=assistant_message.role,
            content=assistant_message.content,
            citations=assistant_message.citations,
            created_at=assistant_message.created_at
        )

    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate response: {str(e)}"
        )


@router.get("/conversations", response_model=List[ConversationResponse])
async def get_conversations(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 20
):
    """
    Get user's conversations
    """
    result = await db.execute(
        select(Conversation)
        .where(Conversation.user_id == current_user.id)
        .order_by(Conversation.last_message_at.desc())
        .offset(skip)
        .limit(limit)
    )
    conversations = result.scalars().all()

    response = []
    for conv in conversations:
        # Count messages
        msg_result = await db.execute(
            select(Message).where(Message.conversation_id == conv.id)
        )
        message_count = len(msg_result.scalars().all())

        response.append(ConversationResponse(
            id=conv.id,
            title=conv.title,
            legal_area=conv.legal_area,
            message_count=message_count,
            created_at=conv.created_at,
            last_message_at=conv.last_message_at
        ))

    return response


@router.get("/conversations/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get messages in a conversation
    """
    # Check conversation ownership
    result = await db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id
        )
    )
    conversation = result.scalar_one_or_none()

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    # Get messages
    msg_result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
    )
    messages = msg_result.scalars().all()

    return {
        "conversation_id": conversation_id,
        "title": conversation.title,
        "messages": [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "citations": msg.citations,
                "created_at": msg.created_at
            }
            for msg in messages
        ]
    }


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a conversation
    """
    result = await db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id
        )
    )
    conversation = result.scalar_one_or_none()

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    await db.delete(conversation)
    await db.commit()

    return {"message": "Conversation deleted successfully"}
