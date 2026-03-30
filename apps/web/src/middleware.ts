import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Solo proteger rutas de admin
const adminRoutes = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteger solo rutas admin (requiere login)
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    const { getToken } = await import('next-auth/jwt')
    const token = await getToken({ req: request })
    if (!token || token.rol !== 'ADMIN') {
      return NextResponse.redirect(new URL('/consulta', request.url))
    }
  }

  // Headers de seguridad
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|og-image.png|manifest.json|robots.txt|sitemap.xml).*)',
  ],
}
