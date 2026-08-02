import Image from 'next/image'

import styles from './Book.module.css'

interface BookProps {
  coverUrl: string
  title: string
  author: string
  customDescription: string
}

export default function Book({
  coverUrl,
  title,
  author,
  customDescription,
}: BookProps) {
  return (
    <article className="flex flex-col gap-6 md:flex-row">
      <div className={styles.coverStage}>
        <span className={styles.groundShadow} aria-hidden="true" />
        <span className={styles.bookVolume}>
          <span className={styles.coverFace}>
            <Image
              src={coverUrl}
              alt={`Book cover of ${title}`}
              fill
              sizes="104px"
              unoptimized
              className={styles.coverImage}
              draggable={false}
            />
            <span className={styles.coverSheen} aria-hidden="true" />
          </span>
        </span>
      </div>

      <div className="flex flex-col justify-center gap-2">
        <p className="text-sm">
          {title} <span className="text-xs opacity-50">by {author}</span>
        </p>
        <p className="text-sm">{customDescription}</p>
      </div>
    </article>
  )
}
