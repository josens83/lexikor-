"""
Database seeding script for initial data
"""

import asyncio
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.models import (
    User, UserRole,
    Subscription, SubscriptionPlan, SubscriptionStatus,
    LegalCase, Statute
)
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def seed_admin_user(db: AsyncSession):
    """Create admin user"""
    admin_subscription = Subscription(
        plan=SubscriptionPlan.ENTERPRISE,
        status=SubscriptionStatus.ACTIVE,
        query_limit=-1,  # Unlimited
        queries_used=0,
        document_limit=-1,  # Unlimited
        documents_count=0,
        price=0,
        current_period_start=datetime.utcnow(),
        current_period_end=datetime.utcnow() + timedelta(days=365)
    )
    db.add(admin_subscription)
    await db.flush()

    admin_user = User(
        email="admin@lexikor.ai",
        hashed_password=pwd_context.hash("admin123!@#"),
        full_name="LexiKor Admin",
        role=UserRole.ADMIN,
        is_active=True,
        is_verified=True,
        is_superuser=True,
        subscription_id=admin_subscription.id
    )
    db.add(admin_user)
    print("✓ Admin user created (admin@lexikor.ai / admin123!@#)")


async def seed_test_user(db: AsyncSession):
    """Create test user"""
    test_subscription = Subscription(
        plan=SubscriptionPlan.PROFESSIONAL,
        status=SubscriptionStatus.ACTIVE,
        query_limit=-1,
        queries_used=5,
        document_limit=100,
        documents_count=2,
        price=99000,
        current_period_start=datetime.utcnow(),
        current_period_end=datetime.utcnow() + timedelta(days=30)
    )
    db.add(test_subscription)
    await db.flush()

    test_user = User(
        email="test@example.com",
        hashed_password=pwd_context.hash("test1234"),
        full_name="테스트 변호사",
        phone="010-1234-5678",
        role=UserRole.LAWYER,
        is_active=True,
        is_verified=True,
        subscription_id=test_subscription.id
    )
    db.add(test_user)
    print("✓ Test user created (test@example.com / test1234)")


async def seed_legal_cases(db: AsyncSession):
    """Seed sample legal cases"""
    cases = [
        LegalCase(
            case_number="2020다12345",
            case_name="손해배상(기) 청구 사건",
            court="대법원",
            summary="계약 위반으로 인한 손해배상 청구 사건. 원고가 피고의 계약 불이행으로 인해 발생한 손해에 대하여 배상을 청구한 사건.",
            full_text="""판 결 문

사건: 2020다12345 손해배상(기)
원고: 주식회사 ABC
피고: 주식회사 XYZ
선고일: 2020년 6월 15일

주 문
1. 피고는 원고에게 50,000,000원 및 이에 대한 지연손해금을 지급하라.
2. 소송비용은 피고가 부담한다.

이 유
원고와 피고는 2019년 1월 1일 물품 공급 계약을 체결하였다. 피고는 계약상 의무를 이행하지 않았고, 이로 인해 원고는 상당한 손해를 입었다.

계약법상 신의성실의 원칙에 따라 계약 당사자는 계약을 성실히 이행하여야 한다. 피고의 계약 불이행은 명백하며, 원고의 손해와 인과관계가 인정된다.

따라서 원고의 청구를 인용한다.""",
            judgment="피고는 원고에게 50,000,000원 및 이에 대한 지연손해금을 지급하라.",
            reasoning="계약 당사자는 신의성실의 원칙에 따라 계약을 이행해야 하며, 불이행시 손해배상 책임을 진다.",
            case_type="민사",
            legal_area="계약법",
            keywords=["계약", "손해배상", "불이행"],
            decision_date=datetime(2020, 6, 15),
            plaintiff="주식회사 ABC",
            defendant="주식회사 XYZ",
            cited_statutes=["민법 제390조", "민법 제393조"],
            is_precedent=True,
            precedent_level=1
        ),
        LegalCase(
            case_number="2021나56789",
            case_name="임대차보증금 반환 청구",
            court="서울고등법원",
            summary="임대차 계약 종료 후 보증금 반환을 거부한 사건. 임대인의 보증금 반환 의무를 인정.",
            full_text="""판 결 문

사건: 2021나56789 임대차보증금반환
원고: 김○○
피고: 이○○
선고일: 2021년 3월 20일

주 문
1. 피고는 원고에게 30,000,000원을 지급하라.
2. 소송비용은 피고가 부담한다.

이 유
원고와 피고는 2019년 1월 1일부터 2021년 1월 1일까지 2년간 임대차 계약을 체결하였다. 계약 종료 후 피고는 정당한 사유 없이 보증금 반환을 거부하였다.

주택임대차보호법 제3조에 따르면 임대차가 종료된 경우 임대인은 보증금을 반환할 의무가 있다. 피고가 주장하는 원상회복 비용은 통상적인 사용에 따른 마모로 인정되지 않는다.

따라서 원고의 청구를 인용한다.""",
            judgment="피고는 원고에게 30,000,000원을 지급하라.",
            reasoning="임대차 종료시 임대인은 보증금 반환 의무가 있으며, 통상적 사용에 따른 마모는 원상회복 범위에 포함되지 않는다.",
            case_type="민사",
            legal_area="부동산법",
            keywords=["임대차", "보증금", "주택임대차보호법"],
            decision_date=datetime(2021, 3, 20),
            plaintiff="김○○",
            defendant="이○○",
            cited_statutes=["주택임대차보호법 제3조", "민법 제654조"],
            is_precedent=False,
            precedent_level=2
        ),
        LegalCase(
            case_number="2022고단1234",
            case_name="사기 사건",
            court="서울중앙지방법원",
            summary="금전 편취 목적으로 허위 사실을 고지하여 피해자를 기망한 사기 사건.",
            full_text="""판 결 문

사건: 2022고단1234 사기
피고인: 박○○
선고일: 2022년 9월 10일

주 문
피고인을 징역 1년 6월에 처한다.

이 유
피고인은 2021년 5월경 피해자에게 투자하면 고수익을 보장한다고 거짓말하여 5천만원을 편취하였다.

형법 제347조 사기죄의 구성요건인 기망행위, 착오, 재산상 처분행위, 재물 또는 재산상 이익의 취득이 모두 인정된다.

피고인의 범행은 계획적이고 죄질이 불량하며, 피해 회복이 이루어지지 않았으므로 실형을 선고한다.""",
            judgment="피고인을 징역 1년 6월에 처한다.",
            reasoning="기망행위로 재물을 편취한 사기죄가 성립하며, 계획적 범행으로 실형이 필요하다.",
            case_type="형사",
            legal_area="형법",
            keywords=["사기", "기망", "편취"],
            decision_date=datetime(2022, 9, 10),
            plaintiff="검사",
            defendant="박○○",
            cited_statutes=["형법 제347조"],
            is_precedent=False,
            precedent_level=3
        )
    ]

    for case in cases:
        db.add(case)

    print(f"✓ {len(cases)} legal cases added")


