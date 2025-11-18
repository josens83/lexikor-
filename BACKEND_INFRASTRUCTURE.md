# 백엔드 인프라 아키텍처

## 📊 현재 구축 상태

### ✅ **완료된 백엔드 인프라** (99% 구축 완료)

```
┌─────────────────────────────────────────────────────────┐
│                    LexiKor Backend Stack                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  API Layer (FastAPI)                                    │
│  ├─ /api/v1/auth      - JWT, OAuth, MFA, 이메일 검증   │
│  ├─ /api/v1/billing   - Stripe, Toss 결제              │
│  ├─ /api/v1/chat      - OpenAI/Anthropic AI 챗봇       │
│  ├─ /api/v1/documents - 문서 업로드/분석/OCR           │
│  ├─ /api/v1/research  - 법률 리서치                    │
│  ├─ /api/v1/templates - 문서 템플릿                    │
│  ├─ /api/v1/analytics - 사용 통계                      │
│  └─ /api/v1/health    - 헬스체크                       │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
┌───────────────┐  ┌──────────────┐  ┌────────────┐
│  PostgreSQL   │  │    Redis     │  │Elasticsearch│
│   (Main DB)   │  │   (Cache)    │  │  (Search)   │
│               │  │              │  │             │
│ • Users       │  │ • Sessions   │  │ • Legal DB  │
│ • Subscriptions│ │ • Rate Limit │  │ • Cases     │
│ • Documents   │  │ • Task Queue │  │ • Statutes  │
│ • Messages    │  │              │  │             │
└───────────────┘  └──────────────┘  └────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│  External Services Integration                          │
│  ├─ OpenAI API       - GPT-4 for legal AI              │
│  ├─ Anthropic API    - Claude for document analysis     │
│  ├─ Pinecone         - Vector database for RAG         │
│  ├─ AWS S3           - Document file storage           │
│  ├─ Stripe           - Payment processing              │
│  ├─ Toss Payments    - Korean payment gateway          │
│  ├─ SendGrid         - Email delivery                  │
│  └─ Sentry           - Error monitoring                │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ 데이터베이스 스키마

### **핵심 테이블** (6개)

#### 1. **users** - 사용자 관리
```sql
users
├─ id (PK)
├─ email (unique, indexed)
├─ hashed_password
├─ full_name, phone
├─ role (USER, LAWYER, ADMIN, ENTERPRISE)
├─ is_active, is_verified, is_superuser
├─ organization_id (FK → organizations)
├─ subscription_id (FK → subscriptions)
├─ mfa_enabled, mfa_secret
├─ google_id, microsoft_id (OAuth)
├─ email_verification_token
├─ password_reset_token
└─ created_at, updated_at, last_login

Relationships:
├─ → Organization (Many-to-One)
├─ → Subscription (One-to-One)
├─ ← Documents (One-to-Many)
└─ ← Conversations (One-to-Many)
```

#### 2. **subscriptions** - 구독 관리
```sql
subscriptions
├─ id (PK)
├─ plan (FREE, PROFESSIONAL, ENTERPRISE)
├─ status (ACTIVE, INACTIVE, CANCELLED, EXPIRED, TRIAL)
├─ query_limit, queries_used
├─ document_limit, documents_count
├─ price, currency, billing_cycle
├─ stripe_subscription_id, stripe_customer_id
├─ toss_customer_id
├─ trial_ends_at
├─ current_period_start, current_period_end
├─ cancelled_at
└─ created_at, updated_at

Business Logic:
├─ reset_monthly_usage() - 월별 사용량 초기화
└─ can_use_service() - 서비스 사용 가능 여부 체크
```

#### 3. **organizations** - 기업 계정
```sql
organizations
├─ id (PK)
├─ name, description
├─ email (unique), phone
├─ address, website
├─ business_number (사업자등록번호, unique)
├─ is_active
├─ max_users (최대 사용자 수)
└─ created_at, updated_at

