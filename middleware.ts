import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export default async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Initialize Supabase SSR Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 2. Check Authentication Session
  // ✅ FIX: Removed console.log debug statements that were leaking session info to server logs
  const { data: { session } } = await supabase.auth.getSession()

  // 3. Protection Logic (PRD Section 04)
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  const isAuthPage =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup') ||
    request.nextUrl.pathname.startsWith('/auth/verify')

  // If trying to access protected pages without being logged in
  if ((isDashboardPage || isAdminPage) && !session?.user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If trying to access auth pages while already logged in, redirect to dashboard
  if (isAuthPage && session?.user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

// Matcher ensures middleware only runs on relevant routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
