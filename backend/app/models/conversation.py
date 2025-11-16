"""
Conversation and Message models
"""

from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Text, Enum, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.base import Base


class MessageRole(str, enum.Enum):
    """Message role enum"""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class Conversation(Base):
    """Conversation model"""
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)

    # Basic info
    title = Column(String, default="New Conversation")
    summary = Column(Text, nullable=True)

    # Context
    legal_area = Column(String, nullable=True)  # 민사, 형사, 상사, 노동 etc.
    metadata = Column(JSON, nullable=True)

    # Settings
    model_name = Column(String, default="gpt-4-turbo-preview")
    temperature = Column(String, default="0.3")
    max_tokens = Column(Integer, default=4096)

    # Status
    is_active = Column(Boolean, default=True)
    is_archived = Column(Boolean, default=False)

    # User
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="conversations")

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_message_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Conversation {self.title}>"


class Message(Base):
    """Message model"""
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)

    # Content
    role = Column(Enum(MessageRole), nullable=False)
    content = Column(Text, nullable=False)

    # Metadata
    tokens_used = Column(Integer, nullable=True)
    model_used = Column(String, nullable=True)

    # Citations (법령, 판례 인용)
    citations = Column(JSON, nullable=True)
    sources = Column(JSON, nullable=True)

    # Feedback
    rating = Column(Integer, nullable=True)  # 1-5
    feedback = Column(Text, nullable=True)

    # Conversation
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    conversation = relationship("Conversation", back_populates="messages")

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Message {self.role.value}: {self.content[:50]}>"
