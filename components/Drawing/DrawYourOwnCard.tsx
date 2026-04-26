import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DrawYourOwnCardProps {
  onClick: () => void
  className?: string
}

export default function DrawYourOwnCard({
  onClick,
  className = '',
}: DrawYourOwnCardProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`relative border-2 border-dashed border-foreground/25 hover:border-foreground/40 bg-muted/20 hover:bg-muted/30 text-foreground transition-colors group rounded-sm h-full w-full ${className}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <Pencil className="w-8 h-8" />
        <span className="font-medium">Add your own</span>
      </div>
    </Button>
  )
}
