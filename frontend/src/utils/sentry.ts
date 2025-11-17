/**
 * Sentry Error Tracking Configuration
 *
 * Setup Instructions:
 * 1. Install: npm install @sentry/react
 * 2. Get DSN from https://sentry.io/
 * 3. Add VITE_SENTRY_DSN to .env file
 * 4. Uncomment the init() call in main.tsx
 */

// Sentry configuration interface for type safety
export interface SentryConfig {
  dsn: string
  environment: string
  tracesSampleRate: number
  replaysSessionSampleRate: number
  replaysOnErrorSampleRate: number
}

/**
 * Initialize Sentry (placeholder - requires @sentry/react package)
 *
 * To enable:
 * 1. Run: npm install @sentry/react
 * 2. Uncomment the Sentry import and initialization code below
 * 3. Set VITE_SENTRY_DSN in your .env file
 */
export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN

  // Skip initialization if DSN is not configured
  if (!dsn || dsn === 'your-sentry-dsn-here') {
    console.log('Sentry DSN not configured - error tracking disabled')
    return
  }

  // Uncomment when @sentry/react is installed:
  /*
  import * as Sentry from '@sentry/react'

  Sentry.init({
    dsn: dsn,
    environment: import.meta.env.MODE, // 'development' or 'production'

    // Performance Monitoring
    integrations: [
      new Sentry.BrowserTracing({
        // Set sampling rate for performance monitoring
        tracePropagationTargets: [
          'localhost',
          /^https:\/\/lexikor\.ai/,
          /^https:\/\/api\.lexikor\.ai/
        ],
      }),
      new Sentry.Replay({
        // Capture replay for 10% of all sessions
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Performance Monitoring - adjust based on traffic
    tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,

    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Filter out specific errors
    beforeSend(event, hint) {
      // Don't send errors in development
      if (import.meta.env.MODE === 'development') {
        console.error('Sentry error:', hint.originalException || hint.syntheticException)
        return null
      }

      // Filter out known non-critical errors
      const error = hint.originalException as Error
      if (error && error.message) {
        // Ignore network errors
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          return null
        }
        // Ignore ResizeObserver errors (benign)
        if (error.message.includes('ResizeObserver')) {
          return null
        }
      }

      return event
    },

    // Set user context automatically
    initialScope: {
      tags: {
        app_version: import.meta.env.VITE_APP_VERSION || 'unknown'
      }
    }
  })
  */

  console.log('Sentry initialization placeholder - install @sentry/react to enable')
}

/**
 * Capture an exception manually
 * @param error - The error to capture
 * @param context - Additional context
 */
export const captureException = (error: Error, context?: Record<string, any>) => {
  // Log to console in development
  if (import.meta.env.MODE === 'development') {
    console.error('Error:', error, context)
    return
  }

  // Uncomment when @sentry/react is installed:
  /*
  import * as Sentry from '@sentry/react'

  if (context) {
    Sentry.withScope((scope) => {
      Object.keys(context).forEach((key) => {
        scope.setContext(key, context[key])
      })
      Sentry.captureException(error)
    })
  } else {
    Sentry.captureException(error)
  }
  */
}

/**
 * Set user context for error tracking
 * @param userId - The user ID
 * @param email - User email
 * @param plan - Subscription plan
 */
export const setUserContext = (userId: string, email?: string, plan?: string) => {
  // Uncomment when @sentry/react is installed:
  /*
  import * as Sentry from '@sentry/react'

  Sentry.setUser({
    id: userId,
    email: email,
    subscription_plan: plan
  })
  */

  console.log('User context set (placeholder):', { userId, email, plan })
}

/**
 * Clear user context (call on logout)
 */
export const clearUserContext = () => {
  // Uncomment when @sentry/react is installed:
  /*
  import * as Sentry from '@sentry/react'
  Sentry.setUser(null)
  */

  console.log('User context cleared (placeholder)')
}

/**
 * Add breadcrumb for debugging
 * @param message - Breadcrumb message
 * @param category - Category (e.g., 'ui', 'navigation', 'api')
 * @param level - Severity level
 */
export const addBreadcrumb = (
  message: string,
  category: string = 'manual',
  level: 'debug' | 'info' | 'warning' | 'error' = 'info'
) => {
  // Uncomment when @sentry/react is installed:
  /*
  import * as Sentry from '@sentry/react'

  Sentry.addBreadcrumb({
    message,
    category,
    level
  })
  */

  if (import.meta.env.MODE === 'development') {
    console.log(`[Breadcrumb] ${category}:`, message)
  }
}
