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
