import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import LandingPage from './pages/Landing'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import DashboardPage from './pages/Dashboard'
import ChatPage from './pages/Chat'
import DocumentsPage from './pages/Documents'
import ResearchPage from './pages/Research'
import TemplatesPage from './pages/Templates'
import BillingPage from './pages/Billing'
import SettingsPage from './pages/Settings'
import PrivateRoute from './components/PrivateRoute'
import './App.css'

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        <Route path="/chat/:conversationId" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        <Route path="/documents" element={<PrivateRoute><DocumentsPage /></PrivateRoute>} />
        <Route path="/research" element={<PrivateRoute><ResearchPage /></PrivateRoute>} />
        <Route path="/templates" element={<PrivateRoute><TemplatesPage /></PrivateRoute>} />
        <Route path="/billing" element={<PrivateRoute><BillingPage /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
