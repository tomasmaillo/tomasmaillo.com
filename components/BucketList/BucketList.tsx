'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { UserIcon } from 'lucide-react'

interface BucketListItem {
  id: string
  title: string
  elo_score: number
  completed: boolean
  suggested_by?: string
  suggested_by_avatar?: string
  price?: number
}

export default function BucketList() {
  const [items, setItems] = useState<BucketListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()

    // Subscribe to changes
    const channel = supabase
      .channel('bucket_list_changes')
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
      const { data, error } = await supabase
        .from('bucket_list_items')
        .select('*')
        .order('elo_score', { ascending: false })

      if (error) {
        throw error
      }

      setItems(data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching items:', error)
      toast.error('Failed to load bucket list items')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="my-8">
      <div className="flex items-center gap-4 mb-2 ml-6 text-sm font-medium text-muted-foreground">
        <span
          className="cursor-help"
          title="ELO score represents the relative priority of items. Higher numbers indicate higher priority.">
          ELO
        </span>
        <span>Item Description</span>
      </div>
      <ol className="list-none pl-4 text-sm">
        {items
          .sort((a, b) =>
            a.completed === b.completed ? 0 : a.completed ? 1 : -1
          )
          .map((item) => (
            <li key={item.id} className="my-2 text-sm">
              <div className="flex items-center gap-2 group">
                <span className="text-muted-foreground font-mono tabular-nums text-xs mr-2 inline-block">
                  {item.completed
                    ? '0000'
                    : item.elo_score.toString().padStart(4, '0')}
                  :
                </span>
                <span
                  className={item.completed ? 'line-through opacity-50' : ''}>
                  {item.title}
                </span>

                {item.suggested_by && (
                  <div className="flex items-center gap-1 overflow-hidden">
                    <span className="text-xs text-muted-foreground whitespace-nowrap max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 transition-all duration-300 ease-in-out">
                      Added by
                    </span>
                    <a
                      href={item.suggested_by}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-6 w-6 rounded-full overflow-hidden border border-border bg-card shrink-0 hover:opacity-80 transition-opacity">
                      {item.suggested_by_avatar ? (
                        <div className="relative h-full w-full">
                          <Image
                            src={item.suggested_by_avatar}
                            alt="Added by"
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
                    <span className="text-xs text-muted-foreground whitespace-nowrap max-w-0 group-hover:max-w-[200px] transition-all duration-200">
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
