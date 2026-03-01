
import * as Sentry from '@sentry/nextjs'
/**
 * Logger Utility
 *
 * A centralized logger for the application that handles environment-aware logging.
 *
 * - Logs messages at different levels: info, warn, error
 * - Uses console logging in development for quick debugging
 * - Sends logs to Sentry in production for error tracking and monitoring
 * - Supports optional extra context (e.g., user ID, route, request info)
 *
 * Usage:
 *   import { logger } from '@/lib/logger'
 *
 *   logger.info('Page loaded', { route: '/home' })
 *   logger.warn('Deprecated API used')
 *   logger.error('Something went wrong')
 *   logger.error(new Error('Network failed'), { userId: 123 })
 */


const isProd = process.env.NODE_ENV === 'production'

export const logger = {
  info: (message: string, extra?: unknown) => {
    if (isProd) {
      Sentry.captureMessage(message, { level: 'info' })
    } else {
      console.log('[INFO]', message, extra || '')
    }
  },

  warn: (message: string, extra?: unknown) => {
    if (isProd) {
      Sentry.captureMessage(message, { level: 'warning' })
    } else {
      console.warn('[WARN]', message, extra || '')
    }
  },

  error: (message: string | Error, extra?: unknown) => {
    if (isProd) {
      if (message instanceof Error) {
        Sentry.captureException(message)
      } else {
        Sentry.captureMessage(message, { level: 'error' })
      }
    } else {
      console.error('[ERROR]', message, extra || '')
    }
  },
}
