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
      variant="link"
      onClick={onClick}
      className={`relative border-2 border-dashed hover:opacity-100 opacity-50 border-black transition-opacity group rounded-sm h-full w-full ${className}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-black">
        <Pencil className="w-8 h-8" />
        <span className="font-medium">Add your own</span>
      </div>
    </Button>
  )
}
