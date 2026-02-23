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
import Gallery from '@/components/Drawing/Gallery'

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen font-sans antialiased overflow-x-hidden relative',
          fontSans.variable,
          editorialNew.variable,
        )}>
        <Fall />
        <ThemeProvider defaultTheme="system" enableSystem>
          <div className="fixed bottom-0 left-0 w-full h-[32rem] bg-accent mt-24"></div>
          <div className="fixed bottom-0 left-0 w-full h-96 mt-24">
            <Gallery />
          </div>
          <div className="relative bg-background rounded-b-3xl shadow-xl">
            <div className="max-w-[768px] md:border-x border-x-0 border-x-border mx-auto px-4 py-4 text-foreground mb-96 relative">
              <TopBar />
              <div className="min-h-screen md:p-24 pt-32">
                {children}
                <Goodbye />
              </div>
              <VercelSpeedInsights />
              <VercelAnalytics />
              <Toaster />
              <StartupConsoleLog />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
