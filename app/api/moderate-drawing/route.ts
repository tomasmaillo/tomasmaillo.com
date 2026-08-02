import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { sendPushoverNotification } from '@/lib/pushover'
import { isPng, PNG_DATA_URL_PREFIX } from '@/lib/png'

const MAX_DRAWING_BYTES = 1024 * 1024
const MAX_AUTHOR_NAME_LENGTH = 32
const MAX_MESSAGE_LENGTH = 200

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const MODERATION_INSTRUCTIONS = `You are a strict content moderator for a public drawing application used by a broad audience, including children.

Review the submitted drawing image, author name, and message. Reject content when any part of the submission includes, implies, depicts, or references:
- Sexual content of any kind, including nudity, genitalia, sexual gestures, or suggestive content.
- Weapons, including guns, knives, bombs, or credible weapon-like threats.
- Violence, gore, blood, injuries, fighting, self-harm, or threats.
- Offensive gestures.
- Hate symbols, discriminatory content, slurs, harassment, or bullying.
- Profanity, offensive language, or sexual language in the author name or message.
- Drug, alcohol, tobacco, or vaping references.
- Anything inappropriate for children.

Err on the side of rejection when the image or text is ambiguous. Base the decision only on visible image content and provided text. Return concise evidence that explains the decision.`

const MODERATION_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    decision: {
      type: 'string',
      enum: ['approved', 'rejected'],
      description: 'Whether the submitted drawing should be shown publicly.',
    },
    imageDescription: {
      type: 'string',
      description:
        'A concise description of the relevant visible image content.',
    },
    textAssessment: {
      type: 'string',
      description: 'Assessment of the author name and message.',
    },
    reasoning: {
      type: 'string',
      description:
        'Free-form moderation reasoning explaining why the submission was approved or rejected.',
    },
  },
  required: ['decision', 'imageDescription', 'textAssessment', 'reasoning'],
  additionalProperties: false,
} as const

type ModerationAssessment = {
  decision: 'approved' | 'rejected'
  imageDescription: string
  textAssessment: string
  reasoning: string
}

function parseModerationAssessment(raw: string): ModerationAssessment {
  const parsed = JSON.parse(raw) as Partial<ModerationAssessment>

  if (parsed.decision !== 'approved' && parsed.decision !== 'rejected') {
    throw new Error('OpenAI response did not include a valid decision')
  }

  if (
    typeof parsed.imageDescription !== 'string' ||
    typeof parsed.textAssessment !== 'string' ||
    typeof parsed.reasoning !== 'string'
  ) {
    throw new Error('OpenAI response did not match moderation schema')
  }

  return {
    decision: parsed.decision,
    imageDescription: parsed.imageDescription.trim(),
    textAssessment: parsed.textAssessment.trim(),
    reasoning: parsed.reasoning.trim(),
  }
}

function formatAssessment(assessment: ModerationAssessment): string {
  return [
    `Decision: ${assessment.decision.toUpperCase()}`,
    `Image: ${assessment.imageDescription}`,
    `Text: ${assessment.textAssessment}`,
    `Reasoning: ${assessment.reasoning}`,
  ].join('\n')
}

function sanitiseAlertText(value: string, maxLength = 500): string {
  return value
    .replace(/\bsk-[A-Za-z0-9_-]+\b/g, '[REDACTED_OPENAI_KEY]')
    .replace(
      /\bsb_(?:secret|publishable)_[A-Za-z0-9_-]+\b/g,
      '[REDACTED_SUPABASE_KEY]',
    )
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

function describeError(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return sanitiseAlertText(String(error))
  }

  const errorDetails = error as Record<string, unknown>
  const details = [
    errorDetails.name,
    errorDetails.status && `HTTP ${errorDetails.status}`,
    errorDetails.code && `code ${errorDetails.code}`,
    errorDetails.type && `type ${errorDetails.type}`,
    errorDetails.message,
  ].filter((value): value is string => typeof value === 'string' && !!value)

  return sanitiseAlertText(details.join(' — ') || 'Unknown error')
}

