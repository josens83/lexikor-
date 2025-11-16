"""
Legal document templates API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

from app.db.session import get_db
from app.models.user import User
from app.api.v1.auth import get_current_active_user

router = APIRouter()


# Pydantic models
class TemplateRequest(BaseModel):
    template_type: str  # lawsuit, contract, notice, opinion
    template_subtype: str  # civil_lawsuit, rental_contract, etc.
    variables: Dict[str, Any]  # Template variables


class TemplateResponse(BaseModel):
    template_type: str
    template_subtype: str
    content: str
    metadata: Dict[str, Any]


class TemplateListItem(BaseModel):
    id: str
    name: str
    description: str
    category: str
    variables: List[str]


# Mock templates database
TEMPLATES = {
    "lawsuit": {
        "civil_lawsuit": {
            "name": "민사소장",
            "description": "일반 민사소송 소장 템플릿",
            "variables": ["plaintiff", "defendant", "claim_amount", "facts", "legal_grounds"],
            "content": """소 장

원고: {plaintiff}
피고: {defendant}

청구취지
피고는 원고에게 {claim_amount}원 및 이에 대한 지연손해금을 지급하라.
소송비용은 피고가 부담한다.
라는 판결을 구합니다.

청구원인
{facts}

입증방법
{evidence}

첨부서류
{attachments}

{date}
원고 {plaintiff} (인)

{court} 귀중
"""
        },
        "criminal_complaint": {
            "name": "형사고소장",
            "description": "형사 고소장 템플릿",
            "variables": ["complainant", "accused", "crime", "facts"],
            "content": """고 소 장

고소인: {complainant}
피고소인: {accused}

고소취지
피고소인의 {crime} 혐의에 대하여 엄중한 처벌을 바랍니다.

고소사실
{facts}

입증방법
{evidence}

{date}
고소인 {complainant} (인)

{police_station} 귀중
"""
        }
    },
    "contract": {
        "rental_contract": {
            "name": "임대차계약서",
            "description": "부동산 임대차 계약서",
            "variables": ["lessor", "lessee", "property", "deposit", "rent", "period"],
            "content": """부동산 임대차 계약서

임대인(갑): {lessor}
임차인(을): {lessee}

제1조(목적물)
{property}

제2조(임대차 기간)
{period}

제3조(차임 등)
1. 보증금: {deposit}원
2. 차임: 월 {rent}원

제4조(계약금)
을은 본 계약 체결과 동시에 계약금으로 {contract_deposit}원을 갑에게 지급하고 갑은 이를 영수한다.

제5조(중도금 및 잔금)
{payment_schedule}

제6조(용도 변경 금지)
을은 갑의 서면 승낙 없이 본 건물의 용도나 구조를 변경하지 못한다.

제7조(계약의 해지)
{termination_clause}

위 계약을 증명하기 위하여 본 계약서를 2통 작성하여 갑, 을이 서명날인 후 각각 1통씩 보관한다.

{date}

갑(임대인) {lessor} (인)
을(임차인) {lessee} (인)
"""
        }
    },
    "notice": {
        "payment_demand": {
            "name": "채권추심 내용증명",
            "description": "채권 추심을 위한 내용증명",
            "variables": ["creditor", "debtor", "amount", "due_date"],
            "content": """내 용 증 명

수신: {debtor}
발신: {creditor}

제목: 채무금 {amount}원 지급 청구

귀하는 {creditor}에 대하여 {due_date}까지 지급하기로 한 {amount}원을 현재까지 지급하지 않고 있습니다.

이에 본 내용증명 발송일로부터 7일 이내에 위 금원을 지급할 것을 최고합니다.

만일 위 기한 내에 지급하지 않을 경우, 법적 조치를 취할 것임을 알려드립니다.

{date}

발신인: {creditor}
주소: {creditor_address}
연락처: {creditor_phone}
"""
        }
    },
    "opinion": {
        "legal_opinion": {
            "name": "법률의견서",
            "description": "일반 법률의견서",
            "variables": ["client", "matter", "question", "analysis", "conclusion"],
            "content": """법률의견서

의뢰인: {client}
사안: {matter}
작성일: {date}

1. 질의사항
{question}

2. 관련 법령
{statutes}

3. 판례
{cases}

4. 검토의견
{analysis}

5. 결론
{conclusion}

작성자: {lawyer}
소속: {law_firm}
"""
        }
    }
}


# API Endpoints
@router.get("/", response_model=List[TemplateListItem])
async def list_templates(
    category: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
):
    """
    Get list of available templates
    """
    templates = []

    for template_type, subtypes in TEMPLATES.items():
        if category and template_type != category:
            continue

        for subtype, data in subtypes.items():
            templates.append(TemplateListItem(
                id=f"{template_type}.{subtype}",
                name=data["name"],
                description=data["description"],
                category=template_type,
                variables=data["variables"]
            ))

    return templates


@router.post("/generate", response_model=TemplateResponse)
async def generate_document(
    request: TemplateRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Generate document from template
    """
    # Get template
    if request.template_type not in TEMPLATES:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template type not found"
        )

    if request.template_subtype not in TEMPLATES[request.template_type]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template subtype not found"
        )

    template = TEMPLATES[request.template_type][request.template_subtype]

    # Validate variables
    missing_vars = set(template["variables"]) - set(request.variables.keys())
    if missing_vars:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Missing required variables: {', '.join(missing_vars)}"
        )

    # Generate document
    try:
        content = template["content"].format(**request.variables)
    except KeyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid variable: {str(e)}"
        )

    return TemplateResponse(
        template_type=request.template_type,
        template_subtype=request.template_subtype,
        content=content,
        metadata={
            "name": template["name"],
            "description": template["description"],
            "generated_at": datetime.utcnow().isoformat()
        }
    )


@router.get("/{template_type}/{template_subtype}")
async def get_template_info(
    template_type: str,
    template_subtype: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Get template information
    """
    if template_type not in TEMPLATES or template_subtype not in TEMPLATES[template_type]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )

    template = TEMPLATES[template_type][template_subtype]

    return {
        "id": f"{template_type}.{template_subtype}",
        "name": template["name"],
        "description": template["description"],
        "category": template_type,
        "variables": template["variables"],
        "sample_content": template["content"][:200] + "..."
    }
