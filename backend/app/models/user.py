"""
User model
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from app.db.base import Base


class UserRole(str, enum.Enum):
    """User role enum"""
    USER = "user"
    LAWYER = "lawyer"
    ADMIN = "admin"
    ENTERPRISE = "enterprise"


class User(Base):
    """User model"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    phone = Column(String)

    # Profile
    role = Column(Enum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_superuser = Column(Boolean, default=False)

    # Organization
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    organization = relationship("Organization", back_populates="users")

    # Subscription
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"), nullable=True)
    subscription = relationship("Subscription", back_populates="user", uselist=False)

    # MFA
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String, nullable=True)

    # Email verification
    email_verification_token = Column(String, nullable=True)
    email_verification_token_expires = Column(DateTime(timezone=True), nullable=True)

    # Password reset
    password_reset_token = Column(String, nullable=True)
    password_reset_token_expires = Column(DateTime(timezone=True), nullable=True)

    # OAuth
    google_id = Column(String, unique=True, nullable=True)
    microsoft_id = Column(String, unique=True, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    documents = relationship("Document", back_populates="owner", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.email}>"
