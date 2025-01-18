import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('user')?.value
  const { pathname } = request.nextUrl
  
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isTesteosPage = 
    pathname.startsWith('/testeos') || 
    pathname.match(/^\/testeos\/[\w-]+$/) !== null

  const isValidUser = userCookie ? isValidUserJson(userCookie) : false

  if (!isValidUser && isTesteosPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isValidUser && isAuthPage) {
    return NextResponse.redirect(new URL('/testeos', request.url))
  }

  return NextResponse.next()
}

function isValidUserJson(jsonString: string) {
  try {
    const user = JSON.parse(jsonString)
    return user && user.id && user.username
  } catch {
    return false
  }
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/testeos',
    '/testeos/nuevo_testeo',
    '/testeos/:path*'
  ]
}