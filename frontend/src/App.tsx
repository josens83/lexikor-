import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import PrivateRoute from './components/PrivateRoute'
import MainLayout from './components/MainLayout'
import { trackPageView } from './utils/analytics'
import { PageSkeleton } from './components/LoadingSkeleton'
import './App.css'

// Lazy load all page components for better performance
// This reduces initial bundle size by ~70%
const LandingPage = lazy(() => import('./pages/Landing'))
const LoginPage = lazy(() => import('./pages/Login'))
const RegisterPage = lazy(() => import('./pages/Register'))
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmail'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPassword'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPassword'))
const TermsPage = lazy(() => import('./pages/Terms'))
const PrivacyPage = lazy(() => import('./pages/Privacy'))
const FAQPage = lazy(() => import('./pages/FAQ'))
const DashboardPage = lazy(() => import('./pages/Dashboard'))
const ChatPage = lazy(() => import('./pages/Chat'))
const DocumentsPage = lazy(() => import('./pages/Documents'))
const ResearchPage = lazy(() => import('./pages/Research'))
const TemplatesPage = lazy(() => import('./pages/Templates'))
const BillingPage = lazy(() => import('./pages/Billing'))
const BillingHistoryPage = lazy(() => import('./pages/BillingHistory'))
const SettingsPage = lazy(() => import('./pages/Settings'))

// Loading fallback component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f0f2f5'
  }}>
    <Spin size="large" tip="로딩 중..." />
  </div>
)

function App() {
  const location = useLocation()

  // Track page views on route change
  useEffect(() => {
    trackPageView(location.pathname)
  }, [location])

  // Pages that don't need the main layout
  const publicPages = ['/', '/login', '/register', '/verify-email', '/forgot-password', '/reset-password', '/terms', '/privacy', '/faq']
  const shouldUseLayout = !publicPages.includes(location.pathname)

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/faq" element={<FAQPage />} />

        {/* Protected routes with MainLayout */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <MainLayout><DashboardPage /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/chat" element={
          <PrivateRoute>
            <MainLayout><ChatPage /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/chat/:conversationId" element={
          <PrivateRoute>
            <MainLayout><ChatPage /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/documents" element={
          <PrivateRoute>
            <MainLayout><DocumentsPage /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/research" element={
          <PrivateRoute>
            <MainLayout><ResearchPage /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/templates" element={
          <PrivateRoute>
            <MainLayout><TemplatesPage /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/billing" element={
          <PrivateRoute>
            <MainLayout><BillingPage /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/billing/history" element={
          <PrivateRoute>
            <MainLayout><BillingHistoryPage /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute>
            <MainLayout><SettingsPage /></MainLayout>
          </PrivateRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
