import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import koKR from 'antd/locale/ko_KR'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { initSentry } from './utils/sentry'
import './index.css'

// Initialize error monitoring
initSentry()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ConfigProvider locale={koKR}>
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
