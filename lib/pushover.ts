interface PushoverNotificationOptions {
  title: string
  message: string
  imageUrl?: string
}

/**
 * Sends a notification to Pushover with optional image attachment
 */
export async function sendPushoverNotification({
  title,
  message,
  imageUrl,
}: PushoverNotificationOptions): Promise<void> {
  const pushoverApiUrl = 'https://api.pushover.net/1/messages.json'
  const userKey = process.env.PUSHOVER_USER_KEY
  const appToken = process.env.PUSHOVER_APP_TOKEN

  if (!userKey || !appToken) {
    console.error('Pushover credentials not configured')
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
      const errorData = await response.json()
      console.error('Pushover notification failed:', errorData)
    } else {
      console.log('Pushover notification sent successfully')
    }
  } catch (error) {
    console.error('Error sending Pushover notification:', error)
  }
}
