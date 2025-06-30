import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const routeMappings = {
  '/rooms': '/odalar',
  '/services': '/hizmetler',
  '/gallery': '/galeri',
  '/contact': '/iletisim',
  // Türkçe yolların İngilizce karşılıkları
  '/odalar': '/rooms',
  '/hizmetler': '/services',
  '/galeri': '/gallery',
  '/iletisim': '/contact',
}

export function middleware(request: NextRequest) {
  // URL'den dil tercihini al
  const language = request.cookies.get('language')?.value || 'tr'
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/rooms',
    '/services',
    '/gallery',
    '/contact',
    '/odalar',
    '/hizmetler',
    '/galeri',
    '/iletisim',
  ],
} 