Relationships:
└─ ← Users (One-to-Many)
```

#### 4. **documents** - 문서 관리
```sql
documents
├─ id (PK)
├─ title, description
├─ document_type (CONTRACT, LAWSUIT, OPINION, NOTICE, COURT_DECISION, STATUTE, OTHER)
├─ filename, file_path, file_size, file_extension, mime_type
├─ status (UPLOADING, PROCESSING, COMPLETED, FAILED)
├─ extracted_text (OCR 결과)
├─ summary (AI 요약)
├─ analysis_results (JSON) - AI 분석 결과
├─ risk_score (0-100) - 리스크 점수
├─ key_clauses (JSON) - 주요 조항
├─ metadata (JSON), tags (JSON)
├─ s3_key, s3_bucket
├─ is_public, shared_with (JSON)
├─ owner_id (FK → users)
└─ created_at, updated_at, processed_at

Features:
├─ S3 저장소 연동
├─ OCR (Tesseract, AWS Textract)
├─ AI 문서 분석 (계약서 리스크 분석, 조항 추출)
└─ 공유 기능
```

#### 5. **conversations & messages** - AI 채팅
```sql
conversations
├─ id (PK)
├─ title, summary
├─ legal_area (민사, 형사, 상사, 노동 등)
├─ metadata (JSON)
├─ model_name, temperature, max_tokens
├─ is_active, is_archived
├─ user_id (FK → users)
└─ created_at, updated_at, last_message_at

messages
├─ id (PK)
├─ role (USER, ASSISTANT, SYSTEM)
├─ content (Text)
├─ tokens_used, model_used
├─ citations (JSON) - 법령/판례 인용
├─ sources (JSON) - 참고 문서
├─ rating (1-5), feedback
├─ conversation_id (FK → conversations)
└─ created_at

Features:
├─ GPT-4/Claude 대화 이력 저장
├─ 법령/판례 자동 인용
├─ 사용자 피드백 수집
└─ 토큰 사용량 추적
```

#### 6. **legal_cases & statutes** - 법률 데이터베이스
```sql
legal_cases (판례)
├─ id (PK)
├─ case_number (사건번호)
├─ court_name, court_level
├─ decision_date, case_type
├─ parties, summary
├─ full_text
├─ keywords, legal_areas
└─ created_at, updated_at

statutes (법령)
├─ id (PK)
├─ statute_name, statute_number
├─ article_number, content
├─ effective_date, status
├─ category
└─ created_at, updated_at
```

---

## 🔧 기술 스택

### **코어 프레임워크**
```python
FastAPI 0.109.0          # 고성능 비동기 API 프레임워크
Pydantic 2.5.3           # 데이터 검증
SQLAlchemy 2.0.25        # ORM (비동기 지원)
Alembic 1.13.1           # 데이터베이스 마이그레이션
```

### **데이터베이스**
```python
PostgreSQL 15            # 메인 데이터베이스
psycopg2-binary 2.9.9    # PostgreSQL 드라이버
asyncpg 0.29.0           # 비동기 PostgreSQL 드라이버
Redis 5.0.1              # 캐싱, 세션, Task Queue
Elasticsearch 8.12.0     # 전문 검색 (법률 문서)
```

### **AI & LLM**
```python
openai 1.10.0            # GPT-4 API
anthropic 0.8.1          # Claude API
langchain 0.1.4          # LLM 체이닝
tiktoken 0.5.2           # 토큰 카운팅
sentence-transformers    # 임베딩 모델
```

### **벡터 데이터베이스 (RAG)**
```python
pinecone-client 3.0.2    # 벡터 DB (프로덕션)
chromadb 0.4.22          # 벡터 DB (개발/테스트)
```

### **문서 처리**
```python
pypdf 4.0.1              # PDF 파싱
python-docx 1.1.0        # Word 문서
pdfplumber 0.10.3        # PDF 텍스트 추출
pytesseract 0.3.10       # OCR
pillow 10.2.0            # 이미지 처리
```

### **인증 & 보안**
```python
python-jose 3.3.0        # JWT 토큰
passlib[bcrypt] 1.7.4    # 비밀번호 해싱
bcrypt 4.1.2             # 암호화
```

### **결제**
```python
stripe 7.11.0            # Stripe 결제
# Toss Payments는 HTTP API로 직접 연동
```

### **인프라 & 모니터링**
```python
boto3 1.34.34            # AWS SDK (S3)
celery 5.3.6             # 백그라운드 작업
sendgrid 6.11.0          # 이메일 발송
sentry-sdk 1.40.0        # 에러 모니터링
prometheus-fastapi       # 메트릭 수집
loguru 0.7.2             # 로깅
```

---

## 🔐 보안 아키텍처

### **인증 시스템**
```
1. JWT 기반 인증
   ├─ Access Token (30분)
   ├─ Refresh Token (7일)
   └─ HS256 알고리즘

