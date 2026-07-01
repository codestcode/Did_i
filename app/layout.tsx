import React from "react"
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SettingsProvider } from '@/context/SettingsContext'

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
      <body className={`font-sans antialiased`}>
        <SettingsProvider>
          {children}
        </SettingsProvider>
        <Analytics />
      </body>
    </html>
  )
}
