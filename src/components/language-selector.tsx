"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/hooks/useLanguage"
import type { Language } from "@/types/language"

const languages = [
  { code: 'tr' as Language, name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en' as Language, name: 'English', flag: '🇬🇧' }
]

export function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguage()

  const selectedLanguage = languages.find(lang => lang.code === currentLanguage)

  return (
    <Select value={currentLanguage} onValueChange={(value: Language) => setLanguage(value)}>
      <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white hover:bg-white/20">
        <div className="flex items-center space-x-2">
{/*           <span>{selectedLanguage?.flag}</span> */}
          <SelectValue placeholder={selectedLanguage?.name} className="text-white" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center space-x-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 