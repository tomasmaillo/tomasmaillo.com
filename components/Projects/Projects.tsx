import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import StripeIcon from '@/public/experience/stripe.svg'
import ExternalLink from '../ExternalLink'

export const CarouselImage = ({
  src,
  alt,
  addPadding,
  priority,
  className,
}: {
  src: string
  alt: string
  addPadding?: boolean
  priority?: boolean
  className?: string
}) => {
  return (
    <Image
      className={cn(
        'object-contain w-full h-full bg-card rounded-lg',
        addPadding && 'p-2',
        className
      )}
      src={src}
      alt={alt}
      width={500}
      height={500}
      priority={priority}
      draggable={false}
      // TODO: Add placeholder
      // placeholder="blur"
      // blurDataURL={src}
    />
  )
}

export const CarouselVideo = ({
  src,
  addPadding,
  className,
}: {
  src: string
  addPadding?: boolean
  className?: string
}) => {
  return (
    <video
      className={cn(
        'object-cover w-full h-full bg-card rounded-lg overflow-hidden',
        addPadding && 'p-2',
        className,
      )}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      draggable={false}
    />
  )
}

const CarouselSlide = ({
  children,
  footer,
}: {
  children: React.ReactNode
  footer: React.ReactNode
}) => (
  <div
    role="listitem"
    className="flex w-[calc(100vw-3.5rem)] shrink-0 flex-col md:w-[34rem]">
    <div className="flex h-80 w-full items-center justify-center overflow-hidden rounded-lg bg-card">
      {children}
    </div>
    <div className="relative h-11 pr-3 text-xs text-muted">
      <div className="sticky left-4 flex h-full w-fit max-w-[calc(100%-1.75rem)] items-center whitespace-nowrap">
        {footer}
      </div>
    </div>
  </div>
)

export const Projects = () => {
  return (
    <div
      aria-label="Selected projects"
      role="region"
      className="relative left-1/2 w-screen -translate-x-1/2 select-none overflow-x-auto no-scrollbar overscroll-x-none">
      <div
        role="list"
        className="flex gap-4 px-4 md:px-[max(1rem,calc((100vw-34rem)/2))]">
        <CarouselSlide footer="Software engineer at Stripe · 2025–present">
          <StripeIcon
            aria-label="Stripe"
            className="stripe-carousel-logo h-10 w-10"
            draggable={false}
            viewBox="0 0 512 512"
          />
        </CarouselSlide>
        <CarouselSlide
          footer={
            <>
              AI fan prototype ·&nbsp;
              <Link
                href="/zephyr-fan-app"
                className="border-b border-dotted border-accent text-foreground !no-underline">
                Write-up
              </Link>
            </>
          }>
          <CarouselVideo src="/zf-video.mp4" className="rounded-none" />
        </CarouselSlide>
        <CarouselSlide footer="Engineering intern at Spotify · Summer 2022">
          <Image
            className="spotify-carousel-logo h-10 w-10"
            src="/experience/spotify.svg"
            alt="Spotify"
            width={40}
            height={40}
            draggable={false}
          />
        </CarouselSlide>
        <CarouselSlide
          footer={
            <>
              Student builder community ·&nbsp;
              <ExternalLink
                href="https://projectshare.comp-soc.com"
                target="_blank"
                rel="noopener"
                className="border-b border-dotted border-accent text-foreground !no-underline">
                Visit site ↗
              </ExternalLink>
            </>
          }>
          <CarouselImage
            src="/ps-browser.png"
            alt="Project Share website homepage showing upcoming student meetups"
            className="rounded-none"
          />
        </CarouselSlide>
        <CarouselSlide
          footer={
            <>
              Live lecture engagement ·&nbsp;
              <Link
                href="/vibe-check"
                className="border-b border-dotted border-accent text-foreground !no-underline">
                Write-up
              </Link>
            </>
          }>
          <CarouselImage
            src="/vc-phone.png"
            alt="Vibe-Check audience interface displayed in a phone frame"
            priority
            className="rounded-none"
          />
        </CarouselSlide>
        <CarouselSlide footer="C++ raytracer">
          <CarouselImage
            src="/orbital-playground.webp"
            alt="Colourful geometric shapes rendered with a raytracer"
            className="rounded-none object-cover"
          />
        </CarouselSlide>
        <div
          aria-hidden="true"
          className="w-0 shrink-0 md:w-[max(0px,calc((100vw-34rem)/2-1rem))]"
        />
      </div>
    </div>
  )
}
