import type { Metadata } from 'next'
import { Instrument_Sans, Inter as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import TopBar from '@/components/TopBar'
import localFont from 'next/font/local'
import { Toaster } from '@/components/ui/sonner'
import StartupConsoleLog from '@/components/StartupConsoleLog'
import { ThemeProvider } from 'next-themes'
import Goodbye from '@/components/Goodbye'
import Fall from '@/components/Fall'
import { VercelSpeedInsights } from '@/lib/speed-insights'
import { VercelAnalytics } from '@/lib/analytics'
import FooterGallery from '@/components/Drawing/FooterGallery'
import { PostHogProvider } from './providers'
import ReducedMotionMedia from '@/components/ReducedMotionMedia'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontDisplay = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-display',
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
          fontDisplay.variable,
          editorialNew.variable,
        )}>
        <Fall />
        <ReducedMotionMedia />
        <PostHogProvider>
          <ThemeProvider defaultTheme="system" enableSystem>
            <div className="relative z-10 bg-background rounded-b-3xl shadow-xl">
              <div className="max-w-[768px] mx-auto px-4 py-4 text-foreground relative">
                <TopBar />
                <main className="min-h-screen md:p-24 pt-32">
                  {children}
                  <Goodbye />
                </main>
                <VercelSpeedInsights />
                <VercelAnalytics />
                <Toaster />
                <StartupConsoleLog />
              </div>
            </div>
            <FooterGallery />
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
