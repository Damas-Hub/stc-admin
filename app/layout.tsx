import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'STC Ghana Dashboard',
  description: 'STC Ghana Dashboard',
  generator: 'STC Ghana Dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
