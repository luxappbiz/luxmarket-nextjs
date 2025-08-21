
import type { Metadata } from 'next'
import { Inter, Baskervville, Roboto } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/contexts/UserContext'
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ['latin'] })
const baskervville = Baskervville({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-baskervville',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})


export const metadata: Metadata = {
  title: 'LUX Market - Luxury Marketplace',
  description: 'A membership marketplace that connects luxury buyers and sellers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${baskervville.variable} ${roboto.variable} font-sans`}>
          <UserProvider>
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster />
          </UserProvider>
      </body>
    </html>
  )
}