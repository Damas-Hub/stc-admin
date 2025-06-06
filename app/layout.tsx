import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'

export const metadata: Metadata = {
  title: 'STC Ghana Dashboard', 
  description: 'STC Ghana Dashboard',
  generator: 'STC Ghana Dashboard',
}

const inter = Inter({ subsets: ['latin'] })
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
