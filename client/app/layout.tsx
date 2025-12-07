import type React from "react"
import type { Metadata } from "next"
import { Blinker, Battambang } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const blinker = Blinker({
  subsets: ["latin"],
  variable: "--font-blinker",
  weight: ["400", "700"],
})

const battambang = Battambang({
  subsets: ["latin"],
  variable: "--font-battambang",
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "DocBert - Document Search Engine",
  description: "Find similar documents with AI-powered search",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${blinker.variable} ${battambang.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
