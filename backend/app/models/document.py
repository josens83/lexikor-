"""
Document model
"""

from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Text, Enum, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.base import Base


class DocumentType(str, enum.Enum):
    """Document type enum"""
    CONTRACT = "contract"  # 계약서
    LAWSUIT = "lawsuit"  # 소장
    OPINION = "opinion"  # 법률의견서
    NOTICE = "notice"  # 내용증명
    COURT_DECISION = "court_decision"  # 판결문
    STATUTE = "statute"  # 법령
    OTHER = "other"


class DocumentStatus(str, enum.Enum):
    """Document processing status"""
    UPLOADING = "uploading"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class Document(Base):
    """Document model"""
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    # Basic info
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    document_type = Column(Enum(DocumentType), default=DocumentType.OTHER)

    # File info
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer)  # in bytes
    file_extension = Column(String)
    mime_type = Column(String)

    # Processing
    status = Column(Enum(DocumentStatus), default=DocumentStatus.UPLOADING)
    extracted_text = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)

    # Analysis results
    analysis_results = Column(JSON, nullable=True)  # Store complex analysis data
    risk_score = Column(Integer, nullable=True)  # 0-100
    key_clauses = Column(JSON, nullable=True)  # Important clauses

    # Metadata
    metadata = Column(JSON, nullable=True)
    tags = Column(JSON, nullable=True)

    # Storage
    s3_key = Column(String, nullable=True)
    s3_bucket = Column(String, nullable=True)

    # Sharing
    is_public = Column(Boolean, default=False)
    shared_with = Column(JSON, nullable=True)  # List of user IDs

    # Owner
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="documents")

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    processed_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"<Document {self.title}>"
