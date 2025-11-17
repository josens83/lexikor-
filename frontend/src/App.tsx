import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LandingPage from './pages/Landing'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import VerifyEmailPage from './pages/VerifyEmail'
import ForgotPasswordPage from './pages/ForgotPassword'
import ResetPasswordPage from './pages/ResetPassword'
import TermsPage from './pages/Terms'
import PrivacyPage from './pages/Privacy'
import FAQPage from './pages/FAQ'
import DashboardPage from './pages/Dashboard'
import ChatPage from './pages/Chat'
import DocumentsPage from './pages/Documents'
import ResearchPage from './pages/Research'
import TemplatesPage from './pages/Templates'
import BillingPage from './pages/Billing'
import SettingsPage from './pages/Settings'
import PrivateRoute from './components/PrivateRoute'
import MainLayout from './components/MainLayout'
import './App.css'

function App() {
  const location = useLocation()

  // Pages that don't need the main layout
  const publicPages = ['/', '/login', '/register', '/verify-email', '/forgot-password', '/reset-password', '/terms', '/privacy', '/faq']
  const shouldUseLayout = !publicPages.includes(location.pathname)

  return (
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
      <Route path="/settings" element={
        <PrivateRoute>
          <MainLayout><SettingsPage /></MainLayout>
        </PrivateRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
