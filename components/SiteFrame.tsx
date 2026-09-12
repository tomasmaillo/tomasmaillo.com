import TopBar from '@/components/TopBar'
import Goodbye from '@/components/Goodbye'

type SiteFrameProps = {
  children: React.ReactNode
  className?: string
}

export default function SiteFrame({ children, className = '' }: SiteFrameProps) {
  return (
    <div className={`relative z-10 bg-background ${className}`}>
      <div className="max-w-[768px] mx-auto px-4 py-4 text-foreground relative">
        <TopBar />
        <main className="min-h-screen md:p-24 pt-32">
          {children}
          <Goodbye />
        </main>
      </div>
    </div>
  )
}
