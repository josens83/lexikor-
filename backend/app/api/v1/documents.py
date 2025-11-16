"""
Document management API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
import shutil
from pathlib import Path

from app.db.session import get_db
from app.models.user import User
from app.models.document import Document, DocumentType, DocumentStatus
from app.api.v1.auth import get_current_active_user
from app.core.document_processing.parser import DocumentParser
from app.core.document_processing.extractor import InformationExtractor
from app.core.config import settings

router = APIRouter()


# Pydantic models
class DocumentUploadResponse(BaseModel):
    id: int
    title: str
    filename: str
    file_size: int
    status: DocumentStatus
    created_at: datetime


class DocumentResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    document_type: DocumentType
    filename: str
    file_size: int
    status: DocumentStatus
    summary: Optional[str]
    risk_score: Optional[int]
    created_at: datetime
    processed_at: Optional[datetime]

    class Config:
        from_attributes = True


class DocumentAnalysisResponse(BaseModel):
    document_id: int
    summary: str
    key_clauses: List[dict]
    risk_score: int
    analysis_results: dict


# Helper functions
def validate_file_extension(filename: str) -> bool:
    """Validate file extension"""
    ext = os.path.splitext(filename)[1].lower()
    return ext in settings.ALLOWED_EXTENSIONS


def save_upload_file(upload_file: UploadFile, destination: Path):
    """Save uploaded file to disk"""
    try:
        with destination.open("wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    finally:
        upload_file.file.close()


# API Endpoints
@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    title: Optional[str] = None,
    document_type: DocumentType = DocumentType.OTHER,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload a document for processing
    """
    # Validate file extension
    if not validate_file_extension(file.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    # Check file size
    file_size = 0
    content = await file.read()
    file_size = len(content)
    await file.seek(0)  # Reset file pointer

    if file_size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max size: {settings.MAX_FILE_SIZE / 1024 / 1024}MB"
        )

    # Check document limit
    if current_user.subscription:
        result = await db.execute(
            select(Document).where(Document.owner_id == current_user.id)
        )
        doc_count = len(result.scalars().all())

        if doc_count >= current_user.subscription.document_limit:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Document limit exceeded. Please upgrade your plan."
            )

    # Create upload directory
    upload_dir = Path(settings.UPLOAD_DIR) / str(current_user.id)
    upload_dir.mkdir(parents=True, exist_ok=True)

    # Generate unique filename
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    file_path = upload_dir / filename

    # Save file
    save_upload_file(file, file_path)

    # Create document record
    document = Document(
        title=title or file.filename,
        document_type=document_type,
        filename=file.filename,
        file_path=str(file_path),
        file_size=file_size,
        file_extension=os.path.splitext(file.filename)[1],
        mime_type=file.content_type,
        status=DocumentStatus.PROCESSING,
        owner_id=current_user.id
    )

    db.add(document)
    await db.commit()
    await db.refresh(document)

    # TODO: Trigger async document processing task
    # process_document_task.delay(document.id)

    return DocumentUploadResponse(
        id=document.id,
        title=document.title,
        filename=document.filename,
        file_size=document.file_size,
        status=document.status,
        created_at=document.created_at
    )


@router.get("/", response_model=List[DocumentResponse])
async def get_documents(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 20,
    document_type: Optional[DocumentType] = None
):
    """
    Get user's documents
    """
    query = select(Document).where(Document.owner_id == current_user.id)

    if document_type:
        query = query.where(Document.document_type == document_type)

    query = query.order_by(Document.created_at.desc()).offset(skip).limit(limit)

    result = await db.execute(query)
    documents = result.scalars().all()

    return documents


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get document by ID
    """
    result = await db.execute(
        select(Document).where(
            Document.id == document_id,
            Document.owner_id == current_user.id
        )
    )
    document = result.scalar_one_or_none()

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    return document


@router.get("/{document_id}/analyze", response_model=DocumentAnalysisResponse)
async def analyze_document(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get document analysis results
    """
    result = await db.execute(
        select(Document).where(
            Document.id == document_id,
            Document.owner_id == current_user.id
        )
    )
    document = result.scalar_one_or_none()

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    if document.status != DocumentStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document analysis not completed yet"
        )

    return DocumentAnalysisResponse(
        document_id=document.id,
        summary=document.summary or "",
        key_clauses=document.key_clauses or [],
        risk_score=document.risk_score or 0,
        analysis_results=document.analysis_results or {}
    )


@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a document
    """
    result = await db.execute(
        select(Document).where(
            Document.id == document_id,
            Document.owner_id == current_user.id
        )
    )
    document = result.scalar_one_or_none()

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    # Delete file from disk
    if os.path.exists(document.file_path):
        os.remove(document.file_path)

    # Delete from database
    await db.delete(document)
    await db.commit()

    return {"message": "Document deleted successfully"}
