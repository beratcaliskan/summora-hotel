"use client"

import { useLanguage } from "@/hooks/useLanguage"

export function Footer() {
  const { t } = useLanguage()


  return (
<footer className="bg-gray-900 text-white py-8">
<div className="container mx-auto px-4">
  <div className="flex flex-col md:flex-row items-center justify-between">
    <div className="flex items-center space-x-3 mb-4 md:mb-0">
      <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-xl">S</span>
      </div>
      <div>
        <span className="text-2xl font-bold">Summora</span>
        <p className="text-gray-400 text-sm">Boutique Hotel</p>
      </div>
    </div>
    <div className="text-center md:text-right">
      <p className="text-gray-400">&copy; 2024 Summora Boutique Hotel. {t.allRightsReserved}</p>
      <p className="text-gray-500 text-sm mt-1">{t.madeWithLove}</p>
    </div>
  </div>
</div>
</footer>
  )
}
