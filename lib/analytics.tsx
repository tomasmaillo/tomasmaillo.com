import Script from 'next/script'

export function VercelAnalytics() {
  const isDev = process.env.NODE_ENV === 'development'
  const src = isDev
    ? 'https://va.vercel-scripts.com/v1/script.debug.js'
    : '/api/data/script.js'

  return (
    <>
      <Script id="analytics-config" strategy="afterInteractive">
        {`
          window.va = window.va || function() {
            (window.vaq = window.vaq || []).push(arguments);
          };
        `}
      </Script>
      <Script async data-endpoint="/api/data" src={src} strategy="lazyOnload" />
    </>
  )
}
