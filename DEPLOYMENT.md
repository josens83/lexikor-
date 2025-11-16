# LexiKor 배포 가이드

## 로컬 개발 환경 설정

### 사전 요구사항
- Docker & Docker Compose
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+ (또는 Docker 사용)

### 빠른 시작 (Docker)

```bash
# 1. 레포지토리 클론
git clone https://github.com/josens83/lexikor-.git
cd lexikor-

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 필요한 API 키 설정

# 3. Docker로 전체 스택 실행
make up

# 또는
docker-compose up -d
```

서비스 접속:
- **백엔드 API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs
- **프론트엔드**: http://localhost:3000

### 로컬 개발 (Docker 없이)

#### 백엔드 설정

```bash
cd backend

# 가상환경 생성
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 데이터베이스 마이그레이션
alembic upgrade head

# 서버 실행
uvicorn app.main:app --reload --port 8000
```

#### 프론트엔드 설정

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 프로덕션 배포

### AWS 배포 (권장)

#### 1. 인프라 설정 (Terraform)

```bash
cd infrastructure/terraform/aws

# Terraform 초기화
terraform init

# 인프라 배포 계획 확인
terraform plan

# 인프라 배포
terraform apply
```

#### 2. 백엔드 배포 (ECS/Fargate)

```bash
# Docker 이미지 빌드
docker build -t lexikor-backend:latest ./backend

# ECR에 푸시
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com
docker tag lexikor-backend:latest <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/lexikor-backend:latest
docker push <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/lexikor-backend:latest

# ECS 서비스 업데이트
aws ecs update-service --cluster lexikor-cluster --service lexikor-backend --force-new-deployment
```

#### 3. 프론트엔드 배포 (S3 + CloudFront)

```bash
cd frontend

# 프로덕션 빌드
npm run build

# S3에 배포
aws s3 sync dist/ s3://lexikor-frontend-bucket --delete

# CloudFront 캐시 무효화
aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"
```

### Kubernetes 배포

```bash
cd infrastructure/kubernetes

# 네임스페이스 생성
kubectl create namespace lexikor

# Secrets 생성
kubectl create secret generic lexikor-secrets \
  --from-env-file=.env \
  --namespace=lexikor

# 배포
kubectl apply -f deployments/ -n lexikor
kubectl apply -f services/ -n lexikor

# 상태 확인
kubectl get pods -n lexikor
kubectl get services -n lexikor
```

## 환경 변수 설정

### 필수 환경 변수

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:password@host:port/db

# Redis
REDIS_URL=redis://host:port/0

# OpenAI (AI 기능)
OPENAI_API_KEY=sk-...

# AWS (파일 저장)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=lexikor-documents

# Stripe (결제)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Security
SECRET_KEY=<strong-random-string>
JWT_SECRET_KEY=<strong-random-string>
```

## 데이터베이스 마이그레이션

### Alembic 사용

```bash
cd backend

# 새 마이그레이션 생성
alembic revision --autogenerate -m "description"

# 마이그레이션 적용
alembic upgrade head

# 롤백
alembic downgrade -1
```

## 모니터링 및 로그

### 로그 확인

```bash
# Docker 로그
docker-compose logs -f backend
docker-compose logs -f frontend

# Kubernetes 로그
kubectl logs -f deployment/lexikor-backend -n lexikor
```

### 모니터링

- **Prometheus**: http://localhost:9090 (Docker)
- **Grafana**: http://localhost:3001 (Docker)
- **Sentry**: 설정된 경우 Sentry 대시보드에서 에러 추적

## 백업 및 복구

### 데이터베이스 백업

```bash
# PostgreSQL 백업
pg_dump -h localhost -U lexikor -d lexikor_db > backup_$(date +%Y%m%d).sql

# 복구
psql -h localhost -U lexikor -d lexikor_db < backup_20240101.sql
```

### S3 문서 백업

```bash
# S3 버킷 동기화
aws s3 sync s3://lexikor-documents s3://lexikor-documents-backup
```

## 성능 최적화

### 데이터베이스

- 인덱스 최적화
- 쿼리 캐싱 (Redis)
- Connection pooling 설정

### 백엔드

- Gunicorn workers 수 조정
- Celery workers 설정
- Redis 캐싱 활용

### 프론트엔드

- 코드 분할 (Code Splitting)
- 이미지 최적화
- CDN 활용 (CloudFront)

## 보안 체크리스트

- [ ] HTTPS 활성화 (Let's Encrypt)
- [ ] 환경 변수 안전하게 관리 (AWS Secrets Manager)
- [ ] CORS 설정 확인
- [ ] Rate Limiting 설정
- [ ] SQL Injection 방지
- [ ] XSS 방지
- [ ] CSRF 토큰 사용
- [ ] 정기적인 보안 업데이트

## 트러블슈팅

### 일반적인 문제

1. **데이터베이스 연결 실패**
   - PostgreSQL이 실행 중인지 확인
   - DATABASE_URL 환경 변수 확인

2. **OpenAI API 에러**
   - API 키 유효성 확인
   - Rate limit 확인

3. **Docker 메모리 부족**
   - Docker 메모리 할당량 증가
   - 불필요한 컨테이너 정리

## 지원

문제가 발생하면 GitHub Issues에 등록해주세요:
https://github.com/josens83/lexikor-/issues
