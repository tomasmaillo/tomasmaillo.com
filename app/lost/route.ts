export async function GET() {
  return new Response(
    'If you found this object, please email me at tomas@tomasmaillo.com',
    {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
      },
    },
  )
}