async function sendDrawingErrorAlert({
  stage,
  error,
  authorName,
  message,
}: {
  stage: string
  error: unknown
  authorName: string
  message: string
}) {
  await sendPushoverNotification({
    title: 'Drawing submission error',
    message: [
      `Stage: ${sanitiseAlertText(stage, 100)}`,
      `Error: ${describeError(error)}`,
      `Author: ${sanitiseAlertText(authorName, MAX_AUTHOR_NAME_LENGTH)}`,
      `Message: ${sanitiseAlertText(message || 'none', MAX_MESSAGE_LENGTH)}`,
      `Environment: ${process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown'}`,
    ].join('\n'),
  })
}

async function sendDrawingOutcomeNotification({
  title,
  notificationMessage,
  imageUrl,
  stage,
  authorName,
  submittedMessage,
}: {
  title: string
  notificationMessage: string
  imageUrl?: string
  stage: string
  authorName: string
  submittedMessage: string
}) {
  try {
    await sendPushoverNotification({
      title,
      message: notificationMessage,
      imageUrl,
      throwOnError: true,
    })
  } catch (error) {
    console.error(`Drawing notification failed during ${stage}:`, error)
    await sendDrawingErrorAlert({
      stage,
      error,
      authorName,
      message: submittedMessage,
    })
  }
}

// Function to verify Turnstile token
async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY

  if (!secret) {
    throw new Error('Cloudflare Turnstile secret is not configured')
  }

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret,
        response: token,
      }),
    },
  )

  if (!response.ok) {
    throw new Error(
      `Turnstile verification request failed with HTTP ${response.status}`,
    )
  }

  const data = (await response.json()) as {
    success?: unknown
    'error-codes'?: unknown
  }
  if (typeof data.success !== 'boolean') {
    throw new Error('Turnstile returned an invalid verification response')
  }

  if (!data.success) {
    const errorCodes = Array.isArray(data['error-codes'])
      ? data['error-codes'].filter(
          (value): value is string => typeof value === 'string',
        )
      : []
    const expectedTokenErrors = new Set([
      'missing-input-response',
      'invalid-input-response',
      'timeout-or-duplicate',
    ])
    const operationalErrors = errorCodes.filter(
      (code) => !expectedTokenErrors.has(code),
    )

    if (operationalErrors.length > 0 || errorCodes.length === 0) {
      throw new Error(
        `Turnstile verification failed: ${operationalErrors.join(', ') || 'unknown error'}`,
      )
    }
  }

  return data.success
}

