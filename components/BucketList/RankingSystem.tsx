'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { LoaderPinwheel } from 'lucide-react'

interface BucketListItem {
  id: string
  title: string
  elo_score: number
  completed: boolean
}

export default function RankingSystem() {
  const [items, setItems] = useState<BucketListItem[]>([])
  const [currentPair, setCurrentPair] = useState<
    [BucketListItem, BucketListItem] | null
  >(null)
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [totalVotes, setTotalVotes] = useState(0)

  useEffect(() => {
    fetchItems()
    fetchTotalVotes()
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

  const fetchTotalVotes = async () => {
    try {
      const { count, error } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })

      if (error) throw error
      setTotalVotes(count || 0)
    } catch (error) {
      console.error('Error fetching vote count:', error)
    }
  }

  useEffect(() => {
    if (items.length > 0) {
      selectRandomPair()
    }
  }, [items])

  const selectRandomPair = () => {
    const activeItems = items.filter((item) => !item.completed)
    if (activeItems.length < 2) {
      setCurrentPair(null)
      return
    }

    const shuffled = [...activeItems].sort(() => 0.5 - Math.random())
    setCurrentPair([shuffled[0], shuffled[1]])
  }

  const handleChoice = async (
    winner: BucketListItem,
    loser: BucketListItem
  ) => {
    if (isUpdating) return

    setIsUpdating(true)
    try {
      const { error: eloError } = await supabase.rpc('update_elo_scores', {
        winner_id: winner.id,
        loser_id: loser.id,
      })

      if (eloError) throw eloError

      const { error: voteError } = await supabase.from('votes').insert([
        {
          winner_id: winner.id,
          loser_id: loser.id,
        },
      ])

      if (voteError) throw voteError

      await Promise.all([fetchItems(), fetchTotalVotes()])
      toast.success('Rankings updated!')
    } catch (error) {
      console.error('Error updating scores:', error)
      toast.error('Failed to update rankings')
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <LoaderPinwheel className="w-4 h-4 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Complete Bucket List */}
      <div>
        <ol className="list-decimal my-8">
          {items
            .sort((a, b) =>
              a.completed === b.completed ? 0 : a.completed ? 1 : -1
            )
            .map((item) => (
              <li key={item.id} className="text-sm my-2 list-inside ml-4 group">
                <span
                  className={item.completed ? 'line-through opacity-50' : ''}>
                  {item.title}
                </span>
                {!item.completed && (
                  <span className="text-sm ml-2 opacity-0 group-hover:opacity-50 transition-opacity select-none">
                    (ELO: {item.elo_score})
                  </span>
                )}
              </li>
            ))}
        </ol>
      </div>

      {/* Ranking System */}
      <div>
        <h2 className="mb-4">
          Which should Tomas prioritize?
          <span className="text-xs opacity-50 ml-2 select-none">
            Total votes: {totalVotes}
          </span>
        </h2>
        {!currentPair ? (
          <div className="text-center py-8 text-muted-foreground">
            No more items to compare!
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
              <Button
                variant="outline"
                className="h-32 p-4"
                onClick={() => handleChoice(currentPair[0], currentPair[1])}
                disabled={isUpdating}>
                {isUpdating ? 'Updating...' : currentPair[0].title}
              </Button>
              <Button
                variant="outline"
                className="h-32 p-4"
                onClick={() => handleChoice(currentPair[1], currentPair[0])}
                disabled={isUpdating}>
                {isUpdating ? 'Updating...' : currentPair[1].title}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
