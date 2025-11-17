# LexiKor 프로덕션 배포 가이드

LexiKor를 프로덕션 환경에 배포하기 위한 완전한 가이드입니다.

## 시스템 요구사항

### 최소 사양
- **CPU**: 4 cores
- **RAM**: 8GB  
- **Storage**: 100GB SSD
- **OS**: Ubuntu 22.04 LTS

### 필수 소프트웨어
- Docker 24.0+
- PostgreSQL 15+
- Redis 7.0+
- Nginx 1.24+
- Python 3.11+
- Node.js 18+

## 빠른 시작

### 1. 환경 변수 설정
```bash
cd backend
cp .env.example .env
# .env 파일을 편집하여 필수 값 설정
```

### 2. 데이터베이스 설정
```bash
sudo -u postgres psql
CREATE DATABASE lexikor_db;
CREATE USER lexikor WITH ENCRYPTED PASSWORD 'STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE lexikor_db TO lexikor;
```

### 3. 마이그레이션 실행
```bash
python -m alembic upgrade head
python scripts/seed_db.py
```

### 4. 서비스 시작
```bash
docker-compose up -d
```

## 보안 설정

### SSL 인증서 (Let's Encrypt)
```bash
sudo certbot --nginx -d yourdomain.com
```

### 방화벽
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 모니터링

헬스 체크: `https://yourdomain.com/health`

상세한 배포 가이드는 문서를 참조하세요.
