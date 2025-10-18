import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Only protect the paid version routes
  if (process.env.NEXT_PUBLIC_APP_VERSION === 'paid') {
    const supabase = createMiddlewareClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()

    // Allow auth pages and API routes
    if (
      req.nextUrl.pathname.startsWith('/api/') ||
      req.nextUrl.pathname === '/auth' ||
      req.nextUrl.pathname === '/subscribe'
    ) {
      return res
    }

    // Redirect to auth if not signed in
    if (!session) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/auth'
      return NextResponse.redirect(redirectUrl)
    }

    // Check subscription status
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', session.user.id)
      .single()

    if (!subscription || subscription.status !== 'active') {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/subscribe'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}

