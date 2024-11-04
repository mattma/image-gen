import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Live Image Generation',
  description: 'An awesome image generation app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased h-screen overflow-hidden">{children}</body>
    </html>
  )
}
