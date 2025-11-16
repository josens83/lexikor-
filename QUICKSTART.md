# LexiKor 빠른 시작 가이드

## 🚀 5분 안에 시작하기

### 방법 1: Docker로 즉시 실행 (권장)

```bash
# 1. 레포지토리 클론
git clone https://github.com/josens83/lexikor-.git
cd lexikor-

# 2. Docker Compose로 모든 서비스 실행
docker-compose up -d

# 3. 데이터베이스 초기화 (첫 실행시만)
docker-compose exec backend python /app/scripts/seed_db.py
```

**접속 주소:**
- 🌐 프론트엔드: http://localhost:3000
- 🔧 백엔드 API: http://localhost:8000
- 📚 API 문서: http://localhost:8000/docs

**기본 계정:**
- 관리자: `admin@lexikor.ai` / `admin123!@#`
- 테스트: `test@example.com` / `test1234`

---

### 방법 2: 로컬 개발 환경

#### 백엔드 설정

```bash
cd backend

# Python 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# PostgreSQL 설치 및 실행 (Docker 사용)
docker run -d \
  --name lexikor-postgres \
  -e POSTGRES_USER=lexikor \
  -e POSTGRES_PASSWORD=lexikor_password \
  -e POSTGRES_DB=lexikor_db \
  -p 5432:5432 \
  postgres:15-alpine

# Redis 설치 및 실행
docker run -d --name lexikor-redis -p 6379:6379 redis:7-alpine

# 데이터베이스 마이그레이션
alembic upgrade head

# 초기 데이터 시드
python scripts/seed_db.py

# 개발 서버 실행
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

---

## 📖 주요 기능 사용법

### 1. 회원가입 및 로그인

1. http://localhost:3000 접속
2. "무료 시작하기" 클릭
3. 이메일/비밀번호로 가입
4. 로그인 후 대시보드 접속

### 2. AI 채팅 사용하기

```
1. 대시보드에서 "AI 채팅 시작" 클릭
2. 법률 분야 선택 (선택사항)
   - 민사, 형사, 상사, 행정, 노동, 가족, 부동산
3. 질문 입력 예시:
   "계약 불이행으로 인한 손해배상 청구 요건은 무엇인가요?"
4. AI가 관련 판례와 법령을 인용하여 답변
```

### 3. 문서 업로드 및 분석

```
1. "문서 관리" 메뉴 선택
2. 파일 드래그 또는 클릭하여 업로드
   - 지원 형식: PDF, DOCX, DOC, TXT, HWP
   - 최대 크기: 50MB
3. 업로드된 문서 목록 확인
4. "분석" 버튼 클릭하여 결과 확인:
   - 문서 요약
   - 위험도 점수
   - 주요 조항
   - 개선 제안
```

### 4. 법률 검색

```
1. "법률 검색" 메뉴 선택
2. 판례 또는 법령 검색
3. 키워드 입력 (예: "손해배상", "임대차")
4. 필터 적용:
   - 사건 유형
   - 법원
   - 연도
5. 결과 상세 보기
```

### 5. 문서 템플릿 생성

```
1. "문서 템플릿" 메뉴 선택
2. 템플릿 유형 선택:
   - 민사소장
   - 형사고소장
   - 임대차계약서
   - 채권추심 내용증명
   - 법률의견서
3. 필수 정보 입력
4. "생성" 버튼 클릭
5. 다운로드 또는 편집
```

---

## 🧪 샘플 데이터

시드 스크립트 실행시 다음 데이터가 자동으로 생성됩니다:

### 사용자
- 관리자 계정 (Enterprise 플랜)
- 테스트 계정 (Professional 플랜)

### 판례 (3건)
1. 2020다12345 - 손해배상(기) 청구 사건 (대법원)
2. 2021나56789 - 임대차보증금 반환 청구 (서울고등법원)
3. 2022고단1234 - 사기 사건 (서울중앙지방법원)

### 법령 (3건)
1. 민법 (계약, 불법행위, 손해배상)
2. 주택임대차보호법
3. 형법 (사기, 공갈, 상해)

---

## 🔧 환경 설정

### 필수 환경 변수

API 키 없이도 개발 모드에서 실행 가능하지만, 전체 기능을 사용하려면:

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 편집
OPENAI_API_KEY=sk-...                    # AI 채팅 기능
STRIPE_SECRET_KEY=sk_test_...            # 결제 기능
AWS_ACCESS_KEY_ID=...                     # S3 파일 저장
AWS_SECRET_ACCESS_KEY=...
```

### 개발 모드 특징

- OpenAI API 키가 없으면 **모의 응답** 제공
- Stripe 키가 없으면 구독은 자동 활성화
- S3 설정이 없으면 로컬 파일시스템 사용

---

## 🐛 문제 해결

### 데이터베이스 연결 실패
```bash
# PostgreSQL 컨테이너 확인
docker ps | grep postgres

# 재시작
docker restart lexikor-postgres

# 로그 확인
docker logs lexikor-postgres
```

### 포트 충돌
```bash
# 포트 사용 확인
lsof -i :8000  # 백엔드
lsof -i :3000  # 프론트엔드
lsof -i :5432  # PostgreSQL

# 프로세스 종료
kill -9 <PID>
```

### 마이그레이션 오류
```bash
cd backend

# 마이그레이션 초기화
alembic downgrade base
alembic upgrade head

# 시드 데이터 재생성
python scripts/seed_db.py
```

### Docker 메모리 부족
```bash
# Docker 메모리 할당 증가 (Docker Desktop 설정)
# 최소 4GB 권장

# 불필요한 컨테이너 정리
docker system prune -a
```

---

## 📊 개발 도구

### 유용한 명령어

```bash
# 전체 로그 보기
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f backend
docker-compose logs -f frontend

# 서비스 재시작
docker-compose restart backend

# 데이터베이스 접속
docker-compose exec postgres psql -U lexikor -d lexikor_db

# Redis CLI 접속
docker-compose exec redis redis-cli

# 백엔드 테스트
cd backend && pytest

# 프론트엔드 테스트
cd frontend && npm test
```

### Makefile 명령어

```bash
make help     # 도움말
make build    # Docker 이미지 빌드
make up       # 서비스 시작
make down     # 서비스 종료
make logs     # 로그 보기
make clean    # 정리
```

---

## 📈 다음 단계

1. **API 키 설정**: OpenAI, Stripe 등의 실제 API 키 설정
2. **데이터 확장**: 더 많은 판례와 법령 데이터 추가
3. **벡터 DB 설정**: Pinecone 또는 ChromaDB 연동
4. **프로덕션 배포**: AWS, GCP 등에 배포

더 자세한 내용은 [DEPLOYMENT.md](DEPLOYMENT.md)를 참조하세요.

---

## 💡 팁

- 개발 중 핫 리로드 활성화: 코드 변경시 자동 재시작
- API 문서 활용: http://localhost:8000/docs에서 API 테스트
- React DevTools 사용: 컴포넌트 디버깅
- DB 관리: DBeaver, TablePlus 등 GUI 도구 사용

---

## 📞 지원

문제가 발생하면:
1. [GitHub Issues](https://github.com/josens83/lexikor-/issues)에 등록
2. 로그 파일 첨부: `docker-compose logs > logs.txt`
3. 환경 정보 제공: OS, Docker 버전 등

즐거운 개발 되세요! 🚀
