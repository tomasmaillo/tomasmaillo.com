'use client'
import { toast } from 'sonner'

const EmailLink = () => {
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

    toast('Email copied', {
      duration: 1000,
      richColors: true,
      icon: '📋',
    })
  }

  return (
    <div>
      <a onClick={handleCopy} className="hover:opacity-90 cursor-pointer active:scale-95">
        Reach me
      </a>
    </div>
  )
}

export default EmailLink
