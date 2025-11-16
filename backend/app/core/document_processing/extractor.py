"""
Information Extractor for legal documents
"""

from typing import Dict, List, Optional
import re


class InformationExtractor:
    """Extract structured information from legal documents"""

    @staticmethod
    def extract_contract_info(text: str) -> Dict:
        """Extract information from contracts"""
        info = {
            "parties": InformationExtractor._extract_parties(text),
            "dates": InformationExtractor._extract_dates(text),
            "amounts": InformationExtractor._extract_amounts(text),
            "clauses": InformationExtractor._extract_clauses(text),
            "risks": InformationExtractor._identify_risks(text)
        }
        return info

    @staticmethod
    def _extract_parties(text: str) -> List[str]:
        """Extract party names from document"""
        parties = []

        # Pattern for Korean contract parties (갑, 을, 병 etc.)
        patterns = [
            r'갑\s*[：:]\s*(.+?)(?:\n|$)',
            r'을\s*[：:]\s*(.+?)(?:\n|$)',
            r'병\s*[：:]\s*(.+?)(?:\n|$)',
            r'원고\s*[：:]\s*(.+?)(?:\n|$)',
            r'피고\s*[：:]\s*(.+?)(?:\n|$)',
        ]

        for pattern in patterns:
            matches = re.findall(pattern, text)
            parties.extend(matches)

        return [p.strip() for p in parties if p.strip()]

    @staticmethod
    def _extract_dates(text: str) -> List[str]:
        """Extract dates from document"""
        dates = []

        # Pattern for Korean date formats
        patterns = [
            r'\d{4}년\s*\d{1,2}월\s*\d{1,2}일',
            r'\d{4}\.\s*\d{1,2}\.\s*\d{1,2}',
            r'\d{4}-\d{1,2}-\d{1,2}'
        ]

        for pattern in patterns:
            matches = re.findall(pattern, text)
            dates.extend(matches)

        return list(set(dates))

    @staticmethod
    def _extract_amounts(text: str) -> List[Dict]:
        """Extract monetary amounts"""
        amounts = []

        # Pattern for Korean currency
        patterns = [
            r'([\d,]+)\s*원',
            r'금\s*([\d,]+)\s*원',
            r'([\d,]+)만\s*원',
            r'([\d,]+)억\s*원'
        ]

        for pattern in patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                amounts.append({
                    "amount": match,
                    "currency": "KRW"
                })

        return amounts

    @staticmethod
    def _extract_clauses(text: str) -> List[Dict]:
        """Extract contract clauses"""
        clauses = []

        # Pattern for numbered clauses (제X조, 제X항 etc.)
        clause_pattern = r'제\s*(\d+)\s*조\s*\(([^)]+)\)(.*?)(?=제\s*\d+\s*조|\Z)'

        matches = re.findall(clause_pattern, text, re.DOTALL)

        for match in matches:
            clause_number, clause_title, clause_content = match
            clauses.append({
                "number": clause_number,
                "title": clause_title.strip(),
                "content": clause_content.strip()[:200]  # First 200 chars
            })

        return clauses

    @staticmethod
    def _identify_risks(text: str) -> List[Dict]:
        """Identify potential risk clauses"""
        risks = []

        # Risk keywords in Korean contracts
        risk_keywords = [
            ("위약금", "penalty", "high"),
            ("손해배상", "damages", "high"),
            ("해지", "termination", "medium"),
            ("연체", "delay", "medium"),
            ("중도금", "interim_payment", "low"),
            ("담보", "collateral", "high"),
            ("보증", "guarantee", "medium"),
            ("면책", "exemption", "high")
        ]

        for keyword, risk_type, severity in risk_keywords:
            if keyword in text:
                # Find context around keyword
                pattern = f'.{{0,100}}{keyword}.{{0,100}}'
                matches = re.findall(pattern, text)

                for match in matches:
                    risks.append({
                        "type": risk_type,
                        "keyword": keyword,
                        "severity": severity,
                        "context": match.strip()
                    })

        return risks

    @staticmethod
    def calculate_risk_score(risks: List[Dict]) -> int:
        """Calculate overall risk score (0-100)"""
        if not risks:
            return 0

        severity_scores = {
            "low": 20,
            "medium": 50,
            "high": 80
        }

        total_score = sum(severity_scores.get(risk["severity"], 0) for risk in risks)
        max_score = len(risks) * 100

        # Normalize to 0-100
        risk_score = min(100, int((total_score / max_score) * 100)) if max_score > 0 else 0

        return risk_score


class LegalCaseExtractor:
    """Extract information from legal case documents"""

    @staticmethod
    def extract_case_info(text: str) -> Dict:
        """Extract case information"""
        return {
            "case_number": LegalCaseExtractor._extract_case_number(text),
            "parties": LegalCaseExtractor._extract_parties(text),
            "claims": LegalCaseExtractor._extract_claims(text),
            "facts": LegalCaseExtractor._extract_facts(text),
            "judgment": LegalCaseExtractor._extract_judgment(text)
        }

    @staticmethod
    def _extract_case_number(text: str) -> Optional[str]:
        """Extract case number"""
        # Pattern: 2020다12345 형식
        pattern = r'\d{4}[다가나고소]?\d+'
        match = re.search(pattern, text)
        return match.group(0) if match else None

    @staticmethod
    def _extract_parties(text: str) -> Dict:
        """Extract plaintiff and defendant"""
        plaintiff_pattern = r'원고\s*[：:]\s*(.+?)(?:\n|피고)'
        defendant_pattern = r'피고\s*[：:]\s*(.+?)(?:\n|$)'

        plaintiff = re.search(plaintiff_pattern, text)
        defendant = re.search(defendant_pattern, text)

        return {
            "plaintiff": plaintiff.group(1).strip() if plaintiff else None,
            "defendant": defendant.group(1).strip() if defendant else None
        }

    @staticmethod
    def _extract_claims(text: str) -> Optional[str]:
        """Extract claims section"""
        pattern = r'청구취지(.*?)(?:청구원인|주문|\Z)'
        match = re.search(pattern, text, re.DOTALL)
        return match.group(1).strip() if match else None

    @staticmethod
    def _extract_facts(text: str) -> Optional[str]:
        """Extract facts section"""
        pattern = r'(?:청구원인|사실관계)(.*?)(?:판단|주문|\Z)'
        match = re.search(pattern, text, re.DOTALL)
        return match.group(1).strip() if match else None

    @staticmethod
    def _extract_judgment(text: str) -> Optional[str]:
        """Extract judgment section"""
        pattern = r'주문(.*?)(?:이유|\Z)'
        match = re.search(pattern, text, re.DOTALL)
        return match.group(1).strip() if match else None
