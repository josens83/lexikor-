"""
Organization model
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Organization(Base):
    """Organization (law firm) model"""
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    # Contact info
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    address = Column(Text)
    website = Column(String, nullable=True)

    # Business info
    business_number = Column(String, unique=True, nullable=True)  # 사업자등록번호

    # Settings
    is_active = Column(Boolean, default=True)
    max_users = Column(Integer, default=10)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    users = relationship("User", back_populates="organization")

    def __repr__(self):
        return f"<Organization {self.name}>"
