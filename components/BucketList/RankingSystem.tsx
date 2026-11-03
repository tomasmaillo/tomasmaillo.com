'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  getBucketListItems,
  supabase,
  type BucketListItem,
} from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

const choiceClassName =
  'h-32 w-full min-w-0 whitespace-normal break-words rounded-md border border-input bg-card p-4 text-left text-foreground'

export default function RankingSystem() {
  const [currentPair, setCurrentPair] = useState<
    [BucketListItem, BucketListItem] | null
  >(null)
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [totalVotes, setTotalVotes] = useState(0)

  const fetchItems = useCallback(async () => {
    try {
      const data = await getBucketListItems()
      setLoading(false)
      const activeItems = data.filter((item) => !item.completed)
      if (activeItems.length < 2) {
        setCurrentPair(null)
      } else {
        const shuffled = [...activeItems].sort(() => 0.5 - Math.random())
        setCurrentPair([shuffled[0], shuffled[1]])
      }
    } catch (error) {
      console.error('Error fetching items:', error)
      toast.error('Failed to load bucket list items')
    }
  }, [])

  const fetchTotalVotes = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })

      if (error) throw error
      setTotalVotes(count || 0)
    } catch (error) {
      console.error('Error fetching vote count:', error)
    }
  }, [])

  useEffect(() => {
    fetchItems()
    fetchTotalVotes()

    // Subscribe to changes
    const channel = supabase
      .channel(`bucket_list_ranking_changes:${crypto.randomUUID()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bucket_list_items',
        },
        () => {
          fetchItems()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchItems, fetchTotalVotes])

  const handleChoice = async (
    winner: BucketListItem,
    loser: BucketListItem
  ) => {
    if (isUpdating) return

    setIsUpdating(true)
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          winnerId: winner.id,
          loserId: loser.id,
        }),
      })

      if (!response.ok) throw new Error('Failed to record vote')

      await Promise.all([fetchItems(), fetchTotalVotes()])
      toast.success('Rankings updated!')
    } catch (error) {
      console.error('Error updating scores:', error)
      toast.error('Failed to update rankings')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <section aria-labelledby="bucket-ranking-heading" aria-busy={loading}>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="bucket-ranking-heading" className="text-base font-medium">
          Which should Tomas prioritise?
        </h2>
        <span className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
          Total votes:{' '}
          {loading ? (
            <Skeleton aria-hidden="true" className="h-3 w-8 rounded-sm bg-foreground/10 motion-reduce:animate-none" />
          ) : totalVotes}
        </span>
      </div>
      {loading && (
        <span role="status" className="sr-only">Loading choices…</span>
      )}
      {!loading && !currentPair ? (
        <div className="text-center py-8 text-muted-foreground">
          No more items to compare!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loading ? (
            [0, 1].map((index) => (
              <div
                key={index}
                className={`${choiceClassName} flex items-center justify-center`}
                aria-hidden="true">
                <Skeleton className="h-4 w-3/4 rounded-sm bg-foreground/10 motion-reduce:animate-none" />
              </div>
            ))
          ) : currentPair?.map((item, index) => (
            <Button
              key={item.id}
              variant="outline"
              className={`${choiceClassName} hover:border-accent hover:text-accent hover:no-underline focus-visible:ring-accent`}
              onClick={() => handleChoice(item, currentPair[index === 0 ? 1 : 0])}
              disabled={isUpdating}>
              {isUpdating ? 'Updating...' : item.title}
            </Button>
          ))}
        </div>
      )}
    </section>
  )
}
