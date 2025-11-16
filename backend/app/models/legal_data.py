"""
Legal data models (cases, statutes)
"""

from sqlalchemy import Column, String, DateTime, Integer, Text, JSON, Boolean
from sqlalchemy.sql import func

from app.db.base import Base


class LegalCase(Base):
    """Legal case (판례) model"""
    __tablename__ = "legal_cases"

    id = Column(Integer, primary_key=True, index=True)

    # Case identification
    case_number = Column(String, unique=True, index=True)  # 사건번호
    case_name = Column(String, nullable=False)
    court = Column(String)  # 법원

    # Content
    summary = Column(Text)
    full_text = Column(Text)
    judgment = Column(Text)  # 판결 주문
    reasoning = Column(Text)  # 판결 이유

    # Classification
    case_type = Column(String)  # 민사, 형사, 행정 etc.
    legal_area = Column(String)  # 계약법, 불법행위, 형법 etc.
    keywords = Column(JSON)

    # Dates
    decision_date = Column(DateTime(timezone=True))
    filing_date = Column(DateTime(timezone=True), nullable=True)

    # Parties
    plaintiff = Column(String, nullable=True)
    defendant = Column(String, nullable=True)

    # Citations
    cited_statutes = Column(JSON)  # 인용 법령
    cited_cases = Column(JSON)  # 인용 판례

    # Source
    source_url = Column(String, nullable=True)
    pdf_url = Column(String, nullable=True)

    # Metadata
    is_precedent = Column(Boolean, default=False)  # 중요 판례 여부
    precedent_level = Column(Integer, nullable=True)  # 1: 대법원, 2: 고법, 3: 지법

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<LegalCase {self.case_number}>"


class Statute(Base):
    """Statute (법령) model"""
    __tablename__ = "statutes"

    id = Column(Integer, primary_key=True, index=True)

    # Statute identification
    statute_name = Column(String, nullable=False, index=True)  # 법령명
    statute_number = Column(String, unique=True, index=True)  # 법령번호

    # Content
    full_text = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)

    # Structure
    articles = Column(JSON)  # 조문 구조

    # Classification
    statute_type = Column(String)  # 헌법, 법률, 대통령령, 부령 etc.
    category = Column(String)  # 민법, 상법, 형법 etc.
    keywords = Column(JSON)

    # Dates
    enacted_date = Column(DateTime(timezone=True))
    effective_date = Column(DateTime(timezone=True))
    last_amended_date = Column(DateTime(timezone=True), nullable=True)

    # Status
    is_active = Column(Boolean, default=True)
    is_repealed = Column(Boolean, default=False)

    # Source
    source_url = Column(String, nullable=True)

    # Relationships
    related_statutes = Column(JSON)  # 관련 법령
    amendments = Column(JSON)  # 개정 이력

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Statute {self.statute_name}>"
