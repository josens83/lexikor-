/**
 * Core Domain Models
 * Centralized type definitions for all API models
 */

// ============================================================================
// User & Authentication
// ============================================================================

export enum UserRole {
  USER = 'USER',
  LAWYER = 'LAWYER',
  ADMIN = 'ADMIN',
  ENTERPRISE = 'ENTERPRISE',
}

export interface User {
  id: number
  email: string
  full_name: string
  phone?: string
  role: UserRole
  is_active: boolean
  is_verified: boolean
  is_superuser: boolean
  mfa_enabled: boolean
  created_at: string
  updated_at?: string
  last_login?: string
  organization_id?: number
  subscription_id?: number
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
}

// ============================================================================
// Subscription & Billing
// ============================================================================

export enum SubscriptionPlan {
  FREE = 'FREE',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  TRIAL = 'TRIAL',
}

export interface Subscription {
  id: number
  plan: SubscriptionPlan
  status: SubscriptionStatus
  query_limit: number
  queries_used: number
  document_limit: number
  documents_count: number
  price: number
  currency: string
  billing_cycle: string
  trial_ends_at?: string
  current_period_start?: string
  current_period_end?: string
  cancelled_at?: string
  created_at: string
  updated_at?: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_account'
  last4: string
  brand?: string
  exp_month?: number
  exp_year?: number
  is_default: boolean
}

export interface Invoice {
  id: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed'
  created_at: string
  paid_at?: string
  invoice_url?: string
}

// ============================================================================
// Organization
// ============================================================================

export interface Organization {
  id: number
  name: string
  description?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  business_number?: string
  is_active: boolean
  max_users: number
  created_at: string
  updated_at?: string
}

// ============================================================================
// Documents
// ============================================================================

export enum DocumentType {
  CONTRACT = 'CONTRACT',
  LAWSUIT = 'LAWSUIT',
  OPINION = 'OPINION',
  NOTICE = 'NOTICE',
  COURT_DECISION = 'COURT_DECISION',
  STATUTE = 'STATUTE',
  OTHER = 'OTHER',
}

export enum DocumentStatus {
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface Document {
  id: number
  title: string
  description?: string
  document_type: DocumentType
  filename: string
  file_path: string
  file_size: number
  file_extension: string
  mime_type: string
  status: DocumentStatus
  extracted_text?: string
  summary?: string
  analysis_results?: Record<string, any>
  risk_score?: number
  key_clauses?: Array<{
    clause: string
    risk_level: 'high' | 'medium' | 'low'
    description: string
  }>
  metadata?: Record<string, any>
  tags?: string[]
  s3_key?: string
  s3_bucket?: string
  is_public: boolean
  shared_with?: number[]
  owner_id: number
  created_at: string
  updated_at?: string
  processed_at?: string
}

// ============================================================================
// Chat & Conversations
// ============================================================================

export enum MessageRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  SYSTEM = 'SYSTEM',
}

export interface Message {
  id: number
  role: MessageRole
  content: string
  tokens_used?: number
  model_used?: string
  citations?: Array<{
    type: 'statute' | 'case'
    title: string
    reference: string
  }>
  sources?: Array<{
    document_id: number
    title: string
    relevance: number
  }>
  rating?: number
  feedback?: string
  conversation_id: number
  created_at: string
}

export interface Conversation {
  id: number
  title: string
  summary?: string
  legal_area?: string
  metadata?: Record<string, any>
  model_name: string
  temperature: string
  max_tokens: number
  is_active: boolean
  is_archived: boolean
  user_id: number
  created_at: string
  updated_at?: string
  last_message_at?: string
  messages?: Message[]
}

// ============================================================================
// Legal Data
// ============================================================================

export interface LegalCase {
  id: number
  case_number: string
  court_name: string
  court_level: string
  decision_date: string
  case_type: string
  parties: string
  summary: string
  full_text: string
  keywords: string[]
  legal_areas: string[]
  created_at: string
  updated_at?: string
}

export interface Statute {
  id: number
  statute_name: string
  statute_number: string
  article_number: string
  content: string
  effective_date: string
  status: string
  category: string
  created_at: string
  updated_at?: string
}

// ============================================================================
// Templates
// ============================================================================

export interface DocumentTemplate {
  id: number
  name: string
  description: string
  category: string
  template_type: DocumentType
  content: string
  variables: Array<{
    name: string
    type: 'text' | 'number' | 'date' | 'select'
    label: string
    required: boolean
    options?: string[]
  }>
  is_premium: boolean
  usage_count: number
  created_at: string
  updated_at?: string
}

// ============================================================================
// Analytics
// ============================================================================

export interface UsageStats {
  total_queries: number
  queries_this_month: number
  total_documents: number
  total_conversations: number
  storage_used: number
  storage_limit: number
}

export interface DashboardStats {
  total_users: number
  active_users: number
  total_queries_today: number
  total_documents: number
  revenue_this_month: number
  active_subscriptions: number
}

// ============================================================================
// Notifications
// ============================================================================

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  action_url?: string
  created_at: string
}

// ============================================================================
// API Health
// ============================================================================

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down'
  timestamp: string
  database: {
    status: 'connected' | 'disconnected'
    latency_ms: number
  }
  redis: {
    status: 'connected' | 'disconnected'
    latency_ms: number
  }
  elasticsearch?: {
    status: 'connected' | 'disconnected'
    cluster_health: 'green' | 'yellow' | 'red'
  }
}
