/**
 * Google Analytics utility for tracking user events
 *
 * Usage:
 * import { trackEvent, trackPageView } from '@/utils/analytics'
 *
 * trackPageView('/dashboard')
 * trackEvent('button_click', 'upgrade_button', 'billing_page')
 */

// TypeScript declaration for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void
    dataLayer?: any[]
  }
}

/**
 * Track a page view
 * @param path - The page path (e.g., '/dashboard')
 * @param title - Optional page title
 */
export const trackPageView = (path: string, title?: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title
    })
  }
}

/**
 * Track a custom event
 * @param action - The action being tracked (e.g., 'button_click', 'form_submit')
 * @param category - Event category (e.g., 'engagement', 'conversion')
 * @param label - Optional label for additional context
 * @param value - Optional numeric value
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    })
  }
}

/**
 * Track user signup
 * @param method - Signup method (e.g., 'email', 'google')
 */
export const trackSignup = (method: string = 'email') => {
  trackEvent('sign_up', 'conversion', method)
}

/**
 * Track user login
 * @param method - Login method (e.g., 'email', 'google')
 */
export const trackLogin = (method: string = 'email') => {
  trackEvent('login', 'engagement', method)
}

/**
 * Track purchase/subscription
 * @param plan - Subscription plan (e.g., 'professional', 'enterprise')
 * @param value - Transaction value in KRW
 */
export const trackPurchase = (plan: string, value: number) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'purchase', {
      currency: 'KRW',
      value: value,
      items: [{
        item_id: plan,
        item_name: `LexiKor ${plan} Plan`,
        price: value,
        quantity: 1
      }]
    })
  }
}

/**
 * Track upgrade intent (when user clicks upgrade button)
 * @param source - Where the upgrade button was clicked (e.g., 'dashboard', 'billing')
 * @param plan - Target plan (e.g., 'professional')
 */
export const trackUpgradeIntent = (source: string, plan: string) => {
  trackEvent('upgrade_click', 'conversion', `${source}_to_${plan}`)
}

/**
 * Track document actions
 * @param action - The action (e.g., 'upload', 'analyze', 'download')
 * @param documentType - Type of document (e.g., 'contract', 'precedent')
 */
export const trackDocumentAction = (action: string, documentType?: string) => {
  trackEvent(action, 'document', documentType)
}

/**
 * Track AI query usage
 * @param feature - The feature used (e.g., 'chat', 'research', 'template')
 * @param queryType - Optional query type
 */
export const trackAIQuery = (feature: string, queryType?: string) => {
  trackEvent('ai_query', 'product_usage', `${feature}${queryType ? `_${queryType}` : ''}`)
}

/**
 * Track errors (for monitoring user-facing errors)
 * @param errorMessage - The error message
 * @param errorLocation - Where the error occurred
 * @param fatal - Whether the error was fatal
 */
export const trackError = (errorMessage: string, errorLocation: string, fatal: boolean = false) => {
  trackEvent('error', 'technical', `${errorLocation}: ${errorMessage}`, fatal ? 1 : 0)
}

/**
 * Set user properties (call after login)
 * @param userId - The user ID
 * @param properties - Additional user properties
 */
export const setUserProperties = (userId: string, properties?: Record<string, any>) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', 'G-XXXXXXXXXX', {
      user_id: userId,
      ...properties
    })
  }
}
