import type { LanguageOption } from "@/types/language"

export const languages: LanguageOption[] = [
  {
    code: "tr",
    name: "Türkçe",
    flag: "🇹🇷"
  },
  {
    code: "en",
    name: "English",
    flag: "🇺🇸"
  }
]

export const translations = {
  allRightsReserved: {
    en: "All rights reserved.",
    tr: "Tüm hakları saklıdır."
  },
  madeWithLove: {
    en: "Made with ❤️ in Istanbul",
    tr: "İstanbul'da ❤️ ile yapıldı"
  }
} 