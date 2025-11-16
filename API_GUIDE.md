# LexiKor API 가이드

## 📡 API 개요

Base URL: `http://localhost:8000`

모든 API는 `/api/v1` 프리픽스를 사용합니다.

API 문서: http://localhost:8000/docs (Swagger UI)

---

## 🔐 인증

### 회원가입
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "홍길동",
  "phone": "010-1234-5678"
}
```

**응답:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "홍길동",
  "role": "user",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 로그인
```http
POST /api/v1/auth/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=password123
```

**응답:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

### 인증된 요청
```http
GET /api/v1/auth/me
Authorization: Bearer eyJ...
```

---

## 💬 채팅 API

### 메시지 전송
```http
POST /api/v1/chat/send
Authorization: Bearer eyJ...
Content-Type: application/json

{
  "message": "계약 불이행으로 인한 손해배상 청구는 어떻게 하나요?",
  "conversation_id": null,
  "legal_area": "민사",
  "stream": false
}
```

**응답:**
```json
{
  "conversation_id": 1,
  "message_id": 2,
  "role": "assistant",
  "content": "계약 불이행으로 인한 손해배상 청구는...",
  "citations": [
    {
      "type": "statute",
      "reference": "민법 제390조",
      "content": "채무불이행과 손해배상"
    }
  ],
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 대화 목록 조회
```http
GET /api/v1/chat/conversations?skip=0&limit=20
Authorization: Bearer eyJ...
```

### 메시지 조회
```http
GET /api/v1/chat/conversations/1/messages
Authorization: Bearer eyJ...
```

### 대화 삭제
```http
DELETE /api/v1/chat/conversations/1
Authorization: Bearer eyJ...
```

---

## 📄 문서 API

### 문서 업로드
```http
POST /api/v1/documents/upload
Authorization: Bearer eyJ...
Content-Type: multipart/form-data

file: [binary]
title: "계약서"
document_type: "CONTRACT"
```

**응답:**
```json
{
  "id": 1,
  "title": "계약서.pdf",
  "filename": "contract.pdf",
  "file_size": 1024000,
  "status": "PROCESSING",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 문서 목록 조회
```http
GET /api/v1/documents/?skip=0&limit=20&document_type=CONTRACT
Authorization: Bearer eyJ...
```

### 문서 분석 결과
```http
GET /api/v1/documents/1/analyze
Authorization: Bearer eyJ...
```

**응답:**
```json
{
  "document_id": 1,
  "summary": "본 계약서는...",
  "risk_score": 45,
  "key_clauses": [
    {
      "number": "제3조",
      "title": "계약금",
      "content": "..."
    }
  ],
  "analysis_results": {
    "parties": ["갑: ABC", "을: XYZ"],
    "dates": ["2024-01-01"],
    "amounts": [{"amount": "5000000", "currency": "KRW"}]
  }
}
```

### 문서 삭제
```http
DELETE /api/v1/documents/1
Authorization: Bearer eyJ...
```

---

## 🔍 법률 검색 API

### 판례 검색
```http
POST /api/v1/research/cases/search
Authorization: Bearer eyJ...
Content-Type: application/json

{
  "query": "손해배상",
  "case_type": "민사",
  "legal_area": "계약법",
  "court": "대법원",
  "limit": 10
}
```

**응답:**
```json
[
  {
    "id": 1,
    "case_number": "2020다12345",
    "case_name": "손해배상(기) 청구",
    "court": "대법원",
    "case_type": "민사",
    "summary": "...",
    "decision_date": "2020-06-15T00:00:00Z"
  }
]
```

### 판례 상세 조회
```http
GET /api/v1/research/cases/1
Authorization: Bearer eyJ...
```

### 법령 검색
```http
POST /api/v1/research/statutes/search
Authorization: Bearer eyJ...
Content-Type: application/json

{
  "query": "계약",
  "statute_type": "법률",
  "category": "민법",
  "limit": 10
}
```

### 법령 상세 조회
```http
GET /api/v1/research/statutes/1
Authorization: Bearer eyJ...
```

---

## 📝 템플릿 API

### 템플릿 목록
```http
GET /api/v1/templates/?category=lawsuit
Authorization: Bearer eyJ...
```

**응답:**
```json
[
  {
    "id": "lawsuit.civil_lawsuit",
    "name": "민사소장",
    "description": "일반 민사소송 소장 템플릿",
    "category": "lawsuit",
    "variables": ["plaintiff", "defendant", "claim_amount", "facts"]
  }
]
```

### 문서 생성
```http
POST /api/v1/templates/generate
Authorization: Bearer eyJ...
Content-Type: application/json

{
  "template_type": "lawsuit",
  "template_subtype": "civil_lawsuit",
  "variables": {
    "plaintiff": "홍길동",
    "defendant": "김철수",
    "claim_amount": "50,000,000",
    "facts": "피고는 계약을 위반하였고...",
    "court": "서울중앙지방법원"
  }
}
```

**응답:**
```json
{
  "template_type": "lawsuit",
  "template_subtype": "civil_lawsuit",
  "content": "소 장\n\n원고: 홍길동\n피고: 김철수\n\n청구취지\n피고는 원고에게 50,000,000원...",
  "metadata": {
    "name": "민사소장",
    "generated_at": "2024-01-01T00:00:00.000000"
  }
}
```

---

## 💰 구독 및 결제 API

### 구독 정보 조회
```http
GET /api/v1/billing/subscription
Authorization: Bearer eyJ...
```

**응답:**
```json
{
  "id": 1,
  "plan": "PROFESSIONAL",
  "status": "ACTIVE",
  "query_limit": -1,
  "queries_used": 150,
  "document_limit": 100,
  "documents_count": 25,
  "price": 99000.0,
  "current_period_end": "2024-02-01T00:00:00Z"
}
```

### 플랜 업그레이드
```http
POST /api/v1/billing/upgrade
Authorization: Bearer eyJ...
Content-Type: application/json

{
  "plan": "PROFESSIONAL",
  "payment_method_id": "pm_..."
}
```

### 결제 세션 생성
```http
POST /api/v1/billing/checkout/create?plan=PROFESSIONAL
Authorization: Bearer eyJ...
```

**응답:**
```json
{
  "checkout_url": "https://checkout.stripe.com/...",
  "session_id": "cs_..."
}
```

### 사용량 조회
```http
GET /api/v1/billing/usage
Authorization: Bearer eyJ...
```

**응답:**
```json
{
  "plan": "PROFESSIONAL",
  "queries": {
    "used": 150,
    "limit": -1,
    "percentage": 0
  },
  "documents": {
    "count": 25,
    "limit": 100,
    "percentage": 25
  },
  "period": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-02-01T00:00:00Z"
  }
}
```

### 구독 취소
```http
POST /api/v1/billing/cancel
Authorization: Bearer eyJ...
```

---

## 📊 분석 API

### 대시보드 통계
```http
GET /api/v1/analytics/dashboard
Authorization: Bearer eyJ...
```

**응답:**
```json
{
  "overview": {
    "total_conversations": 45,
    "total_queries": 320,
    "total_documents": 18,
    "queries_this_month": 150,
    "documents_this_month": 8
  },
  "subscription": {
    "plan": "PROFESSIONAL",
    "queries_used": 150,
    "query_limit": -1
  }
}
```

### 활동 차트
```http
GET /api/v1/analytics/activity?days=30
Authorization: Bearer eyJ...
```

**응답:**
```json
{
  "activity": [
    {
      "date": "2024-01-01",
      "queries": 15,
      "documents": 3
    },
    ...
  ]
}
```

### 인기 토픽
```http
GET /api/v1/analytics/popular-topics
Authorization: Bearer eyJ...
```

---

## ⚠️ 에러 응답

### 일반 에러 형식
```json
{
  "detail": "Error message",
  "message": "Additional information"
}
```

### HTTP 상태 코드
- `200` - 성공
- `201` - 생성 성공
- `400` - 잘못된 요청
- `401` - 인증 필요
- `402` - 결제 필요 (구독 한도 초과)
- `403` - 권한 없음
- `404` - 리소스 없음
- `422` - 유효성 검증 실패
- `500` - 서버 오류

### 유효성 검증 에러
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

---

## 🔧 Rate Limiting

- **무료 플랜**: 60 요청/분
- **Professional**: 무제한
- **Enterprise**: 무제한

초과시 `429 Too Many Requests` 응답

---

## 📚 SDK 예시

### Python
```python
import requests

# 로그인
response = requests.post(
    "http://localhost:8000/api/v1/auth/login",
    data={"username": "test@example.com", "password": "test1234"}
)
token = response.json()["access_token"]

# 메시지 전송
headers = {"Authorization": f"Bearer {token}"}
response = requests.post(
    "http://localhost:8000/api/v1/chat/send",
    headers=headers,
    json={
        "message": "손해배상 청구 요건은?",
        "legal_area": "민사"
    }
)
print(response.json()["content"])
```

### JavaScript
```javascript
// 로그인
const loginResponse = await fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'username=test@example.com&password=test1234'
})
const { access_token } = await loginResponse.json()

// 메시지 전송
const chatResponse = await fetch('http://localhost:8000/api/v1/chat/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: '손해배상 청구 요건은?',
    legal_area: '민사'
  })
})
const data = await chatResponse.json()
console.log(data.content)
```

---

더 자세한 API 문서는 http://localhost:8000/docs 에서 확인하세요!
