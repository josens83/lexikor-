# LexiKor 백엔드 배포 가이드

## 📋 목차
1. [인프라 요구사항](#인프라-요구사항)
2. [로컬 개발 환경 설정](#로컬-개발-환경-설정)
3. [프로덕션 배포](#프로덕션-배포)
4. [데이터베이스 관리](#데이터베이스-관리)
5. [모니터링 & 로깅](#모니터링--로깅)

---

## 🏗️ 인프라 요구사항

### 필수 서비스
- **PostgreSQL 15+** - 메인 데이터베이스
- **Redis 7+** - 캐싱 & 세션 관리
- **Elasticsearch 8.11+** - 법률 문서 전문 검색 (선택)
- **AWS S3** - 문서 파일 저장소
- **Pinecone** - 벡터 데이터베이스 (AI 검색)

### 외부 API 키 (필수)
```bash
OPENAI_API_KEY          # GPT-4 for AI chat
STRIPE_SECRET_KEY       # 결제 처리 (Stripe)
TOSS_SECRET_KEY         # 결제 처리 (토스페이먼츠)
AWS_ACCESS_KEY_ID       # S3 문서 저장
SENDGRID_API_KEY        # 이메일 발송
PINECONE_API_KEY        # 벡터 검색
```

---

## 🛠️ 로컬 개발 환경 설정

### 1단계: 환경 변수 설정

```bash
# backend/.env 파일 생성
cd backend
cp .env.example .env
```

**.env 파일 편집** (최소 필수 항목):
```bash
# 개발 환경
ENVIRONMENT=development
DEBUG=True
SECRET_KEY=dev-secret-key-min-32-chars-change-me-12345678

# Database (Docker 사용 시 기본값)
DATABASE_URL=postgresql+asyncpg://lexikor:lexikor_password@localhost:5432/lexikor_db

# OpenAI (필수!)
OPENAI_API_KEY=sk-your-openai-api-key-here

# JWT
JWT_SECRET_KEY=your-jwt-secret-key-min-32-chars-random-string-here

# AWS S3 (개발 시에는 로컬 스토리지 사용 가능)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=lexikor-dev-documents

# Stripe (개발 시 테스트 키 사용)
STRIPE_SECRET_KEY=sk_test_...
```

### 2단계: Docker Compose로 인프라 시작

```bash
# 프로젝트 루트에서 실행
docker compose up -d postgres redis elasticsearch

# 서비스 상태 확인
docker compose ps

# 로그 확인
docker compose logs -f postgres
```

**예상 출력:**
```
NAME                   COMMAND                  SERVICE         STATUS
lexikor-postgres       "docker-entrypoint.s…"   postgres        Up 30 seconds (healthy)
lexikor-redis          "redis-server"           redis           Up 30 seconds (healthy)
lexikor-elasticsearch  "/bin/tini -- /usr/l…"   elasticsearch   Up 30 seconds
```

### 3단계: 데이터베이스 초기화

```bash
cd backend

# Python 가상환경 생성 (선택)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# Alembic 마이그레이션 실행
alembic upgrade head

# 시드 데이터 삽입 (관리자 계정 생성)
python scripts/seed_db.py
```

**시드 데이터 생성 결과:**
- 관리자 계정: `admin@lexikor.ai` / `admin123!@#`
- 테스트 사용자: `test@example.com` / `test123`
- 샘플 법률 데이터

### 4단계: 백엔드 API 서버 실행

```bash
# 개발 모드 (Hot reload)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 또는 Docker Compose로 전체 실행
cd ..
docker compose up backend
```

**API 서버 확인:**
- Swagger 문서: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health Check: http://localhost:8000/api/v1/health

### 5단계: 프론트엔드 연결

```bash
cd frontend

# 환경 변수 설정
echo "VITE_API_URL=http://localhost:8000" > .env

# 개발 서버 실행
npm install
npm run dev
```

---

## 🚀 프로덕션 배포

### AWS 배포 아키텍처 (권장)

```
┌─────────────────────────────────────────┐
│  CloudFront (CDN)                       │
│  - Frontend (React SPA)                 │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│  Application Load Balancer              │
└─────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────────────┐   ┌───────────────┐
│   ECS Fargate │   │   ECS Fargate │
│   Backend API │   │   Backend API │
│   (Multi-AZ)  │   │   (Multi-AZ)  │
└───────────────┘   └───────────────┘
        │                   │
        └─────────┬─────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
┌─────────┐  ┌──────────┐  ┌────────────┐
│   RDS   │  │ElastiCache│ │Elasticsearch│
│(PostgreSQL)│ │  (Redis) │ │   Service   │
└─────────┘  └──────────┘  └────────────┘
```

### 프로덕션 환경 변수

```bash
# 프로덕션 .env
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=RANDOM-SECURE-KEY-64-CHARS-MIN-CHANGE-IN-PRODUCTION-12345678901234567890

# Database (RDS)
DATABASE_URL=postgresql+asyncpg://lexikor:SECURE_PASSWORD@lexikor-db.abc123.ap-northeast-2.rds.amazonaws.com:5432/lexikor_prod

# Redis (ElastiCache)
REDIS_URL=redis://lexikor-cache.abc123.0001.apn2.cache.amazonaws.com:6379/0

# API Keys (Production)
OPENAI_API_KEY=sk-proj-...
STRIPE_SECRET_KEY=sk_live_...
TOSS_SECRET_KEY=live_sk_...
AWS_S3_BUCKET=lexikor-prod-documents

# Security
ENABLE_HTTPS=True
ENABLE_CORS=True
CORS_ORIGINS=https://lexikor.ai,https://www.lexikor.ai,https://app.lexikor.ai
ALLOWED_HOSTS=lexikor.ai,www.lexikor.ai,app.lexikor.ai

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=production
```

### Docker 프로덕션 배포

```bash
# 1. 이미지 빌드
docker build -t lexikor-backend:latest ./backend
docker build -t lexikor-frontend:latest ./frontend

# 2. ECR에 푸시 (AWS)
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 123456789.dkr.ecr.ap-northeast-2.amazonaws.com
docker tag lexikor-backend:latest 123456789.dkr.ecr.ap-northeast-2.amazonaws.com/lexikor-backend:latest
docker push 123456789.dkr.ecr.ap-northeast-2.amazonaws.com/lexikor-backend:latest

# 3. ECS 배포 (Fargate)
aws ecs update-service --cluster lexikor-prod --service backend --force-new-deployment
```

---

## 🗄️ 데이터베이스 관리

### 마이그레이션 생성

```bash
# 모델 변경 후 마이그레이션 생성
alembic revision --autogenerate -m "Add new field to User model"

# 생성된 파일 확인
# backend/alembic/versions/003_add_new_field_to_user_model.py

# 마이그레이션 적용
alembic upgrade head
```

### 백업 & 복원

```bash
# PostgreSQL 백업
docker exec lexikor-postgres pg_dump -U lexikor lexikor_db > backup_$(date +%Y%m%d).sql

# 복원
docker exec -i lexikor-postgres psql -U lexikor lexikor_db < backup_20240101.sql

# 프로덕션 (RDS) 자동 백업 설정
# - RDS Console에서 Automated Backups 활성화
# - Retention Period: 7-30일
# - Snapshot: 매일 자동
```

### DB 상태 확인

```bash
# PostgreSQL 접속
docker exec -it lexikor-postgres psql -U lexikor -d lexikor_db

# 테이블 목록
\dt

# 사용자 수 확인
SELECT COUNT(*) FROM users;

# 구독 현황
SELECT plan, status, COUNT(*)
FROM subscriptions
GROUP BY plan, status;
```

---

## 📊 모니터링 & 로깅

### Health Check 엔드포인트

```bash
# 전체 시스템 상태
curl http://localhost:8000/api/v1/health

# 응답 예시
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "database": {
    "status": "connected",
    "latency_ms": 12.5
  },
  "redis": {
    "status": "connected",
    "latency_ms": 2.1
  },
  "elasticsearch": {
    "status": "connected",
    "cluster_health": "green"
  }
}
```

### Prometheus 메트릭

```python
# 자동으로 수집되는 메트릭 (prometheus-fastapi-instrumentator)
- http_requests_total
- http_request_duration_seconds
- http_requests_in_progress
```

**Prometheus 설정:**
```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'lexikor-backend'
    static_configs:
      - targets: ['backend:8000']
```

### Sentry 에러 트래킹

```python
# 이미 main.py에 설정됨
# .env에 SENTRY_DSN만 추가하면 자동 활성화
SENTRY_DSN=https://abc123@sentry.io/123456
```

### 로그 수집

```bash
# Docker Compose 로그
docker compose logs -f backend

# 프로덕션 (CloudWatch Logs)
aws logs tail /ecs/lexikor-backend --follow
```

---

## 🧪 테스트

### 단위 테스트

```bash
cd backend

# 전체 테스트 실행
pytest

# 커버리지 리포트
pytest --cov=app --cov-report=html
open htmlcov/index.html
```

### API 테스트

```bash
# 회원가입
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "full_name": "Test User"
  }'

# 로그인
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

---

## 🔒 보안 체크리스트

### 배포 전 필수 확인

- [ ] `SECRET_KEY` 변경 (64자 이상 랜덤 문자열)
- [ ] `JWT_SECRET_KEY` 변경 (32자 이상)
- [ ] DB 비밀번호 변경 (기본값 `lexikor_password` 절대 사용 금지)
- [ ] HTTPS 활성화 (`ENABLE_HTTPS=True`)
- [ ] CORS Origins 제한 (와일드카드 사용 금지)
- [ ] Rate Limiting 활성화
- [ ] Sentry DSN 설정 (에러 모니터링)
- [ ] API 키들을 환경 변수로 관리 (코드에 하드코딩 금지)
- [ ] S3 버킷 권한 설정 (Public Access 차단)
- [ ] RDS 보안 그룹 설정 (VPC 내부만 접근 허용)

---

## 📞 트러블슈팅

### 문제 1: DB 연결 실패

```bash
# PostgreSQL 상태 확인
docker compose ps postgres

# 로그 확인
docker compose logs postgres

# 연결 테스트
docker exec lexikor-postgres pg_isready -U lexikor

# 해결: docker-compose.yml의 healthcheck 대기
```

### 문제 2: Alembic 마이그레이션 실패

```bash
# 현재 마이그레이션 버전 확인
alembic current

# 마이그레이션 히스토리
alembic history

# 특정 버전으로 롤백
alembic downgrade -1

# 마이그레이션 재생성
alembic revision --autogenerate -m "fix migration"
```

### 문제 3: CORS 에러

```bash
# backend/.env 확인
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# 프론트엔드 URL이 CORS_ORIGINS에 포함되어 있는지 확인
```

---

## 📚 참고 자료

- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 문서](https://docs.sqlalchemy.org/)
- [Alembic 마이그레이션](https://alembic.sqlalchemy.org/)
- [Docker Compose 레퍼런스](https://docs.docker.com/compose/)
- [AWS ECS 배포 가이드](https://docs.aws.amazon.com/ecs/)

---

## 🎯 다음 단계

1. **로컬 환경에서 전체 스택 실행** (`docker compose up`)
2. **API 테스트** (Swagger UI에서 직접 테스트)
3. **프론트엔드 연결 확인** (로그인/회원가입 플로우)
4. **결제 테스트** (Stripe Test Mode)
5. **AI 챗봇 테스트** (OpenAI API 연동 확인)
6. **프로덕션 배포** (AWS ECS/RDS)

---

**마지막 업데이트:** 2024-11-18
**문의:** admin@lexikor.ai
