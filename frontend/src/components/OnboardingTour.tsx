/**
 * Interactive Onboarding Tour
 *
 * Guides new users through LexiKor's key features
 * Similar to Notion, Slack, Figma onboarding experiences
 */

import { useState, useEffect } from 'react'
import { Tour, TourProps } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'

interface OnboardingTourProps {
  open: boolean
  onFinish: () => void
}

const OnboardingTour = ({ open, onFinish }: OnboardingTourProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentStep, setCurrentStep] = useState(0)

  // Define tour steps with references to actual DOM elements
  const steps: TourProps['steps'] = [
    {
      title: 'LexiKor에 오신 것을 환영합니다! 🎉',
      description: (
        <div>
          <p>AI 기반 법률 플랫폼의 주요 기능을 소개해드리겠습니다.</p>
          <p style={{ marginTop: 8, fontSize: 13, color: '#8c8c8c' }}>
            약 2분 정도 소요됩니다. 언제든지 ESC를 눌러 종료할 수 있습니다.
          </p>
        </div>
      ),
      target: null, // Welcome step - no specific target
    },
    {
      title: '📊 대시보드',
      description: '사용 현황, 최근 활동, 퀵 액션을 한눈에 확인할 수 있습니다.',
      target: () => document.querySelector('[data-tour="dashboard"]') as HTMLElement,
    },
    {
      title: '💬 AI 법률 채팅',
      description: 'GPT-4 기반 AI와 실시간으로 법률 상담을 받을 수 있습니다. 판례, 법령, 계약서 관련 질문을 자유롭게 해보세요.',
      target: () => document.querySelector('[data-tour="chat"]') as HTMLElement,
    },
    {
      title: '📄 문서 관리',
      description: '계약서, 소장 등 법률 문서를 업로드하고 AI로 자동 분석받을 수 있습니다. 위험 조항 식별과 개선안을 제공합니다.',
      target: () => document.querySelector('[data-tour="documents"]') as HTMLElement,
    },
    {
      title: '🔍 판례 검색',
      description: '수천 건의 판례를 AI로 빠르게 검색하고, 관련 법령과 유사 판례를 찾을 수 있습니다.',
      target: () => document.querySelector('[data-tour="research"]') as HTMLElement,
    },
    {
      title: '✍️ 템플릿',
      description: '소장, 내용증명, 계약서 등 자주 사용하는 법률 문서를 템플릿으로 빠르게 작성할 수 있습니다.',
      target: () => document.querySelector('[data-tour="templates"]') as HTMLElement,
    },
    {
      title: '⚙️ 설정',
      description: '프로필, 알림, 보안 설정 등을 관리할 수 있습니다.',
      target: () => document.querySelector('[data-tour="settings"]') as HTMLElement,
    },
    {
      title: '시작할 준비가 되었습니다! 🚀',
      description: (
        <div>
          <p>이제 LexiKor의 모든 기능을 사용하실 수 있습니다.</p>
          <p style={{ marginTop: 12, padding: 12, background: '#f0f9ff', borderRadius: 6 }}>
            💡 <strong>팁:</strong> 언제든지 우측 하단의 도움말 버튼을 클릭하면 가이드를 다시 볼 수 있습니다.
          </p>
        </div>
      ),
      target: null,
    },
  ]

  const handleStepChange = (current: number) => {
    setCurrentStep(current)

    // Navigate to appropriate page based on step
    if (current === 1 && location.pathname !== '/dashboard') {
      navigate('/dashboard')
    }
  }

  return (
    <Tour
      open={open}
      onClose={onFinish}
      steps={steps}
      current={currentStep}
      onChange={handleStepChange}
      indicatorsRender={(current, total) => (
        <span style={{ fontSize: 12, color: '#8c8c8c' }}>
          {current + 1} / {total}
        </span>
      )}
    />
  )
}

export default OnboardingTour
