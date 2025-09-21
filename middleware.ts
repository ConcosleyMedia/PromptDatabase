import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function middleware(request: NextRequest) {
  // Temporarily disable middleware to debug server errors
  // Just pass through all requests without any processing
  console.log('Middleware bypassed for debugging:', request.nextUrl.pathname)
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Temporarily match fewer routes for debugging
    '/dashboard',
    '/admin',
  ],
}