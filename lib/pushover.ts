interface PushoverNotificationOptions {
  title: string
  message: string
  imageUrl?: string
  throwOnError?: boolean
}

/**
 * Sends a notification to Pushover with optional image attachment
 */
export async function sendPushoverNotification({
  title,
  message,
  imageUrl,
  throwOnError = false,
}: PushoverNotificationOptions): Promise<void> {
  const pushoverApiUrl = 'https://api.pushover.net/1/messages.json'
  const userKey = process.env.PUSHOVER_USER_KEY
  const appToken = process.env.PUSHOVER_APP_TOKEN

  if (!userKey || !appToken) {
    const error = new Error('Pushover credentials not configured')
    console.error(error.message)
    if (throwOnError) throw error
    return
  }

  try {
    // First, if we have an image URL, we need to download it and convert to base64
    let imageBase64: string | undefined

    if (imageUrl) {
      try {
        const imageResponse = await fetch(imageUrl)
        const arrayBuffer = await imageResponse.arrayBuffer()
        imageBase64 = Buffer.from(arrayBuffer).toString('base64')
      } catch (error) {
        console.error(
          'Failed to download image for Pushover notification:',
          error
        )
        // Continue without the image
      }
    }

    // Prepare the notification payload
    const formData = new FormData()
    formData.append('token', appToken)
    formData.append('user', userKey)
    formData.append('title', title)
    formData.append('message', message)

    // Add image if available
    if (imageBase64) {
      const imageBlob = new Blob([Buffer.from(imageBase64, 'base64')], {
        type: 'image/png',
      })
      formData.append('attachment', imageBlob, 'image.png')
    }

    // Send the notification
    const response = await fetch(pushoverApiUrl, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(
        `Pushover notification failed with HTTP ${response.status}: ${errorData.slice(0, 300)}`,
      )
    } else {
      console.log('Pushover notification sent successfully')
    }
  } catch (error) {
    console.error('Error sending Pushover notification:', error)
    if (throwOnError) throw error
  }
}
