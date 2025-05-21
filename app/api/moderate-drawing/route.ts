import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabase } from '@/lib/supabase'
import { sendPushoverNotification } from '@/lib/pushover'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Function to verify Turnstile token
async function verifyTurnstileToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
          response: token,
        }),
      }
    )

    const data = await response.json()
    console.log('Turnstile response:', data)
    return data.success === true
  } catch (error) {
    console.error('Error verifying Turnstile token:', error)
    return false
  }
}

export async function POST(req: Request) {
  try {
    const { imageData, authorName, message, turnstileToken } = await req.json()

    // Verify Turnstile token
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Security check token is required' },
        { status: 400 }
      )
    }

    const isValidToken = await verifyTurnstileToken(turnstileToken)
    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Invalid security check token' },
        { status: 400 }
      )
    }

    // 1. Upload the drawing to Supabase Storage
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '')
    const blob = Buffer.from(base64Data, 'base64')
    const filename = `drawing-${Date.now()}.png`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('drawings')
      .upload(filename, blob, {
        contentType: 'image/png',
        upsert: false,
      })

    if (uploadError) throw uploadError

    // 2. Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('drawings').getPublicUrl(filename)

    // 3. Save initial record to database
    const { data: drawingData, error: dbError } = await supabase
      .from('drawings')
      .insert([
        {
          image_url: publicUrl,
          is_flagged: false,
          reviewed: false,
          author_name: authorName || 'anonymous',
          message: message || '',
        },
      ])
      .select()

    if (dbError) throw dbError

    // 4. Moderate the drawing, author name, and message
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a strict content moderator for a drawing application. 
              Your task is to analyze the provided image, author name, and message to REJECT any offensive, inappropriate, or harmful content.
              
              STRICTLY REJECT content containing:
              - Sexual content of any kind (genitalia, nudity, suggestive imagery, penises, vaginas, etc.)
              - Weapons (guns, knives, bombs, etc.)
              - Violence or gore (blood, injuries, fighting)
              - Offensive gestures (middle fingers, etc.)
              - Hate symbols or discriminatory content
              - Profanity or offensive language
              - Drug or alcohol references
              - Any content inappropriate for children
              
              First, provide a detailed explanation of what you see in the image, author name, and message.
              Then, end your response with either APPROVED or REJECTED as the last word. YOU MUST END WITH EITHER APPROVED OR REJECTED.
              
              Be direct, thorough, and err on the side of caution when moderating.
              
              Author name: "${authorName || 'anonymous'}"
              Message: "${message || ''}"`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageData}`,
              },
            },
          ],
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    })

    const assessment = completion.choices[0].message.content || ''

    // Check if the last word is APPROVED or REJECTED
    const words = assessment.trim().split(/\s+/)
    const lastWord = words[words.length - 1]
    const isApproved = lastWord === 'APPROVED'

    // Pretty console logging without chalk
    console.log('\n==========================================')
    console.log('📝 Assessment:')
    console.log(assessment)
    console.log('------------------------------------------')
    console.log('🔍 Decision: ' + (isApproved ? 'APPROVED' : 'REJECTED'))
    console.log('🖼️ Image URL: ' + publicUrl)
    console.log('👤 Author: ' + (authorName || 'anonymous'))
    console.log('💬 Message: ' + (message || 'none'))
    console.log('==========================================\n')

    // 5. Update the drawing record with moderation results
    const { error: updateError } = await supabase
      .from('drawings')
      .update({
        is_flagged: !isApproved,
        reviewed: true,
      })
      .eq('id', drawingData[0].id)

    if (updateError) throw updateError

    // 6. Send Pushover notification with the moderation result
    await sendPushoverNotification({
      title: `Drawing ${isApproved ? 'Approved' : 'Rejected'}`,
      message: `Author: ${authorName || 'anonymous'}\nMessage: ${
        message || 'none'
      }\n\nAssessment: ${assessment}`,
      imageUrl: publicUrl,
    })

    return NextResponse.json({
      success: true,
      drawing: {
        ...drawingData[0],
        is_flagged: !isApproved,
        reviewed: true,
      },
      assessment,
      isApproved,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to process drawing' },
      { status: 500 }
    )
  }
}
