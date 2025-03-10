import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-accent">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased overflow-x-hidden relative',
          fontSans.variable,
          editorialNew.variable
        )}>
        <Fall />
        <div className="max-w-[768px] md:border-x border-x-0 border-x-border mx-auto px-4 py-4 text-foreground">
          <ThemeProvider defaultTheme="system" enableSystem>
            <TopBar />
            <div className="min-h-screen md:p-24 pt-32">
              {children}
              <Goodbye />
            </div>
            <VercelSpeedInsights />
            <VercelAnalytics />
            <Toaster />
            <StartupConsoleLog />
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
