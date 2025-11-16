# LexiKor - 한국형 법률 AI 플랫폼

Harvey AI 스타일의 종합 법률 AI 어시스턴트 플랫폼

## 🎯 프로젝트 개요

LexiKor는 한국 법률 시장을 위한 AI 기반 법률 서비스 플랫폼입니다.
- **대상**: B2B (법률사무소) 및 B2C (개인 변호사)
- **비즈니스 모델**: SaaS 월 구독 (Free/Pro/Enterprise)

## 🏗️ 시스템 아키텍처

```
lexikor/
├── backend/          # Python FastAPI 백엔드
├── frontend/         # React + TypeScript 프론트엔드
├── data_pipeline/    # 법률 데이터 크롤링 및 처리
├── infrastructure/   # Docker, K8s, Terraform
└── docs/            # 문서화
```

## 🚀 핵심 기능

### 1. AI 채팅 & 법률 상담
- GPT-4 기반 법률 질의응답
- 관련 판례 및 법령 자동 인용
- 실시간 스트리밍 응답

### 2. 문서 처리 & 분석
- PDF/Word/HWP 문서 업로드
- 계약서 자동 검토 및 위험 요소 식별
- 조항별 분석 및 수정 제안

### 3. RAG 기반 법률 검색
- 벡터 데이터베이스 기반 시맨틱 검색
- 판례, 법령, 논문 통합 검색
- 하이브리드 검색 (벡터 + 키워드)

### 4. 법률 문서 자동 생성
- 소장, 계약서, 내용증명 템플릿
- AI 기반 문서 초안 작성
- 맞춤형 조항 생성

### 5. 협업 & 관리
- 팀 워크스페이스
- 문서 공유 및 공동 편집
- 사용량 분석 대시보드

## 💰 가격 정책

| 플랜 | 가격 | 쿼리 제한 | 문서 저장 | 주요 기능 |
|------|------|-----------|-----------|-----------|
| **Free** | 무료 | 20회/월 | 5개 | 기본 채팅, 문서 요약 |
| **Professional** | ₩99,000/월 | 무제한 | 100개 | 전체 기능, 우선 지원 |
| **Enterprise** | 맞춤 견적 | 무제한 | 무제한 | 전용 서버, API, 커스터마이징 |

## 🔐 보안 & 컴플라이언스

- **암호화**: AES-256-GCM (저장), TLS 1.3 (전송)
- **인증**: JWT + MFA, SSO 지원
- **컴플라이언스**: GDPR, ISO27001, SOC2 Type II
- **데이터 보관**: 한국 리전 전용

## 🛠️ 기술 스택

### 백엔드
- **프레임워크**: FastAPI (Python 3.11+)
- **데이터베이스**: PostgreSQL, Redis, Pinecone
- **LLM**: OpenAI GPT-4, Anthropic Claude
- **검색**: Elasticsearch
- **작업 큐**: Celery + SQS

### 프론트엔드
- **프레임워크**: React 18 + TypeScript
- **상태관리**: Redux Toolkit
- **UI 라이브러리**: Ant Design + TailwindCSS
- **빌드 도구**: Vite

### 인프라
- **컨테이너**: Docker, Kubernetes (EKS)
- **CI/CD**: GitHub Actions
- **모니터링**: Prometheus, Grafana, Sentry
- **클라우드**: AWS (primary), GCP (backup)

## 📋 설치 및 실행

### 사전 요구사항
- Docker & Docker Compose
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+

### 로컬 개발 환경 설정

```bash
# 레포지토리 클론
git clone https://github.com/josens83/lexikor-.git
cd lexikor-

# 환경 변수 설정
cp .env.example .env
# .env 파일에 API 키 등 설정

# Docker Compose로 전체 스택 실행
docker-compose up -d

# 백엔드 접속: http://localhost:8000
# 프론트엔드 접속: http://localhost:3000
```

### 개별 서비스 실행

#### 백엔드
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 프론트엔드
```bash
cd frontend
npm install
npm run dev
```

## 📊 데이터베이스 스키마

### 주요 테이블
- `users` - 사용자 정보
- `organizations` - 조직/법률사무소
- `subscriptions` - 구독 관리
- `documents` - 업로드 문서
- `conversations` - AI 채팅 기록
- `legal_cases` - 판례 데이터
- `statutes` - 법령 데이터

## 🧪 테스트

```bash
# 백엔드 테스트
cd backend
pytest tests/ -v --cov

# 프론트엔드 테스트
cd frontend
npm run test
npm run test:e2e
```

## 📈 로드맵

### Phase 1 - MVP (✅ 완료)
- ✅ 기본 프로젝트 구조
- ✅ 사용자 인증/인가 (JWT + MFA)
- ✅ AI 채팅 인터페이스 (OpenAI GPT-4 통합)
- ✅ 문서 업로드/관리 (실제 파일 처리)
- ✅ 기본 RAG 시스템 (모의 데이터)
- ✅ 결제 시스템 (Stripe 연동 준비)
- ✅ 전체 UI 완성 (9개 페이지)
- ✅ 데이터베이스 설계 및 마이그레이션
- ✅ Docker 환경 구성
- ✅ 법률 검색 (판례/법령)
- ✅ 문서 템플릿 생성 (8개 템플릿)
- ✅ 대시보드 Analytics
- ✅ Settings 관리

### Phase 2 - 핵심 기능 (일부 완료)
- ✅ 법률 문서 템플릿 엔진
- ✅ 조직/팀 모델 (데이터베이스)
- ✅ 구독 관리 시스템
- ⬜ 고급 RAG with 리랭킹 (벡터 DB 연동 필요)
- ⬜ 실시간 문서 공동 편집
- ⬜ 이메일 인증 및 알림
- ⬜ 실제 문서 분석 (PDF/DOCX 파싱)

### Phase 3 - 확장
- ⬜ 벡터 데이터베이스 연동 (Pinecone/ChromaDB)
- ⬜ Elasticsearch 통합 검색
- ⬜ 다중 LLM 지원 (Claude, Llama)
- ⬜ 공개 API
- ⬜ 모바일 앱 (React Native)
- ⬜ 지식 그래프 구축

### Phase 4 - 고도화
- ⬜ AI 모델 파인튜닝
- ⬜ 예측 분석 기능
- ⬜ 글로벌 확장 (영어 지원)
- ⬜ 음성 인터페이스

## 📝 API 문서

API 문서는 다음 URL에서 확인 가능합니다:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🤝 기여 가이드

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 연락처

- 이메일: support@lexikor.ai
- 웹사이트: https://lexikor.ai
- 문의: https://github.com/josens83/lexikor-/issues

## ⚠️ 법적 고지

본 서비스는 법률 정보 제공 도구이며, 정식 법률 자문을 대체하지 않습니다.
중요한 법률 문제는 반드시 자격을 갖춘 변호사와 상담하시기 바랍니다.

---

Made with ❤️ for Korean Legal Professionals