async def seed_statutes(db: AsyncSession):
    """Seed sample statutes"""
    statutes = [
        Statute(
            statute_name="민법",
            statute_number="법률 제471호",
            full_text="""민법 전문 (일부 발췌)

제1편 총칙
제1장 통칙
제1조(법원) 민사에 관하여 법률에 규정이 없으면 관습법에 의하고 관습법이 없으면 조리에 의한다.

제2장 인
제3조(권리능력의 존속기간) 사람은 생존한 동안 권리와 의무의 주체가 된다.

제103조(반사회질서의 법률행위) 선량한 풍속 기타 사회질서에 위반한 사항을 내용으로 하는 법률행위는 무효로 한다.

제390조(채무불이행과 손해배상) 채무자가 채무의 내용에 좇은 이행을 하지 아니한 때에는 채권자는 손해배상을 청구할 수 있다.

제393조(손해배상의 범위)
①채무불이행으로 인한 손해배상은 통상의 손해를 그 한도로 한다.
②특별한 사정으로 인한 손해는 채무자가 그 사정을 알았거나 알 수 있었을 때에 한하여 배상의 책임이 있다.""",
            summary="민법은 개인의 재산관계와 가족관계를 규율하는 기본법이다. 계약, 불법행위, 물권, 친족, 상속 등을 규정한다.",
            articles=[
                {"number": "제103조", "title": "반사회질서의 법률행위", "content": "선량한 풍속 기타 사회질서에 위반한 사항을 내용으로 하는 법률행위는 무효로 한다."},
                {"number": "제390조", "title": "채무불이행과 손해배상", "content": "채무자가 채무의 내용에 좇은 이행을 하지 아니한 때에는 채권자는 손해배상을 청구할 수 있다."},
                {"number": "제393조", "title": "손해배상의 범위", "content": "채무불이행으로 인한 손해배상은 통상의 손해를 그 한도로 한다."}
            ],
            statute_type="법률",
            category="민법",
            keywords=["계약", "불법행위", "손해배상", "물권", "친족"],
            enacted_date=datetime(1958, 2, 22),
            effective_date=datetime(1960, 1, 1),
            is_active=True,
            is_repealed=False
        ),
        Statute(
            statute_name="주택임대차보호법",
            statute_number="법률 제1502호",
            full_text="""주택임대차보호법

제1조(목적) 이 법은 주거용 건물의 임대차에 관하여 「민법」에 대한 특례를 규정함으로써 국민의 주거생활의 안정을 보장함을 목적으로 한다.

제3조(대항력 등)
①임대차는 그 등기가 없는 경우에도 임차인이 주택의 인도와 주민등록을 마친 때에는 그 다음 날부터 제3자에 대하여 효력이 생긴다.
②임차권의 대항력과 확정일자를 갖춘 임차권은 담보물권 및 후순위권리자보다 우선하여 보증금을 변제받을 권리가 있다.

제4조(임대차기간 등)
①기간을 정하지 아니하거나 2년 미만으로 정한 임대차는 그 기간을 2년으로 본다.
②임대차가 종료한 경우에도 임차인이 보증금을 반환받을 때까지는 임대차관계가 존속하는 것으로 본다.

제6조(계약갱신 요구 등)
①임대인은 임차인이 임대차기간이 끝나기 6개월 전부터 2개월 전까지 사이에 계약갱신을 요구할 경우 정당한 사유 없이 거절하지 못한다.""",
            summary="주택임대차보호법은 주거용 건물 임대차 계약에 대한 특별법으로, 임차인의 권리를 보호한다.",
            articles=[
                {"number": "제3조", "title": "대항력 등", "content": "임차인이 주택 인도와 주민등록을 마치면 제3자에 대한 효력이 생긴다."},
                {"number": "제4조", "title": "임대차기간 등", "content": "기간을 정하지 않거나 2년 미만으로 정한 경우 2년으로 본다."},
                {"number": "제6조", "title": "계약갱신 요구 등", "content": "임차인은 일정 기간 내 계약갱신을 요구할 수 있다."}
            ],
            statute_type="법률",
            category="부동산법",
            keywords=["임대차", "주택", "보증금", "대항력"],
            enacted_date=datetime(1981, 3, 5),
            effective_date=datetime(1981, 4, 1),
            last_amended_date=datetime(2020, 7, 31),
            is_active=True,
            is_repealed=False
        ),
        Statute(
            statute_name="형법",
            statute_number="법률 제293호",
            full_text="""형법 (일부 발췌)

제1편 총칙
제1조(범죄의 성립과 처벌) 범죄의 성립과 처벌은 행위시의 법률에 의한다.

제2편 죄
제347조(사기)
①사람을 기망하여 재물의 교부를 받거나 재산상의 이익을 취득한 자는 10년 이하의 징역 또는 2천만원 이하의 벌금에 처한다.
②전항의 방법으로 제3자로 하여금 재물의 교부를 받게 하거나 재산상의 이익을 취득하게 한 때에도 전항의 형과 같다.

제350조(공갈)
①사람을 공갈하여 재물의 교부를 받거나 재산상의 이익을 취득한 자는 10년 이하의 징역 또는 2천만원 이하의 벌금에 처한다.

제257조(상해, 존속상해)
①사람의 신체를 상해한 자는 7년 이하의 징역, 10년 이하의 자격정지 또는 1천만원 이하의 벌금에 처한다.""",
            summary="형법은 범죄와 형벌에 관한 기본법으로, 각종 범죄의 구성요건과 형량을 규정한다.",
            articles=[
                {"number": "제347조", "title": "사기", "content": "사람을 기망하여 재물의 교부를 받거나 재산상 이익을 취득한 자를 처벌한다."},
                {"number": "제350조", "title": "공갈", "content": "사람을 공갈하여 재물의 교부를 받거나 재산상 이익을 취득한 자를 처벌한다."},
                {"number": "제257조", "title": "상해", "content": "사람의 신체를 상해한 자를 처벌한다."}
            ],
            statute_type="법률",
            category="형법",
            keywords=["범죄", "형벌", "사기", "공갈", "상해"],
            enacted_date=datetime(1953, 9, 18),
            effective_date=datetime(1953, 10, 3),
            is_active=True,
            is_repealed=False
        )
    ]

    for statute in statutes:
        db.add(statute)

    print(f"✓ {len(statutes)} statutes added")


async def main():
    """Main seeding function"""
    print("Starting database seeding...")

    async with AsyncSessionLocal() as db:
        try:
            await seed_admin_user(db)
            await seed_test_user(db)
            await seed_legal_cases(db)
            await seed_statutes(db)

            await db.commit()
            print("\n✅ Database seeding completed successfully!")
            print("\nLogin credentials:")
            print("  Admin: admin@lexikor.ai / admin123!@#")
            print("  Test:  test@example.com / test1234")

        except Exception as e:
            await db.rollback()
            print(f"\n❌ Error during seeding: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(main())
