import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'
import StartupConsoleLog from '@/components/StartupConsoleLog'
import { ThemeProvider } from 'next-themes'
import { VercelSpeedInsights } from '@/lib/speed-insights'
import { VercelAnalytics } from '@/lib/analytics'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
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
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <body
        className={cn(
          'min-h-screen font-sans antialiased overflow-x-hidden relative bg-background text-foreground',
          spaceGrotesk.variable
        )}>
        <ThemeProvider defaultTheme="dark" enableSystem={false}>
          <div className="max-w-[600px] mx-auto px-6 py-8">
            <div className="pt-8">{children}</div>
            <VercelSpeedInsights />
            <VercelAnalytics />
            <Toaster />
            <StartupConsoleLog />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
