import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabase } from '@/lib/supabase'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { imageData, authorName, message } = await req.json()

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

    // 4. Moderate the drawing
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a strict content moderator for a drawing application. 
              Your task is to analyze the provided image and REJECT any offensive, inappropriate, or harmful content.
              
              STRICTLY REJECT drawings containing:
              - Sexual content of any kind (genitalia, nudity, suggestive imagery, penises, vaginas, etc.)
              - Weapons (guns, knives, bombs, etc.)
              - Violence or gore (blood, injuries, fighting)
              - Offensive gestures (middle fingers, etc.)
              - Hate symbols or discriminatory content
              - Profanity or offensive language
              - Drug or alcohol references
              - Any content inappropriate for children
              
              Return your assessment as:
              1. APPROVED: "This drawing appears to be appropriate and safe for all audiences."
              2. REJECTED: "This drawing contains [specific concern]. This content violates our guidelines."
              
              ALSO INCLUDE a brief list of all objects/elements you can identify in the image.
              
              Be direct, thorough, and err on the side of caution when moderating.`,
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
      max_tokens: 150,
    })

    const assessment = completion.choices[0].message.content || ''
    const isApproved =
      assessment.includes('APPROVED') || assessment.includes('appropriate')

    // 5. Update the drawing record with moderation results
    const { error: updateError } = await supabase
      .from('drawings')
      .update({
        is_flagged: !isApproved,
        reviewed: true,
      })
      .eq('id', drawingData[0].id)

    if (updateError) throw updateError

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
