'use client'

import { useEffect, useState } from 'react'
import {
  getBucketListItems,
  supabase,
  type BucketListItem,
} from '@/lib/supabase'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { UserIcon } from 'lucide-react'

const rowClassName =
  'grid min-h-6 grid-cols-[5ch_minmax(0,1fr)] items-center gap-x-4'
const skeletonWidths = ['w-3/4', 'w-1/2', 'w-5/6', 'w-2/3', 'w-1/2']

export default function BucketList() {
  const [items, setItems] = useState<BucketListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()

    // Subscribe to changes
    const channel = supabase
      .channel(`bucket_list_display_changes:${crypto.randomUUID()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bucket_list_items',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            toast.success('New item added to the bucket list!')
          } else if (payload.eventType === 'UPDATE') {
            toast.info('Bucket list order has been updated!')
          }
          fetchItems()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchItems = async () => {
    try {
      setItems(await getBucketListItems())
      setLoading(false)
    } catch (error) {
      console.error('Error fetching items:', error)
      toast.error('Failed to load bucket list items')
    }
  }

  return (
    <div className="my-8 text-sm" aria-busy={loading} aria-label="Bucket list">
      <div className={`${rowClassName} mb-2 font-medium text-muted-foreground`}>
        <span
          className="cursor-help"
          title="Elo score represents the relative priority of items. Higher numbers indicate higher priority.">
          Elo
        </span>
        <span>Item description</span>
      </div>
      {loading && (
        <span role="status" className="sr-only">Loading bucket list…</span>
      )}
      <ol className="m-0 list-none space-y-2 p-0">
        {loading ? (
          skeletonWidths.map((width, i) => (
            <li key={i} className={rowClassName} aria-hidden="true">
              <Skeleton className="h-3 w-full rounded-sm bg-foreground/10 motion-reduce:animate-none" />
              <Skeleton className={`h-4 ${width} rounded-sm bg-foreground/10 motion-reduce:animate-none`} />
            </li>
          ))
        ) : [...items]
          .sort((a, b) =>
            a.completed === b.completed ? 0 : a.completed ? 1 : -1
          )
          .map((item) => (
            <li key={item.id} className={`${rowClassName} group`}>
              <span className="self-start pt-1 text-muted-foreground font-mono tabular-nums text-xs">
                {item.completed
                  ? '0000'
                  : item.elo_score.toString().padStart(4, '0')}
                :
              </span>
              <div className="flex min-h-6 min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <span className={`min-w-0 break-words ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {item.title}
                </span>

                {item.suggested_by && (
                  <div className="flex items-center gap-1 overflow-hidden">
                    <span className="text-xs text-muted-foreground whitespace-nowrap max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-focus-within:max-w-[200px] group-focus-within:opacity-100 transition-all duration-300 ease-in-out motion-reduce:transition-none">
                      Added by
                    </span>
                    <a
                      href={item.suggested_by}
                      target="_blank"
                      rel="noopener"
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="h-6 w-6 rounded-full overflow-hidden border border-input bg-card shrink-0 hover:opacity-80 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                      {item.suggested_by_avatar ? (
                        <div className="relative h-full w-full">
                          <Image
                            src={item.suggested_by_avatar}
                            alt="Avatar of the person who suggested this item"
                            fill
                            sizes="24px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <UserIcon className="w-3 h-3" />
                        </div>
                      )}
                    </a>
                    <span className="text-xs text-muted-foreground whitespace-nowrap max-w-0 group-hover:max-w-[200px] group-focus-within:max-w-[200px] transition-all duration-200 motion-reduce:transition-none">
                      {item.price && ` for $${item.price.toLocaleString()}`}
                    </span>
                  </div>
                )}
              </div>
            </li>
          ))}
      </ol>
    </div>
  )
}
