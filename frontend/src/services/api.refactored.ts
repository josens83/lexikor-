/**
 * Refactored API Service with Full Type Safety
 * Production-grade API client with interceptors, retry logic, and type safety
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { API_CONFIG, API_ENDPOINTS, ROUTES } from '@/constants'
import { storage } from '@/utils/storage'
import { handleApiError, retryWithBackoff, isNetworkError } from '@/utils/errorHandler'
import type {
  AuthAPI,
  ChatAPI,
  DocumentsAPI,
  ResearchAPI,
  TemplatesAPI,
  BillingAPI,
  AnalyticsAPI,
  AdminAPI,
  HealthAPI,
} from '@/types/api'

// ============================================================================
// Axios Instance Configuration
// ============================================================================

/**
 * Create axios instance with default configuration
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ============================================================================
// Request Interceptor
// ============================================================================

api.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = storage.token.get()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request timestamp for monitoring
    config.metadata = { startTime: new Date() }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ============================================================================
// Response Interceptor
// ============================================================================

api.interceptors.response.use(
  (response) => {
    // Log request duration in development
    if (import.meta.env.DEV && response.config.metadata?.startTime) {
      const duration = new Date().getTime() - response.config.metadata.startTime.getTime()
      console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`)
    }

    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Try to refresh token
      const refreshToken = storage.refreshToken.get()
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
            { refresh_token: refreshToken }
          )

          const { access_token } = response.data
          storage.token.set(access_token)

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return api(originalRequest)
        } catch (refreshError) {
          // Refresh failed, logout user
          storage.clearAll()
          window.location.href = ROUTES.LOGIN
          return Promise.reject(refreshError)
        }
      } else {
        // No refresh token, logout
        storage.clearAll()
        window.location.href = ROUTES.LOGIN
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      message.error('접근 권한이 없습니다')
    }

    // Handle 404 Not Found (silently for API calls)
    if (error.response?.status === 404) {
      console.warn('Resource not found:', error.config.url)
    }

    // Handle 429 Too Many Requests
    if (error.response?.status === 429) {
      message.warning('요청이 너무 많습니다. 잠시 후 다시 시도해주세요')
    }

    // Handle 500+ Server Errors
    if (error.response?.status >= 500) {
      message.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요')
    }

    // Handle Network Errors
    if (isNetworkError(error)) {
      message.error('네트워크 연결을 확인해주세요')
    }

    return Promise.reject(error)
  }
)

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Make GET request with retry
 */
async function getWithRetry<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<{ data: T }> {
  return retryWithBackoff(
    () => api.get<T>(url, config),
    {
      maxRetries: API_CONFIG.RETRY_ATTEMPTS,
      initialDelay: API_CONFIG.RETRY_DELAY,
    }
  )
}

/**
 * Convert object to URLSearchParams for form data
 */
function toFormData(obj: Record<string, any>): URLSearchParams {
  const params = new URLSearchParams()
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined && obj[key] !== null) {
      params.append(key, obj[key])
    }
  })
  return params
}

// ============================================================================
// Auth API
// ============================================================================

export const authAPI = {
  register: (data: AuthAPI.RegisterRequest) =>
    api.post<AuthAPI.RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, data),

  login: (data: AuthAPI.LoginRequest) =>
    api.post<AuthAPI.LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, toFormData(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),

  getMe: () =>
    api.get<{ user: AuthAPI.UpdateProfileResponse['user'] }>(API_ENDPOINTS.AUTH.ME),

  logout: () =>
    api.post<void>(API_ENDPOINTS.AUTH.LOGOUT),

  updateProfile: (data: AuthAPI.UpdateProfileRequest) =>
    api.put<AuthAPI.UpdateProfileResponse>(API_ENDPOINTS.AUTH.ME, data),

  changePassword: (data: AuthAPI.ChangePasswordRequest) =>
    api.post<AuthAPI.ChangePasswordResponse>('/api/v1/auth/change-password', data),

  forgotPassword: (data: AuthAPI.ForgotPasswordRequest) =>
    api.post<AuthAPI.ForgotPasswordResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data),

  resetPassword: (data: AuthAPI.ResetPasswordRequest) =>
    api.post<AuthAPI.ResetPasswordResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),

  verifyEmail: (data: AuthAPI.VerifyEmailRequest) =>
    api.post<AuthAPI.VerifyEmailResponse>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data),

  resendVerification: () =>
    api.post<{ message: string }>('/api/v1/auth/resend-verification'),

  enableMFA: () =>
    api.post<AuthAPI.EnableMFAResponse>(API_ENDPOINTS.AUTH.MFA_ENABLE),

  verifyMFA: (data: AuthAPI.VerifyMFARequest) =>
    api.post<AuthAPI.VerifyMFAResponse>(API_ENDPOINTS.AUTH.MFA_VERIFY, data),

  disableMFA: () =>
    api.post<{ message: string }>(API_ENDPOINTS.AUTH.MFA_DISABLE),

  deleteAccount: () =>
    api.delete<{ message: string }>(API_ENDPOINTS.AUTH.ME),
}

