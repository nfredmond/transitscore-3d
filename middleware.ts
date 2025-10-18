import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiter
// In production, consider using Redis or similar for distributed rate limiting
class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private readonly windowMs: number
  private readonly maxRequests: number

  constructor(windowMs: number = 60000, maxRequests: number = 30) {
    this.windowMs = windowMs // 1 minute
    this.maxRequests = maxRequests // 30 requests per minute
  }

  isRateLimited(identifier: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs

    // Get existing requests for this identifier
    const timestamps = this.requests.get(identifier) || []
    
    // Filter out old requests outside the time window
    const recentRequests = timestamps.filter(time => time > windowStart)
    
    // Check if rate limit exceeded
    if (recentRequests.length >= this.maxRequests) {
      return true
    }

    // Add current request timestamp
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    return false
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const windowStart = now - this.windowMs
    const timestamps = this.requests.get(identifier) || []
    const recentRequests = timestamps.filter(time => time > windowStart)
    return Math.max(0, this.maxRequests - recentRequests.length)
  }

  cleanup() {
    // Periodically clean up old entries
    const now = Date.now()
    const windowStart = now - this.windowMs

    for (const [identifier, timestamps] of this.requests.entries()) {
      const recentRequests = timestamps.filter(time => time > windowStart)
      if (recentRequests.length === 0) {
        this.requests.delete(identifier)
      } else {
        this.requests.set(identifier, recentRequests)
      }
    }
  }
}

const rateLimiter = new RateLimiter(60000, 30) // 30 requests per minute

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000)
}

export function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Skip rate limiting for certain endpoints (like health checks)
  const skipRateLimitPaths = ['/api/health']
  if (skipRateLimitPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Get identifier (IP address or forwarded IP)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const identifier = forwardedFor?.split(',')[0] || realIp || 'unknown'

  // Check rate limit
  if (rateLimiter.isRateLimited(identifier)) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        retryAfter: 60
      },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': '30',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + 60000).toISOString()
        }
      }
    )
  }

  // Add rate limit headers to successful responses
  const remaining = rateLimiter.getRemainingRequests(identifier)
  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', '30')
  response.headers.set('X-RateLimit-Remaining', remaining.toString())

  return response
}

export const config = {
  matcher: '/api/:path*'
}

