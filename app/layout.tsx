import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import { cn } from '@/lib/utils'
import TopBar from '@/components/TopBar'
import localFont from 'next/font/local'
import { Toaster } from '@/components/ui/sonner'
import StartupConsoleLog from '@/components/StartupConsoleLog'
import { ThemeProvider } from '@/components/theme-provider'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const editorialNew = localFont({
  src: [
    {
      path: '../public/fonts/PPEditorialNew-Regular.otf',
      weight: '400',
    },
    {
      path: '../public/fonts/PPEditorialNew-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/PPEditorialNew-Ultrabold.otf',
      weight: '800',
    },
    {
      path: '../public/fonts/PPEditorialNew-UltraboldItalic.otf',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../public/fonts/PPEditorialNew-Ultralight.otf',
      weight: '200',
    },
    {
      path: '../public/fonts/PPEditorialNew-UltralightItalic.otf',
      weight: '200',
      style: 'italic',
    },
  ],
  variable: '--font-editorial-new',
})

export const metadata: Metadata = {
  title: 'Tomas Maillo',
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased max-w-[768px] border-x border-x-border mx-auto px-4 py-4 text-foreground',
          fontSans.variable,
          editorialNew.variable
        )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <TopBar />
          <div className="min-h-screen md:p-24 pt-32">{children}</div>
          <SpeedInsights />
          <Analytics />
          <Toaster />
          <StartupConsoleLog />
        </ThemeProvider>
      </body>
    </html>
  )
}
