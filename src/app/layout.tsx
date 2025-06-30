import { Geist } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/hooks/useLanguage"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
})

export const metadata = {
  title: "Summora Hotel",
  description: "İstanbul'un kalbinde, eşsiz konfor ve mükemmel hizmet anlayışıyla unutulmaz bir konaklama deneyimi yaşayın.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geistSans.className}>
      <body>
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