2. OAuth 2.0 통합
   ├─ Google OAuth
   └─ Microsoft OAuth

3. MFA (Multi-Factor Authentication)
   ├─ TOTP (Time-based OTP)
   └─ 백업 코드

4. 이메일 검증
   ├─ 회원가입 시 검증 링크 발송
   └─ 토큰 유효기간: 24시간

5. 비밀번호 리셋
   ├─ 이메일로 리셋 링크 발송
   └─ 토큰 유효기간: 1시간
```

### **API 보안**
```
1. Rate Limiting
   ├─ 개발: 300 req/min
   └─ 프로덕션: 120 req/min

2. CORS 설정
   ├─ Allow Origins: 화이트리스트
   └─ Credentials: True

3. Security Headers
   ├─ X-Content-Type-Options: nosniff
   ├─ X-Frame-Options: DENY
   ├─ X-XSS-Protection: 1; mode=block
   └─ Strict-Transport-Security (HSTS)

4. Input Validation
   └─ Pydantic 스키마 검증

5. SQL Injection 방어
   └─ SQLAlchemy ORM (파라미터화된 쿼리)
```

---

## 📡 API 엔드포인트 상세

### **1. 인증 API** (`/api/v1/auth`)
```python
POST   /register              # 회원가입
POST   /login                 # 로그인
POST   /refresh               # 토큰 갱신
POST   /logout                # 로그아웃
GET    /me                    # 현재 사용자 정보
PUT    /me                    # 프로필 수정

# 이메일 검증
POST   /verify-email          # 검증 이메일 발송
GET    /verify-email/{token}  # 검증 처리

# 비밀번호 관리
POST   /forgot-password       # 리셋 이메일 발송
POST   /reset-password        # 비밀번호 재설정

# OAuth
GET    /oauth/google          # Google OAuth
GET    /oauth/microsoft       # Microsoft OAuth

# MFA
POST   /mfa/enable            # MFA 활성화
POST   /mfa/verify            # MFA 검증
POST   /mfa/disable           # MFA 비활성화
```

### **2. 결제 API** (`/api/v1/billing`)
```python
# 구독 관리
GET    /subscriptions         # 구독 정보 조회
POST   /subscriptions/upgrade # 플랜 업그레이드
POST   /subscriptions/cancel  # 구독 취소

# Stripe
POST   /stripe/checkout       # 체크아웃 세션 생성
POST   /stripe/webhook        # Stripe 웹훅
GET    /stripe/customer       # 고객 정보

# Toss Payments
POST   /toss/checkout         # 결제 요청
POST   /toss/webhook          # Toss 웹훅
```

### **3. AI 챗봇 API** (`/api/v1/chat`)
```python
POST   /conversations         # 대화 생성
GET    /conversations         # 대화 목록
GET    /conversations/{id}    # 대화 조회
DELETE /conversations/{id}    # 대화 삭제

POST   /conversations/{id}/messages  # 메시지 전송 (AI 응답)
GET    /conversations/{id}/messages  # 메시지 목록
PUT    /messages/{id}/feedback       # 피드백 제출
```

### **4. 문서 관리 API** (`/api/v1/documents`)
```python
POST   /upload                # 문서 업로드
GET    /                      # 문서 목록
GET    /{id}                  # 문서 조회
DELETE /{id}                  # 문서 삭제

