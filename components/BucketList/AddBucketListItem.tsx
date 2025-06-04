'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { LoaderPinwheel, Infinity as InfinityIcon } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import AvatarSelector from './AvatarSelector'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

const DEBOUNCE_DELAY = 1000 // 1 second delay
const MIN_CHARS_FOR_ESTIMATE = 3 // Minimum characters before estimating

const PLACEHOLDER_ITEMS = [
  'Run a marathon',
  'Go skydiving',
  'Learn to surf',
  'Visit Japan',
  'Learn to play guitar',
  'Write a book',
  'Learn a new language',
  'Start a business',
  'Learn to cook',
  'Travel the world',
]

export default function AddBucketListItem() {
  const [itemTitle, setItemTitle] = useState('')
  const [estimatedValue, setEstimatedValue] = useState<
    number | 'Infinity' | null
  >(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isEstimating, setIsEstimating] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [placeholderText, setPlaceholderText] = useState('')
  const [hasEstimateForCurrentInput, setHasEstimateForCurrentInput] =
    useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  // Animate placeholder text
  useEffect(() => {
    const currentItem = PLACEHOLDER_ITEMS[placeholderIndex]
    let currentText = ''
    let currentIndex = 0

    const typeInterval = setInterval(() => {
      if (currentIndex < currentItem.length) {
        currentText += currentItem[currentIndex]
        setPlaceholderText(currentText)
        currentIndex++
      } else {
        clearInterval(typeInterval)

        // Wait before starting to delete
        setTimeout(() => {
          const deleteInterval = setInterval(() => {
            if (currentText.length > 0) {
              currentText = currentText.slice(0, -1)
              setPlaceholderText(currentText)
            } else {
              clearInterval(deleteInterval)
              setPlaceholderIndex(
                (prev) => (prev + 1) % PLACEHOLDER_ITEMS.length
              )
            }
          }, 50)
        }, 2000) // Wait 2 seconds before starting to delete
      }
    }, 100)

    return () => clearInterval(typeInterval)
  }, [placeholderIndex])

  const estimateValue = useCallback(async () => {
    if (!itemTitle.trim() || itemTitle.length < MIN_CHARS_FOR_ESTIMATE) {
      setEstimatedValue(null)
      setHasEstimateForCurrentInput(false)
      return
    }

    setIsEstimating(true)
    try {
      const response = await fetch('/api/estimate-cost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item: itemTitle }),
      })

      if (!response.ok) {
        throw new Error('Failed to estimate value')
      }

      const data = await response.json()
      setEstimatedValue(data.estimatedCost)
      setHasEstimateForCurrentInput(true)
    } catch (error) {
      console.error('Error estimating value:', error)
      toast.error('Failed to estimate value')
      setHasEstimateForCurrentInput(false)
    } finally {
      setIsEstimating(false)
    }
  }, [itemTitle])

  // Reset estimate flag when input changes
  useEffect(() => {
    setHasEstimateForCurrentInput(false)
  }, [itemTitle])

  // Debounced effect for auto-estimation
  useEffect(() => {
    const timer = setTimeout(() => {
      estimateValue()
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [itemTitle, estimateValue])

  const handleSubmit = async () => {
    if (!itemTitle.trim() || !estimatedValue) {
      toast.error('Please enter an item and wait for value estimation')
      return
    }

    if (estimatedValue === 'Infinity') {
      toast.error('This item cannot be added to the bucket list')
      return
    }

    setIsLoading(true)
    try {
      // Format the suggested-by URL based on the unavatar.io URL
      let suggestedByUrl = ''
      if (avatarUrl) {
        // Extract platform and username from unavatar.io URL
        const match = avatarUrl.match(/unavatar\.io\/([^/]+)\/([^/]+)/)
        if (match) {
          const [, platform, username] = match
          switch (platform) {
            case 'github':
              suggestedByUrl = `https://github.com/${username}`
              break
            case 'twitter':
              suggestedByUrl = `https://twitter.com/${username}`
              break
            case 'twitch':
              suggestedByUrl = `https://twitch.tv/${username}`
              break
          }
        }
      }

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-suggested-by': suggestedByUrl,
          'x-suggested-by-avatar': avatarUrl || '',
        },
        body: JSON.stringify({
          itemTitle,
          amount: estimatedValue,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to process payment')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder={placeholderText}
          value={itemTitle}
          onChange={(e) => setItemTitle(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-muted-foreground">Added by</span>
        <AvatarSelector onAvatarChange={setAvatarUrl} />
      </div>

      <div className="space-y-2">
        <Button
          onClick={handleSubmit}
          disabled={
            isLoading ||
            isEstimating ||
            !itemTitle.trim() ||
            !hasEstimateForCurrentInput
          }
          className="w-full">
          {isLoading ? (
            'Adding...'
          ) : isEstimating ? (
            <div className="flex items-center gap-2">
              <LoaderPinwheel className="w-4 h-4 animate-spin" />
              Add to list
            </div>
          ) : estimatedValue === 'Infinity' ? (
            <div className="flex items-center gap-2">
              Add to list for <InfinityIcon className="w-4 h-4" />
            </div>
          ) : estimatedValue && hasEstimateForCurrentInput ? (
            `Add to list for $${estimatedValue.toLocaleString()}`
          ) : (
            'Add to list'
          )}
        </Button>

        {estimatedValue && hasEstimateForCurrentInput && (
          <Button
            variant="link"
            className="w-full text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setShowDisclaimer(true)}>
            By proceeding, you agree to the terms and conditions
          </Button>
        )}
      </div>

      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disclaimer</DialogTitle>
            <DialogDescription className="space-y-4">
              <p className="mt-4">
                By proceeding with this purchase, you acknowledge and agree to
                the following terms:
              </p>
              <ul className="list-disc pl-4 space-y-2">
                <li>
                  This purchase is intended to add the item{' '}
                  <code>{`"${itemTitle}"`}</code> to the bucket list and
                  contribute towards achieving this goal.
                </li>
                <li>
                  There is no guarantee of completion or success in achieving
                  the listed item, but I will be trying my hardest. The funds
                  will be used towards the goal, but may not cover the full cost
                  of completion.
                </li>
                <li>
                  We reserve the right to remove or modify any content from the
                  bucket list at any time.
                </li>
                <li>All purchases are final and non-refundable.</li>
                <li>
                  If you included your username, it will be displayed along with
                  the bucket list item.
                </li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisclaimer(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
