'use client'

const EmailLink = () => {
  // Obfuscated to avoid scrapers - decoded client-side
  const obfuscatedEmail = [
    116, 111, 109, 97, 115, 64, 116, 111, 109, 97, 115, 109, 97, 105, 108, 108,
    111, 46, 99, 111, 109,
  ]

  const decodeEmail = (encodedArray: number[]) => {
    return String.fromCharCode(...encodedArray)
  }

  const email = decodeEmail(obfuscatedEmail)

  return (
    <a href={`mailto:${email}`} className="underline text-sm">
      {email}
    </a>
  )
}

export default EmailLink
