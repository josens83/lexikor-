"""
Legal research API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.db.session import get_db
from app.models.user import User
from app.models.legal_data import LegalCase, Statute
from app.api.v1.auth import get_current_active_user

router = APIRouter()


# Pydantic models
class CaseSearchRequest(BaseModel):
    query: str
    case_type: Optional[str] = None
    legal_area: Optional[str] = None
    court: Optional[str] = None
    year: Optional[int] = None
    limit: int = 10


class CaseResponse(BaseModel):
    id: int
    case_number: str
    case_name: str
    court: str
    case_type: Optional[str]
    summary: str
    decision_date: Optional[datetime]

    class Config:
        from_attributes = True


class StatuteSearchRequest(BaseModel):
    query: str
    statute_type: Optional[str] = None
    category: Optional[str] = None
    limit: int = 10


class StatuteResponse(BaseModel):
    id: int
    statute_name: str
    statute_number: str
    statute_type: Optional[str]
    summary: Optional[str]
    enacted_date: Optional[datetime]
    is_active: bool

    class Config:
        from_attributes = True


# API Endpoints
@router.post("/cases/search", response_model=List[CaseResponse])
async def search_cases(
    search_request: CaseSearchRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Search legal cases (판례 검색)
    """
    query = select(LegalCase)

    # Text search
    if search_request.query:
        search_term = f"%{search_request.query}%"
        query = query.where(
            or_(
                LegalCase.case_name.ilike(search_term),
                LegalCase.summary.ilike(search_term),
                LegalCase.case_number.ilike(search_term)
            )
        )

    # Filters
    if search_request.case_type:
        query = query.where(LegalCase.case_type == search_request.case_type)

    if search_request.legal_area:
        query = query.where(LegalCase.legal_area == search_request.legal_area)

    if search_request.court:
        query = query.where(LegalCase.court.ilike(f"%{search_request.court}%"))

    if search_request.year:
        # Filter by year
        pass  # TODO: Implement year filtering

    # Order and limit
    query = query.order_by(LegalCase.decision_date.desc()).limit(search_request.limit)

    result = await db.execute(query)
    cases = result.scalars().all()

    return cases


@router.get("/cases/{case_id}")
async def get_case_detail(
    case_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get detailed case information
    """
    result = await db.execute(
        select(LegalCase).where(LegalCase.id == case_id)
    )
    case = result.scalar_one_or_none()

    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case not found"
        )

    return {
        "id": case.id,
        "case_number": case.case_number,
        "case_name": case.case_name,
        "court": case.court,
        "case_type": case.case_type,
        "legal_area": case.legal_area,
        "summary": case.summary,
        "full_text": case.full_text,
        "judgment": case.judgment,
        "reasoning": case.reasoning,
        "decision_date": case.decision_date,
        "plaintiff": case.plaintiff,
        "defendant": case.defendant,
        "cited_statutes": case.cited_statutes,
        "cited_cases": case.cited_cases,
        "keywords": case.keywords,
        "source_url": case.source_url
    }


@router.post("/statutes/search", response_model=List[StatuteResponse])
async def search_statutes(
    search_request: StatuteSearchRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Search statutes (법령 검색)
    """
    query = select(Statute)

    # Text search
    if search_request.query:
        search_term = f"%{search_request.query}%"
        query = query.where(
            or_(
                Statute.statute_name.ilike(search_term),
                Statute.summary.ilike(search_term),
                Statute.full_text.ilike(search_term)
            )
        )

    # Filters
    if search_request.statute_type:
        query = query.where(Statute.statute_type == search_request.statute_type)

    if search_request.category:
        query = query.where(Statute.category == search_request.category)

    # Only active statutes
    query = query.where(Statute.is_active == True)

    # Order and limit
    query = query.order_by(Statute.enacted_date.desc()).limit(search_request.limit)

    result = await db.execute(query)
    statutes = result.scalars().all()

    return statutes


@router.get("/statutes/{statute_id}")
async def get_statute_detail(
    statute_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get detailed statute information
    """
    result = await db.execute(
        select(Statute).where(Statute.id == statute_id)
    )
    statute = result.scalar_one_or_none()

    if not statute:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Statute not found"
        )

    return {
        "id": statute.id,
        "statute_name": statute.statute_name,
        "statute_number": statute.statute_number,
        "statute_type": statute.statute_type,
        "category": statute.category,
        "summary": statute.summary,
        "full_text": statute.full_text,
        "articles": statute.articles,
        "enacted_date": statute.enacted_date,
        "effective_date": statute.effective_date,
        "last_amended_date": statute.last_amended_date,
        "is_active": statute.is_active,
        "keywords": statute.keywords,
        "related_statutes": statute.related_statutes,
        "source_url": statute.source_url
    }
