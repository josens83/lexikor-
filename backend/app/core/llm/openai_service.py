"""
OpenAI LLM Service
"""

from typing import List, Dict, Optional, AsyncGenerator
import openai
from openai import AsyncOpenAI
import tiktoken

from app.core.config import settings


class OpenAIService:
    """OpenAI GPT service for legal AI"""

    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        self.model = settings.OPENAI_MODEL
        self.max_tokens = settings.OPENAI_MAX_TOKENS
        self.temperature = settings.OPENAI_TEMPERATURE

    def _build_legal_system_prompt(self, legal_area: Optional[str] = None) -> str:
        """Build system prompt for legal assistant"""
        base_prompt = """당신은 한국 법률 전문 AI 어시스턴트 'LexiKor'입니다.

주요 역할:
1. 사용자의 법률 질문에 정확하고 전문적으로 답변
2. 관련 법령과 판례를 인용하여 답변의 신뢰성 확보
3. 복잡한 법률 용어를 쉽게 설명
4. 필요시 추가 정보를 요청하여 정확한 답변 제공

중요 원칙:
- 항상 출처(법령, 판례)를 명시하세요
- 확실하지 않은 경우 그렇다고 명시하세요
- 법률 자문이 아닌 정보 제공임을 명확히 하세요
- 변호사 상담이 필요한 경우 권장하세요
"""

        if legal_area:
            base_prompt += f"\n현재 상담 분야: {legal_area}"

        return base_prompt

    def _build_context_from_docs(self, relevant_docs: List[Dict]) -> str:
        """Build context from retrieved documents"""
        if not relevant_docs:
            return ""

        context = "\n\n관련 법률 정보:\n"
        for i, doc in enumerate(relevant_docs, 1):
            context += f"\n{i}. {doc.get('title', '문서')}\n"
            context += f"   {doc.get('content', '')[:500]}...\n"

        return context

    async def generate_response(
        self,
        user_message: str,
        conversation_history: List[Dict[str, str]],
        relevant_docs: Optional[List[Dict]] = None,
        legal_area: Optional[str] = None,
        stream: bool = False
    ) -> Dict:
        """
        Generate AI response

        Args:
            user_message: User's query
            conversation_history: Previous messages
            relevant_docs: Retrieved relevant documents
            legal_area: Legal area (민사, 형사, etc.)
            stream: Whether to stream response

        Returns:
            Dict with response content, citations, sources, etc.
        """
        if not self.client:
            # Mock response for development without API key
            return self._mock_response(user_message, relevant_docs)

        # Build messages
        messages = [
            {"role": "system", "content": self._build_legal_system_prompt(legal_area)}
        ]

        # Add context from RAG
        if relevant_docs:
            context = self._build_context_from_docs(relevant_docs)
            messages.append({
                "role": "system",
                "content": f"다음 정보를 참고하여 답변하세요:\n{context}"
            })

        # Add conversation history
        messages.extend(conversation_history[-5:])  # Last 5 messages for context

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        try:
            # Call OpenAI API
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )

            content = response.choices[0].message.content
            tokens_used = response.usage.total_tokens

            # Extract citations from response
            citations = self._extract_citations(content)

            return {
                "content": content,
                "citations": citations,
                "sources": [doc.get("source") for doc in relevant_docs] if relevant_docs else [],
                "tokens_used": tokens_used,
                "model": self.model
            }

        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")

    def _extract_citations(self, content: str) -> List[Dict]:
        """Extract legal citations from response"""
        citations = []

        # Simple pattern matching for Korean legal citations
        # TODO: Implement more sophisticated citation extraction

        return citations

    def _mock_response(self, user_message: str, relevant_docs: Optional[List[Dict]]) -> Dict:
        """Generate mock response for development"""
        mock_content = f"""안녕하세요. '{user_message}'에 대한 법률 정보를 제공해드리겠습니다.

[개발 모드: OpenAI API 키가 설정되지 않아 모의 응답을 표시합니다]

관련 법령:
- 민법 제XXX조: [해당 조항 내용]
- 민사소송법 제XXX조: [해당 조항 내용]

참고 판례:
- 대법원 XXXX. XX. XX. 선고 XXXX다XXXXX 판결

답변:
귀하의 질문에 대해서는 관련 법령을 검토한 결과, [법률적 분석 내용]...

주의사항:
본 답변은 일반적인 법률 정보 제공을 목적으로 하며, 구체적인 사안에 대해서는 변호사와 상담하시기 바랍니다.

추가 질문이 있으시면 언제든지 문의해주세요."""

        citations = [
            {"type": "statute", "reference": "민법 제XXX조", "content": "관련 조문 내용"},
            {"type": "case", "reference": "대법원 XXXX다XXXXX", "content": "판례 요지"}
        ]

        return {
            "content": mock_content,
            "citations": citations,
            "sources": [doc.get("source") for doc in relevant_docs] if relevant_docs else [],
            "tokens_used": 0,
            "model": "mock-gpt-4"
        }

    def count_tokens(self, text: str) -> int:
        """Count tokens in text"""
        try:
            encoding = tiktoken.encoding_for_model(self.model)
            return len(encoding.encode(text))
        except:
            # Fallback: rough estimate
            return len(text) // 4
