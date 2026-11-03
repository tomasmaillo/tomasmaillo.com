import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
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
  description,
  date,
}: {
  children: React.ReactNode
  footer: React.ReactNode
  description: string
  date?: string
}) => (
  <div role="listitem" className="relative flex w-full flex-col">
    <div className="w-full min-w-0">
      <div className="flex h-80 w-full items-center justify-center overflow-hidden rounded-lg bg-card">
        {children}
      </div>
    </div>
    <div className="pt-4 pb-4 xl:pt-0 xl:absolute xl:left-full xl:top-1/2 xl:ml-8 xl:w-56 xl:-translate-y-1/2">
      <div className="mb-2 text-xs text-muted">{footer}</div>
      <p className="text-sm leading-relaxed text-muted">{description}</p>
      {date && <p className="mt-2 text-xs text-muted">{date}</p>}
    </div>
  </div>
)

export const Projects = () => {
  return (
    <div
      aria-label="Selected projects"
      role="region"
      className="w-full">
      <div
        role="list"
        className="flex flex-col gap-4">
        <CarouselSlide
          footer="Software engineer at Stripe"
          date="2025–present"
          description="Helping increase the GDP of the internet, working on Stripe Treasury.">
          <Image
            src="/experience/stripe-carousel.webp"
            alt="Stripe logo on a colourful gradient"
            width={1363}
            height={767}
            className="h-full w-full object-cover"
            unoptimized
            draggable={false}
          />
        </CarouselSlide>
        <CarouselSlide
          description="A living screen for the home, displaying a collection of animations."
          footer={
            <ExternalLink
              href="https://raster.tomasmaillo.com"
              target="_blank"
              rel="noopener"
              className="border-b border-dotted border-accent text-foreground !no-underline">
              Raster ↗
            </ExternalLink>
          }>
          <div className="flex h-full w-full justify-center bg-[#e0e0e0]">
            <CarouselVideo
              src="/raster-flower.mp4"
              className="w-auto max-w-full scale-[1.2] rounded-none bg-transparent object-contain [mask-image:linear-gradient(to_right,transparent,black_30%,black_70%,transparent)]"
            />
          </div>
        </CarouselSlide>
        <CarouselSlide
          description="A personal log of Apple locations, with social features for sharing visits."
          footer={
            <ExternalLink
              href="https://store-log.tomasmaillo.com"
              target="_blank"
              rel="noopener"
              className="border-b border-dotted border-accent text-foreground !no-underline">
              iLog ↗
            </ExternalLink>
          }>
          <div className="flex h-full w-full items-center justify-evenly gap-2 p-4">
            {[
              { src: '/store-log/welcome.webp', alt: 'iLog welcome screen' },
              { src: '/store-log/profile.webp', alt: 'iLog profile' },
              { src: '/store-log/leaderboard.webp', alt: 'iLog leaderboard' },
            ].map(({ src, alt }) => (
              <Image
                key={src}
                src={src}
                alt={alt}
                width={700}
                height={1436}
                className="min-w-0 h-full w-1/3 object-contain"
                draggable={false}
              />
            ))}
          </div>
        </CarouselSlide>
        <CarouselSlide
          description="A fan that uses AI vision to respond to its surroundings."
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
        <CarouselSlide footer="Engineering intern at Spotify" description="Worked on finance and royalties at Spotify.">
          <Image
            className="h-10 w-10"
            src="/experience/spotify.svg"
            alt="Spotify"
            width={40}
            height={40}
            draggable={false}
          />
        </CarouselSlide>
        <CarouselSlide
          description="A community for student builders to share projects and meet one another."
          footer={
            <ExternalLink
                href="https://projectshare.comp-soc.com"
                target="_blank"
                rel="noopener"
                className="border-b border-dotted border-accent text-foreground !no-underline">
              Project Share ↗
            </ExternalLink>
          }>
          <CarouselImage
            src="/ps-browser.webp"
            alt="Project Share website homepage showing upcoming student meetups"
            className="rounded-none"
          />
        </CarouselSlide>
        <CarouselSlide
          description="A tool for gathering audience feedback during lectures."
          footer={
            <Link
              href="/vibe-check"
              className="border-b border-dotted border-accent text-foreground !no-underline">
              vibe-check
            </Link>
          }>
          <CarouselImage
            src="/vc-phone.png"
            alt="Vibe-Check audience interface displayed in a phone frame"
            priority
            className="rounded-none"
          />
        </CarouselSlide>
        <CarouselSlide
          description="A raytracer built in C++ to explore light, materials and rendering."
          footer={
            <>
              C++ raytracer ·&nbsp;
              <Link
                href="/raytracer"
                className="border-b border-dotted border-accent text-foreground !no-underline">
                Write-up
              </Link>
            </>
          }>
          <CarouselVideo
            src="/raytracer/glass-sphere-loop.mp4"
            className="rounded-none"
          />
        </CarouselSlide>
      </div>
    </div>
  )
}