// ============================================================================
// Chat API
// ============================================================================

export const chatAPI = {
  createConversation: (data: ChatAPI.CreateConversationRequest) =>
    api.post<ChatAPI.CreateConversationResponse>(API_ENDPOINTS.CHAT.CONVERSATIONS, data),

  getConversations: () =>
    getWithRetry<ChatAPI.GetConversationsResponse>(API_ENDPOINTS.CHAT.CONVERSATIONS),

  getConversation: (conversationId: number) =>
    getWithRetry<ChatAPI.GetConversationResponse>(`${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}`),

  sendMessage: (conversationId: number, data: ChatAPI.SendMessageRequest) =>
    api.post<ChatAPI.SendMessageResponse>(API_ENDPOINTS.CHAT.MESSAGES(conversationId), data),

  updateMessageFeedback: (messageId: number, data: ChatAPI.UpdateMessageFeedbackRequest) =>
    api.put<ChatAPI.UpdateMessageFeedbackResponse>(`/api/v1/chat/messages/${messageId}/feedback`, data),

  deleteConversation: (conversationId: number) =>
    api.delete<ChatAPI.DeleteConversationResponse>(`${API_ENDPOINTS.CHAT.CONVERSATIONS}/${conversationId}`),
}

// ============================================================================
// Documents API
// ============================================================================

