"use client"

import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import Link from "next/link"
import { useLanguage } from "@/hooks/useLanguage"

export function Header() {
  const { t, currentLanguage } = useLanguage()
  
  const getLocalizedPath = (path: string) => {
    const paths = {
      rooms: { en: '/rooms', tr: '/odalar' },
      services: { en: '/services', tr: '/hizmetler' },
      gallery: { en: '/gallery', tr: '/galeri' },
      contact: { en: '/contact', tr: '/iletisim' }
    }
    return paths[path as keyof typeof paths][currentLanguage]
  }

  return (
    <header className="bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-2xl">S</span>
            </div>
            <div>
              <span className="text-3xl font-bold">Summora</span>
              <p className="text-orange-100 text-sm">Boutique Hotel</p>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href={getLocalizedPath('rooms')} className="hover:text-orange-200 transition-colors">
              {t.rooms}
            </Link>
            <Link href={getLocalizedPath('services')} className="hover:text-orange-200 transition-colors">
              {t.services}
            </Link>
            <Link href={getLocalizedPath('gallery')} className="hover:text-orange-200 transition-colors">
              {t.gallery}
            </Link>
            <Link href={getLocalizedPath('contact')} className="hover:text-orange-200 transition-colors">
              {t.contact}
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Button variant="outline" className="bg-white text-orange-600 hover:bg-orange-50">
              {t.login}
            </Button>
            <Button variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50">
              {t.reservation}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 