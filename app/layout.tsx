import React from "react"
import type { Metadata } from 'next'
import { Inter, Lora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SettingsProvider } from '@/context/SettingsContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const lora = Lora({ subsets: ['latin'], weight: ['600'], variable: '--font-lora' })

export const metadata: Metadata = {
  title: 'Did I? - Check it off your mind',
  description: 'Smart checklists to end anxiety-driven rechecking',
  generator: 'Did I? App',
  icons: {
    icon: [
      {
        url: '/task.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/task.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/task.png',
        type: 'image/svg+xml',
      },
    ],
    apple: 'public/task.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll("[fdprocessedid]").forEach(e=>e.removeAttribute("fdprocessedid"))})`
        }} />
      </head>
      <body className={`${inter.variable} ${lora.variable} font-sans antialiased`}>
        {/* Decorative sticker backgrounds */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <img
            src="/stickers/healthy-brain.png"
            alt=""
            className="absolute opacity-40 dark:opacity-30 w-[200px] sm:w-[320px] top-8 right-4 rotate-12 select-none"
          />
          <img
            src="/stickers/sunshine.png"
            alt=""
            className="absolute opacity-40 dark:opacity-30 w-[160px] sm:w-[260px] bottom-20 left-2 -rotate-6 select-none"
          />
          <img
            src="/stickers/happy-plant.png"
            alt=""
            className="absolute opacity-30 dark:opacity-20 w-[120px] sm:w-[200px] top-1/3 right-2 rotate-45 select-none"
          />
          <img
            src="/stickers/wellness.png"
            alt=""
            className="absolute opacity-30 dark:opacity-20 w-[140px] sm:w-[220px] bottom-1/3 left-2 -rotate-12 select-none"
          />
        </div>
        <SettingsProvider>
          <div className="relative z-10">
            {children}
          </div>
        </SettingsProvider>
        <Analytics />
      </body>
    </html>
  )
}
