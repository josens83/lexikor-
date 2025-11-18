/**
 * API Request/Response Types
 * Type definitions for all API endpoints
 */

import type {
  User,
  AuthTokens,
  Subscription,
  Document,
  Conversation,
  Message,
  LegalCase,
  Statute,
  DocumentTemplate,
  UsageStats,
  DashboardStats,
  PaymentMethod,
  Invoice,
  HealthStatus,
} from './models'

// ============================================================================
// Common Types
// ============================================================================

export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface ApiError {
  detail: string
  status_code: number
  errors?: Record<string, string[]>
}

// ============================================================================
// Auth API
// ============================================================================

export namespace AuthAPI {
  export interface RegisterRequest {
    email: string
    password: string
    full_name: string
    phone?: string
  }

  export interface RegisterResponse {
    user: User
    tokens: AuthTokens
  }

  export interface LoginRequest {
    username: string // email
    password: string
  }

  export interface LoginResponse extends AuthTokens {}

  export interface RefreshTokenRequest {
    refresh_token: string
  }

  export interface RefreshTokenResponse {
    access_token: string
    token_type: string
  }

  export interface ForgotPasswordRequest {
    email: string
  }

  export interface ForgotPasswordResponse {
    message: string
  }

  export interface ResetPasswordRequest {
    token: string
    new_password: string
  }

  export interface ResetPasswordResponse {
    message: string
  }

  export interface VerifyEmailRequest {
    token: string
  }

  export interface VerifyEmailResponse {
    message: string
  }

  export interface UpdateProfileRequest {
    full_name?: string
    phone?: string
  }

  export interface UpdateProfileResponse {
    user: User
  }

  export interface ChangePasswordRequest {
    current_password: string
    new_password: string
  }

  export interface ChangePasswordResponse {
    message: string
  }

  export interface EnableMFAResponse {
    secret: string
    qr_code: string
  }

  export interface VerifyMFARequest {
    code: string
  }

  export interface VerifyMFAResponse {
    backup_codes: string[]
  }
}

// ============================================================================
// Billing API
// ============================================================================

export namespace BillingAPI {
  export interface GetSubscriptionResponse {
    subscription: Subscription
  }

  export interface UpgradeSubscriptionRequest {
    plan: 'PROFESSIONAL' | 'ENTERPRISE'
    payment_method_id?: string
  }

  export interface UpgradeSubscriptionResponse {
    subscription: Subscription
    checkout_url?: string
  }

  export interface CancelSubscriptionResponse {
    subscription: Subscription
    message: string
  }

  export interface CreateCheckoutSessionRequest {
    plan: string
    success_url: string
    cancel_url: string
  }

  export interface CreateCheckoutSessionResponse {
    session_id: string
    checkout_url: string
  }

  export interface GetPaymentMethodsResponse {
    payment_methods: PaymentMethod[]
  }

  export interface AddPaymentMethodRequest {
    payment_method_id: string
    set_as_default?: boolean
  }

  export interface GetInvoicesResponse {
    invoices: Invoice[]
  }

  export interface GetUsageResponse {
    usage: UsageStats
    subscription: Subscription
  }
}

// ============================================================================
// Chat API
// ============================================================================

export namespace ChatAPI {
  export interface CreateConversationRequest {
    title?: string
    legal_area?: string
  }

  export interface CreateConversationResponse {
    conversation: Conversation
  }

  export interface GetConversationsResponse {
    conversations: Conversation[]
  }

  export interface GetConversationResponse {
    conversation: Conversation
    messages: Message[]
  }

  export interface SendMessageRequest {
    content: string
  }

  export interface SendMessageResponse {
    message: Message
    assistant_message: Message
  }

  export interface UpdateMessageFeedbackRequest {
    rating: number
    feedback?: string
  }

  export interface UpdateMessageFeedbackResponse {
    message: Message
  }

  export interface DeleteConversationResponse {
    message: string
  }
}

// ============================================================================
// Documents API
// ============================================================================

export namespace DocumentsAPI {
  export interface UploadDocumentRequest {
    file: File
    title: string
    description?: string
    document_type: string
  }

  export interface UploadDocumentResponse {
    document: Document
  }

  export interface GetDocumentsResponse {
    documents: Document[]
  }

  export interface GetDocumentResponse {
    document: Document
  }

  export interface AnalyzeDocumentRequest {
    document_id: number
  }

  export interface AnalyzeDocumentResponse {
    document: Document
    analysis: {
      summary: string
      risk_score: number
      key_clauses: Array<{
        clause: string
        risk_level: string
        description: string
      }>
      recommendations: string[]
    }
  }

  export interface ShareDocumentRequest {
    user_ids: number[]
  }

  export interface ShareDocumentResponse {
    document: Document
    message: string
  }

  export interface DeleteDocumentResponse {
    message: string
  }
}

// ============================================================================
// Research API
// ============================================================================

export namespace ResearchAPI {
  export interface SearchCasesRequest {
    query: string
    court_name?: string
    date_from?: string
    date_to?: string
    page?: number
    page_size?: number
  }

  export interface SearchCasesResponse extends PaginatedResponse<LegalCase> {}

  export interface SearchStatutesRequest {
    query: string
    category?: string
    effective_date_from?: string
    page?: number
    page_size?: number
  }

  export interface SearchStatutesResponse extends PaginatedResponse<Statute> {}

  export interface GetCaseResponse {
    case: LegalCase
    related_cases?: LegalCase[]
  }

  export interface GetStatuteResponse {
    statute: Statute
    related_statutes?: Statute[]
  }
}

// ============================================================================
// Templates API
// ============================================================================

export namespace TemplatesAPI {
  export interface GetTemplatesResponse {
    templates: DocumentTemplate[]
  }

  export interface GetTemplateResponse {
    template: DocumentTemplate
  }

  export interface GenerateDocumentRequest {
    template_id: number
    variables: Record<string, any>
  }

  export interface GenerateDocumentResponse {
    document: Document
    content: string
  }
}

// ============================================================================
// Analytics API
// ============================================================================

export namespace AnalyticsAPI {
  export interface GetDashboardResponse {
    stats: DashboardStats
  }

  export interface GetUsageAnalyticsResponse {
    daily_usage: Array<{
      date: string
      queries: number
      documents: number
    }>
    monthly_usage: {
      queries: number
      documents: number
      storage: number
    }
    top_features: Array<{
      feature: string
      usage_count: number
    }>
  }

  export interface ExportDataRequest {
    data_type: 'conversations' | 'documents' | 'all'
    format: 'json' | 'csv'
  }

  export interface ExportDataResponse {
    download_url: string
    expires_at: string
  }
}

// ============================================================================
// Health API
// ============================================================================

export namespace HealthAPI {
  export interface GetHealthResponse {
    health: HealthStatus
  }

  export interface GetServiceStatusResponse {
    services: Array<{
      name: string
      status: 'operational' | 'degraded' | 'down'
      uptime_percentage: number
      response_time_ms: number
    }>
    incidents: Array<{
      id: string
      title: string
      status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
      created_at: string
      updated_at: string
    }>
  }
}

// ============================================================================
// Admin API
// ============================================================================

export namespace AdminAPI {
  export interface GetUsersResponse extends PaginatedResponse<User> {}

  export interface UpdateUserRequest {
    role?: string
    is_active?: boolean
    is_verified?: boolean
  }

  export interface UpdateUserResponse {
    user: User
  }

  export interface GetSystemStatsResponse {
    total_users: number
    active_users: number
    total_revenue: number
    subscription_breakdown: Record<string, number>
    system_health: HealthStatus
  }
}
