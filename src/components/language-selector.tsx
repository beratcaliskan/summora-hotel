"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/hooks/useLanguage"
import { languages } from "@/utils/translations"
import type { Language } from "@/types/language"

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  const selectedLanguage = languages.find(lang => lang.code === language)

  return (
    <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
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