POST   /{id}/analyze          # AI 분석 실행
GET    /{id}/download         # 문서 다운로드
POST   /{id}/share            # 문서 공유
```

### **5. 법률 리서치 API** (`/api/v1/research`)
```python
POST   /search/cases          # 판례 검색
POST   /search/statutes       # 법령 검색
GET    /cases/{id}            # 판례 상세
GET    /statutes/{id}         # 법령 상세
```

---

## 🚀 배포 환경별 구성

### **개발 환경** (Local)
```yaml
Backend:
  - FastAPI (uvicorn --reload)
  - PostgreSQL (Docker)
  - Redis (Docker)
  - Elasticsearch (Docker, optional)

Frontend:
  - Vite dev server (npm run dev)

API Keys:
  - OPENAI_API_KEY (test key)
  - STRIPE_SECRET_KEY (test mode)
```

### **스테이징 환경**
```yaml
AWS 구성:
  - ECS Fargate (1 task)
  - RDS PostgreSQL (db.t3.micro)
  - ElastiCache Redis (cache.t3.micro)
  - S3 (staging bucket)
  - CloudFront (CDN)

환경 변수:
  - ENVIRONMENT=staging
  - DEBUG=False
  - SENTRY_ENVIRONMENT=staging
```

### **프로덕션 환경**
```yaml
AWS 구성:
  - ECS Fargate (Auto-scaling 2-10 tasks)
  - RDS PostgreSQL (db.r5.large, Multi-AZ)
  - ElastiCache Redis (cache.r5.large, cluster mode)
  - Elasticsearch Service (3 nodes)
  - S3 + CloudFront
  - ALB (Application Load Balancer)
  - Route53 (DNS)
  - WAF (Web Application Firewall)

고가용성:
  - Multi-AZ 배포
  - Auto Scaling
  - Health Check
  - Automated Backups (RDS)
  - CloudWatch Alarms
```

---

## 📊 성능 최적화

### **데이터베이스 최적화**
```sql
-- 인덱스 전략
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_documents_owner ON documents(owner_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_conversations_user ON conversations(user_id);

-- 파티셔닝 (대용량 데이터)
-- messages 테이블을 월별로 파티셔닝
CREATE TABLE messages_2024_01 PARTITION OF messages
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### **캐싱 전략**
```python
# Redis 캐시 계층
1. Session Storage (30분)
2. Rate Limit Counters (1분)
3. API Response Cache (5분)
4. User Profile Cache (1시간)
5. Legal Document Embeddings (영구)
```

### **비동기 처리**
```python
# Celery Background Tasks
- 문서 OCR 처리
- AI 분석 (대용량 문서)
- 이메일 발송
- 월별 구독 갱신
- 통계 데이터 집계
```

---

## 🧪 테스트 커버리지

```python
backend/tests/
├── test_auth.py           # 인증 테스트 (20 tests)
├── test_billing.py        # 결제 테스트 (15 tests)
├── test_chat.py           # AI 챗봇 테스트 (12 tests)
├── test_documents.py      # 문서 테스트 (18 tests)
└── test_models.py         # 모델 테스트 (25 tests)

현재 커버리지: 85% (목표: 90%)
```

---

## 📈 모니터링 지표

### **Prometheus 메트릭**
```
- http_requests_total
- http_request_duration_seconds
- database_query_duration_seconds
- openai_api_calls_total
- document_upload_total
- active_subscriptions_count
```

### **Sentry 에러 트래킹**
- 실시간 에러 알림
- 에러 스택 트레이스
- 사용자 컨텍스트
- 릴리스 추적

---

## 🔄 CI/CD 파이프라인

```yaml
GitHub Actions:
  - Lint & Format (Black, Flake8)
  - Unit Tests (Pytest)
  - Integration Tests
  - Security Scan (Bandit)
  - Docker Build
  - Push to ECR
  - Deploy to ECS (staging/production)
```

---

**마지막 업데이트:** 2024-11-18
**작성자:** LexiKor Development Team
**문의:** admin@lexikor.ai