export const documentsAPI = {
  upload: (formData: FormData) =>
    api.post<DocumentsAPI.UploadDocumentResponse>(API_ENDPOINTS.DOCUMENTS.UPLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getDocuments: () =>
    getWithRetry<DocumentsAPI.GetDocumentsResponse>(API_ENDPOINTS.DOCUMENTS.LIST),

  getDocument: (id: number) =>
    getWithRetry<DocumentsAPI.GetDocumentResponse>(API_ENDPOINTS.DOCUMENTS.DETAIL(id)),

  analyzeDocument: (id: number) =>
    api.post<DocumentsAPI.AnalyzeDocumentResponse>(API_ENDPOINTS.DOCUMENTS.ANALYZE(id)),

  shareDocument: (id: number, data: DocumentsAPI.ShareDocumentRequest) =>
    api.post<DocumentsAPI.ShareDocumentResponse>(`/api/v1/documents/${id}/share`, data),

  deleteDocument: (id: number) =>
    api.delete<DocumentsAPI.DeleteDocumentResponse>(API_ENDPOINTS.DOCUMENTS.DETAIL(id)),

  downloadDocument: (id: number) =>
    api.get(API_ENDPOINTS.DOCUMENTS.DOWNLOAD(id), {
      responseType: 'blob',
    }),
}

// ============================================================================
// Research API
// ============================================================================

export const researchAPI = {
  searchCases: (data: ResearchAPI.SearchCasesRequest) =>
    api.post<ResearchAPI.SearchCasesResponse>(API_ENDPOINTS.RESEARCH.SEARCH_CASES, data),

  getCaseDetail: (id: number) =>
    getWithRetry<ResearchAPI.GetCaseResponse>(API_ENDPOINTS.RESEARCH.CASE_DETAIL(id)),

  searchStatutes: (data: ResearchAPI.SearchStatutesRequest) =>
    api.post<ResearchAPI.SearchStatutesResponse>(API_ENDPOINTS.RESEARCH.SEARCH_STATUTES, data),

  getStatuteDetail: (id: number) =>
    getWithRetry<ResearchAPI.GetStatuteResponse>(API_ENDPOINTS.RESEARCH.STATUTE_DETAIL(id)),
}

// ============================================================================
// Templates API
// ============================================================================

export const templatesAPI = {
  getTemplates: () =>
    getWithRetry<TemplatesAPI.GetTemplatesResponse>(API_ENDPOINTS.TEMPLATES.LIST),

  getTemplate: (id: number) =>
    getWithRetry<TemplatesAPI.GetTemplateResponse>(API_ENDPOINTS.TEMPLATES.DETAIL(id)),

  generateDocument: (data: TemplatesAPI.GenerateDocumentRequest) =>
    api.post<TemplatesAPI.GenerateDocumentResponse>(API_ENDPOINTS.TEMPLATES.GENERATE, data),
}

// ============================================================================
// Billing API
// ============================================================================

export const billingAPI = {
  getSubscription: () =>
    getWithRetry<BillingAPI.GetSubscriptionResponse>(API_ENDPOINTS.BILLING.SUBSCRIPTION),

  upgradeSubscription: (data: BillingAPI.UpgradeSubscriptionRequest) =>
    api.post<BillingAPI.UpgradeSubscriptionResponse>(API_ENDPOINTS.BILLING.UPGRADE, data),

  cancelSubscription: () =>
    api.post<BillingAPI.CancelSubscriptionResponse>(API_ENDPOINTS.BILLING.CANCEL),

  getPaymentMethods: () =>
    getWithRetry<BillingAPI.GetPaymentMethodsResponse>(API_ENDPOINTS.BILLING.PAYMENT_METHODS),

  addPaymentMethod: (data: BillingAPI.AddPaymentMethodRequest) =>
    api.post<{ message: string }>(API_ENDPOINTS.BILLING.PAYMENT_METHODS, data),

  getInvoices: () =>
    getWithRetry<BillingAPI.GetInvoicesResponse>(API_ENDPOINTS.BILLING.INVOICES),

  getUsage: () =>
    getWithRetry<BillingAPI.GetUsageResponse>(API_ENDPOINTS.BILLING.USAGE),
}

// ============================================================================
// Analytics API
// ============================================================================

export const analyticsAPI = {
  getDashboard: () =>
    getWithRetry<AnalyticsAPI.GetDashboardResponse>(API_ENDPOINTS.ANALYTICS.DASHBOARD),

  getUsageAnalytics: () =>
    getWithRetry<AnalyticsAPI.GetUsageAnalyticsResponse>(API_ENDPOINTS.ANALYTICS.USAGE),

  exportData: (data: AnalyticsAPI.ExportDataRequest) =>
    api.post<AnalyticsAPI.ExportDataResponse>(API_ENDPOINTS.ANALYTICS.EXPORT, data),
}

// ============================================================================
// Admin API (for admin users only)
// ============================================================================

export const adminAPI = {
  getUsers: (page: number = 1, pageSize: number = 20) =>
    api.get<AdminAPI.GetUsersResponse>(API_ENDPOINTS.ADMIN.USERS, {
      params: { page, page_size: pageSize },
    }),

  getUser: (id: number) =>
    api.get<{ user: any }>(API_ENDPOINTS.ADMIN.USER_DETAIL(id)),

  updateUser: (id: number, data: AdminAPI.UpdateUserRequest) =>
    api.put<AdminAPI.UpdateUserResponse>(API_ENDPOINTS.ADMIN.USER_DETAIL(id), data),

  deleteUser: (id: number) =>
    api.delete<{ message: string }>(API_ENDPOINTS.ADMIN.USER_DETAIL(id)),

  getSystemStats: () =>
    getWithRetry<AdminAPI.GetSystemStatsResponse>(API_ENDPOINTS.ADMIN.STATS),
}

// ============================================================================
// Health API
// ============================================================================

export const healthAPI = {
  check: () =>
    getWithRetry<HealthAPI.GetHealthResponse>(API_ENDPOINTS.HEALTH.CHECK),

  getServiceStatus: () =>
    getWithRetry<HealthAPI.GetServiceStatusResponse>(API_ENDPOINTS.HEALTH.STATUS),
}

// Export default axios instance
export default api
