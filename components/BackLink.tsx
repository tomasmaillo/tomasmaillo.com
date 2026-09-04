'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const BackLink = () => {
  const router = useRouter()

  useEffect(() => {
    const goBack = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isEditing =
        target?.isContentEditable ||
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT'

      if (event.key === 'Escape' && !event.defaultPrevented && !isEditing) {
        router.push('/')
      }
    }

    window.addEventListener('keydown', goBack)
    return () => window.removeEventListener('keydown', goBack)
  }, [router])

  return (
    <Link
      href="/"
      aria-label="Back to home"
      title="Back to home (Esc)"
      className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-[0.8rem] bg-transparent text-foreground !no-underline transition-colors duration-200 hover:bg-card hover:!no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
      <ArrowLeft aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
    </Link>
  )
}

export default BackLink
