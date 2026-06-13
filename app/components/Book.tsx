import Image from 'next/image'

interface BookProps {
  query: string // ISBN
  title: string
  author: string
  customDescription: string
}

export default function Book({
  query,
  title,
  author,
  customDescription,
}: BookProps) {
  const isbn = query.replace(/[^0-9X]/gi, '')
  const imageUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="relative w-24 h-32 flex-shrink-0 rounded-sm">
        <Image
          src={imageUrl}
          alt={`Book cover of ${title}`}
          fill
          className="object-contain rounded-sm"
          draggable={false}
        />
      </div>
      <div className="flex flex-col gap-2 justify-center">
        <p className="text-sm">
          {title} <span className="text-xs opacity-50">by {author}</span>
        </p>
        <p className="text-sm">{customDescription}</p>
      </div>
    </div>
  )
}
