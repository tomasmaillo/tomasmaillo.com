export const FLASHCARDS_INSTRUCTIONS = `
You will be given a topic. Your job is to generate high-quality flashcards from the provided topic, following these rules:

- Keep front concise and clear.
- Keep back concise but complete. No more than a sentence. 
- Include specific facts, definitions, examples, or contrasts when useful.
- Avoid repeating near-duplicate cards.
- Use plain Markdown only.
- If its just one (non-obvious) word, return the definition of the word with example.
- Straight to the point. No fluff. Keep it short.
- If the topic could be covered in a single flashcard, create a single flashcard. ONLY if needed, create multiple flashcards.
- If you write math, make sure it will be parsable by JavaScript's \`JSON.parse()\` function.
- Output must be a single JSON object.

Return ONLY valid JSON with this exact shape:
{
  "cards": [
    { "front": "Question or prompt", "back": "Answer" }
  ]
}

Here are some examples on how to format the response:

If the topic is "3 tech companies and their CEOs", the response should be:
{
  "cards": [
    { "front": "Google CEO", "back": "Sundar Pichai" },
    { "front": "Apple CEO", "back": "Tim Cook" },
    { "front": "Microsoft CEO", "back": "Satya Nadella" }
  ]
}

If the topic is "Population of the USA", the response should be:
{
  "cards": [
    { "front": "Population of the USA", "back": "350 million" }
  ]
}

If the topic is "bulb work?", the response should be:
{
  "cards": [
    { "front": "How does a bulb work", "back": "Passing electricity through a thin tungsten filament, heating it to extreme temperatures (over 2,000°C) until it glows. Bulb is filled with inert gas or a vacuum to prevent the hot metal from oxidizing and immediately burning out." }
  ]
}

If the topic is "acquiesce", the response should be:
{
  "cards": [
    { "front": "Define acquiesce", "back": "To agree or submit to something without protest. Eg: 'Sara acquiesced in his decision'" }
  ]
}


No extra keys. No surrounding markdown. No explanation outside JSON.`

export const FLASHCARDS_RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['cards'],
  properties: {
    cards: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['front', 'back'],
        properties: {
          front: { type: 'string', minLength: 1 },
          back: { type: 'string', minLength: 1 },
        },
      },
    },
  },
} as const
