import type { Metadata, Viewport } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import localFont from 'next/font/local'
import { Toaster } from '@/components/ui/sonner'
import StartupConsoleLog from '@/components/StartupConsoleLog'
import { ThemeProvider } from 'next-themes'
import Fall from '@/components/Fall'
import { VercelSpeedInsights } from '@/lib/speed-insights'
import { VercelAnalytics } from '@/lib/analytics'
import { PostHogProvider } from './providers'
import ReducedMotionMedia from '@/components/ReducedMotionMedia'

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
  description: 'Tomas Maillo Portfolio: Software Engineer',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen font-sans antialiased overflow-x-hidden relative',
          fontSans.variable,
          editorialNew.variable,
        )}>
        <Fall />
        <ReducedMotionMedia />
        <PostHogProvider>
          <ThemeProvider defaultTheme="system" enableSystem>
            {children}
            <VercelSpeedInsights />
            <VercelAnalytics />
            <Toaster />
            <StartupConsoleLog />
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
