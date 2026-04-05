'use client'
import { useEffect, useRef, useState } from 'react'

const EmailLink = () => {
  const [copied, setCopied] = useState(false)
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
    }
  }, [])

  // very overkill but fun!
  const obfuscatedEmail = [
    116, 111, 109, 97, 115, 64, 116, 111, 109, 97, 115, 109, 97, 105, 108, 108,
    111, 46, 99, 111, 109,
  ]

  const decodeEmail = (encodedArray: number[]) => {
    return String.fromCharCode(...encodedArray)
  }

  const handleCopy = () => {
    const email = decodeEmail(obfuscatedEmail)
    const textArea = document.createElement('textarea')
    textArea.value = email
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)

    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
    setCopied(true)
    resetTimeoutRef.current = setTimeout(() => {
      setCopied(false)
      resetTimeoutRef.current = null
    }, 1000)
  }

  return (
    <div>
      <a
        onClick={handleCopy}
        className="inline-grid cursor-pointer place-items-start hover:underline">
        <span
          className="invisible col-start-1 row-start-1 select-none"
          aria-hidden>
          Email
        </span>
        <span
          className="invisible col-start-1 row-start-1 select-none"
          aria-hidden>
          Copied!
        </span>
        <span className="col-start-1 row-start-1">
          {copied ? 'Copied!' : 'Email'}
        </span>
      </a>
    </div>
  )
}

export default EmailLink
