"use client"

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { usePathname, useRouter } from 'next/navigation'
import { Language } from '@/types/language'

const translations = {
  tr: {
    rooms: "Odalar",
    services: "Hizmetler",
    gallery: "Galeri",
    contact: "İletişim",
    reservation: "Rezervasyon",
    login: "Giriş Yap",
    loginTitle: "Üye Girişi",
    loginDesc: "Rezervasyonlarınızı yönetmek ve özel tekliflerden yararlanmak için giriş yapın.",
    heroTitle: "Summora'ya Hoş Geldiniz",
    heroSubtitle: "Konforun ve Zarafetin Buluştuğu Yer",
    heroDescription: "İstanbul'un kalbinde, eşsiz konfor ve mükemmel hizmet anlayışıyla unutulmaz bir konaklama deneyimi yaşayın.",
    makeReservation: "Rezervasyon Yapın",
    checkIn: "Giriş Tarihi",
    checkOut: "Çıkış Tarihi",
    guests: "Misafir Sayısı",
    roomType: "Oda Tipi",
    fullName: "Ad Soyad",
    phone: "Telefon",
    email: "E-posta",
    specialRequests: "Özel İstekler",
    makeReservationBtn: "Rezervasyon Yap",
    ourRooms: "Odalarımız",
    ourRoomsDesc: "Her bütçeye uygun, konforlu ve modern odalarımızla sizleri ağırlıyoruz.",
    popular: "Popüler",
    recommended: "Önerilen",
    luxury: "Lüks",
    standardRoom: "Standart Oda",
    deluxeRoom: "Deluxe Oda",
    suiteRoom: "Suit Oda",
    presidentialSuite: "Presidential Suit",
    night: "gece",
    ourServices: "Hizmetlerimiz",
    ourServicesDesc: "Size en iyi deneyimi sunmak için özel hizmetlerimiz.",
    restaurant: "Restoran",
    restaurantDesc: "Yerel ve dünya mutfağından lezzetler",
    spa: "SPA & Wellness",
    spaDesc: "Dinlenmek ve yenilenmek için",
    fitness: "Fitness Center",
    fitnessDesc: "24 saat açık modern spor salonu",
    valet: "Vale Hizmeti",
    valetDesc: "Araç park ve teslim hizmeti",
    whyLunara: "Neden Summora?",
    whyLunaraDesc: "Bizi farklı kılan özellikler ve kaliteli hizmet anlayışımız.",
    awardService: "Ödüllü Hizmet",
    awardServiceDesc: "Sektörde tanınan kaliteli hizmet anlayışımız",
    concierge: "24/7 Concierge",
    conciergeDesc: "Her an hizmetinizde olan deneyimli ekibimiz",
    personalTouch: "Kişisel Dokunuş",
    personalTouchDesc: "Her misafirimize özel yaklaşım",
    contactTitle: "Bizimle İletişime Geçin",
    contactDesc: "Sorularınız için bize ulaşın, size yardımcı olmaktan mutluluk duyarız.",
    followUs: "Bizi Takip Edin",
    sendMessage: "Mesaj Gönder",
    firstName: "Ad",
    lastName: "Soyad",
    yourMessage: "Mesajınız",
    sendBtn: "Gönder",
    allRightsReserved: "Tüm hakları saklıdır.",
    madeWithLove: "❤️ ile İstanbul'da yapıldı"
  },
  en: {
    rooms: "Rooms",
    services: "Services",
    gallery: "Gallery",
    contact: "Contact",
    reservation: "Reservation",
    login: "Login",
    loginTitle: "Login",
    loginDesc: "Login to manage your reservations and take advantage of special offers.",
    heroTitle: "Welcome to Summora",
    heroSubtitle: "Where Comfort Meets Elegance",
    heroDescription: "Experience an unforgettable stay in the heart of Istanbul with exceptional comfort and perfect service.",
    makeReservation: "Make a Reservation",
    checkIn: "Check-in Date",
    checkOut: "Check-out Date",
    guests: "Number of Guests",
    roomType: "Room Type",
    fullName: "Full Name",
    phone: "Phone",
    email: "Email",
    specialRequests: "Special Requests",
    makeReservationBtn: "Make Reservation",
    ourRooms: "Our Rooms",
    ourRoomsDesc: "We welcome you with comfortable and modern rooms suitable for every budget.",
    popular: "Popular",
    recommended: "Recommended",
    luxury: "Luxury",
    standardRoom: "Standard Room",
    deluxeRoom: "Deluxe Room",
    suiteRoom: "Suite Room",
    presidentialSuite: "Presidential Suite",
    night: "night",
    ourServices: "Our Services",
    ourServicesDesc: "Our special services to provide you with the best experience.",
    restaurant: "Restaurant",
    restaurantDesc: "Flavors from local and world cuisine",
    spa: "SPA & Wellness",
    spaDesc: "To relax and rejuvenate",
    fitness: "Fitness Center",
    fitnessDesc: "24-hour modern gym",
    valet: "Valet Service",
    valetDesc: "Car parking and delivery service",
    whyLunara: "Why Summora?",
    whyLunaraDesc: "The features that make us different and our quality service approach.",
    awardService: "Award-winning Service",
    awardServiceDesc: "Our quality service approach recognized in the industry",
    concierge: "24/7 Concierge",
    conciergeDesc: "Our experienced team at your service at all times",
    personalTouch: "Personal Touch",
    personalTouchDesc: "Special approach to each of our guests",
    contactTitle: "Get in Touch",
    contactDesc: "Contact us for your questions, we would be happy to help you.",
    followUs: "Follow Us",
    sendMessage: "Send Message",
    firstName: "First Name",
    lastName: "Last Name",
    yourMessage: "Your Message",
    sendBtn: "Send",
    allRightsReserved: "All rights reserved.",
    madeWithLove: "Made with ❤️ in Istanbul"
  }
}

type LanguageContextType = {
  t: typeof translations[Language]
  currentLanguage: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const pathMappings = {
  tr: {
    '/rooms': '/odalar',
    '/services': '/hizmetler',
    '/gallery': '/galeri',
    '/contact': '/iletisim'
  },
  en: {
    '/odalar': '/rooms',
    '/hizmetler': '/services',
    '/galeri': '/gallery',
    '/iletisim': '/contact'
  }
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('tr')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage)
      }
    }
  }, [])

  const updateURL = (lang: Language) => {
    const mappings = pathMappings[lang]
    let newPath = pathname

    // URL'yi güncelle
    Object.entries(mappings).forEach(([oldPath, newPath]) => {
      if (pathname.startsWith(oldPath)) {
        // replace kullanarak sayfa yenilenmesini önle
        window.history.pushState({}, '', pathname.replace(oldPath, newPath))
        return
      }
    })
  }

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
      updateURL(lang)
    }
  }

  const value = {
    t: translations[currentLanguage],
    currentLanguage,
    setLanguage
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 