export async function POST(req: Request) {
  let stage = 'reading submission'
  let submittedAuthorName = 'anonymous'
  let submittedMessage = ''

  try {
    const { imageData, authorName, message, turnstileToken } = await req.json()
    submittedAuthorName =
      typeof authorName === 'string' && authorName.trim()
        ? authorName.trim().slice(0, MAX_AUTHOR_NAME_LENGTH)
        : 'anonymous'
    submittedMessage =
      typeof message === 'string'
        ? message.trim().slice(0, MAX_MESSAGE_LENGTH)
        : ''

    if (
      typeof imageData !== 'string' ||
      !imageData.startsWith(PNG_DATA_URL_PREFIX)
    ) {
      return NextResponse.json(
        { error: 'A PNG drawing is required' },
        { status: 400 },
      )
    }

    // Verify Turnstile token
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Security check token is required' },
        { status: 400 },
      )
    }

    stage = 'verifying security check'
    const isValidToken = await verifyTurnstileToken(turnstileToken)
    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Invalid security check token' },
        { status: 400 },
      )
    }

    const base64Data = imageData.slice(PNG_DATA_URL_PREFIX.length)
    const blob = Buffer.from(base64Data, 'base64')
    if (!isPng(blob) || blob.length > MAX_DRAWING_BYTES) {
      return NextResponse.json(
        { error: 'Drawing must be a PNG smaller than 1 MB' },
        { status: 400 },
      )
    }

    const imageDataUrl = `data:image/png;base64,${base64Data}`

    // Moderate before uploading so rejected submissions never become public.
    stage = 'moderating drawing with OpenAI'
    const response = await openai.responses.create({
      model: process.env.MODERATE_DRAWING_OPENAI_MODEL || 'gpt-5.4-mini',
      reasoning: { effort: 'low' },
      instructions: MODERATION_INSTRUCTIONS,
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: JSON.stringify({
                authorName: submittedAuthorName,
                message: submittedMessage,
              }),
            },
            {
              type: 'input_image',
              image_url: imageDataUrl,
              detail: 'high',
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'drawing_moderation_response',
          schema: MODERATION_RESPONSE_SCHEMA,
          strict: true,
        },
      },
    } as never)

    const rawAssessment = response.output_text.trim()

    if (!rawAssessment) {
      throw new Error('OpenAI returned an empty moderation response')
    }

    const moderationAssessment = parseModerationAssessment(rawAssessment)
    const assessment = formatAssessment(moderationAssessment)
    const isApproved = moderationAssessment.decision === 'approved'

    if (!isApproved) {
      stage = 'sending rejection notification'
      await sendDrawingOutcomeNotification({
        title: 'Drawing Rejected',
        notificationMessage: `Author: ${submittedAuthorName}\nMessage: ${
          submittedMessage || 'none'
        }\n\nAssessment: ${assessment}`,
        stage,
        authorName: submittedAuthorName,
        submittedMessage,
      })

      return NextResponse.json({
        success: true,
        assessment,
        moderationAssessment,
        isApproved: false,
      })
    }

    stage = 'initialising Supabase'
    const supabase = getSupabaseServerClient()
    const filename = `drawing-${crypto.randomUUID()}.png`
    stage = 'uploading drawing to Supabase Storage'
    const { error: uploadError } = await supabase.storage
      .from('drawings')
      .upload(filename, blob, {
        contentType: 'image/png',
        upsert: false,
      })

    if (uploadError) throw uploadError

    const {
      data: { publicUrl },
    } = supabase.storage.from('drawings').getPublicUrl(filename)

    stage = 'saving drawing record to Supabase'
    const { data: drawingData, error: dbError } = await supabase
      .from('drawings')
      .insert([
        {
          image_url: publicUrl,
          is_flagged: false,
          reviewed: true,
          author_name: submittedAuthorName,
          message: submittedMessage,
        },
      ])
      .select()
      .single()

    if (dbError) {
      const { error: cleanupError } = await supabase.storage
        .from('drawings')
        .remove([filename])

      if (cleanupError) {
        throw new Error(
          `Database insert failed: ${describeError(dbError)}. Uploaded file cleanup also failed: ${describeError(cleanupError)}`,
        )
      }

      throw dbError
    }

    // Pretty console logging without chalk
    console.log('\n==========================================')
    console.log('📝 Assessment:')
    console.log(assessment)
    console.log('------------------------------------------')
    console.log('🔍 Decision: ' + (isApproved ? 'APPROVED' : 'REJECTED'))
    console.log('🖼️ Image URL: ' + publicUrl)
    console.log('👤 Author: ' + submittedAuthorName)
    console.log('💬 Message: ' + (submittedMessage || 'none'))
    console.log('==========================================\n')

    stage = 'sending approval notification'
    await sendDrawingOutcomeNotification({
      title: 'Drawing Approved',
      notificationMessage: `Author: ${submittedAuthorName}\nMessage: ${
        submittedMessage || 'none'
      }\n\nAssessment: ${assessment}`,
      imageUrl: publicUrl,
      stage,
      authorName: submittedAuthorName,
      submittedMessage,
    })

    return NextResponse.json({
      success: true,
      drawing: drawingData,
      assessment,
      moderationAssessment,
      isApproved: true,
    })
  } catch (error) {
    console.error(`Drawing submission failed during ${stage}:`, error)
    await sendDrawingErrorAlert({
      stage,
      error,
      authorName: submittedAuthorName,
      message: submittedMessage,
    })

    return NextResponse.json(
      { error: 'Failed to process drawing' },
      { status: 500 },
    )
  }
}
