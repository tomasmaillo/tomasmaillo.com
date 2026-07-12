import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../ui/carousel'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import ExternalLink, { getExternalLinkProps } from '../ExternalLink'

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
      // TODO: Add placeholder
      // placeholder="blur"
      // blurDataURL={src}
    />
  )
}

export const CarouselVideo = ({
  src,
  addPadding,
}: {
  src: string
  addPadding?: boolean
}) => {
  return (
    <video
      className={cn(
        'object-cover w-full h-full bg-card rounded-lg overflow-hidden',
        addPadding && 'p-2',
      )}
      src={src}
      autoPlay
      loop
      muted
      playsInline
    />
  )
}

const ProjectTitle = ({
  children,
  link,
  externalLink,
}: {
  children: React.ReactNode
  link?: string
  externalLink?: string
}) => {
  return (
    <div className="flex items-center gap-2 mt-12 mb-2 align-baseline justify-between">
      <h2 className="m-0">
        {children}
        {externalLink && (
          <ExternalLink
            href={externalLink}
            target="_blank"
            rel="noopener"
            className="text-accent text-sm hover:underline ml-2">
            ↗
          </ExternalLink>
        )}
      </h2>
      {link && (
        <Link href={link} className="text-accent text-sm hover:underline">
          ...more
        </Link>
      )}
    </div>
  )
}

const ProjectDescription = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-muted text-sm mb-2">{children}</p>
}

export const Projects = () => {
  return (
    <div>
      <ProjectTitle link="/vibe-check">Vibe-Check</ProjectTitle>
      <ProjectDescription>
        Platform to increase lecture engagement through real-time audience
        interaction and data visualisation. Worked alongside UoEdinburgh
        lecturers to trial the system in lectures.
      </ProjectDescription>
      <Carousel>
        <CarouselContent>
          <CarouselItem>
            <CarouselImage
              src="/vc-phone.png"
              alt="Vibe-Check audience interface displayed in a phone frame"
              priority
            />
          </CarouselItem>
          <CarouselItem>
            <CarouselImage
              src="/vc-browser.png"
              alt="Vibe-Check presenter dashboard with live audience reactions"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <ProjectTitle externalLink="https://projectshare.comp-soc.com">
        Project Share
      </ProjectTitle>
      <ProjectDescription>
        Founded UoEdinburgh&apos;s Project Share society, gathering a subset of
        the most talented and proactive tech students of the Uni to hold regular
        meetups and share updates on personal tech projects.
      </ProjectDescription>
      <Carousel>
        <CarouselContent>
          <CarouselItem>
            <CarouselImage
              src="/ps-browser.png"
              alt="Project Share website homepage showing upcoming student meetups"
            />
          </CarouselItem>
          <CarouselItem>
            <CarouselImage
              src="/ps-browser-2.png"
              alt="Project Share website page highlighting student projects"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <ProjectTitle link="/zephyr-fan-app">Fan</ProjectTitle>
      <ProjectDescription>
        Developed a smart fan prototype with computer vision capabilities. The
        fan tracks users and responds to hand gestures for control.
        Additionally, created a companion app for remote fan operation and data
        monitoring.
      </ProjectDescription>
      <Carousel>
        <CarouselContent>
          <CarouselItem>
            <CarouselImage
              addPadding
              src="/zf-phone.png"
              alt="Zephyr Fan mobile app controls displayed in a phone frame"
            />
          </CarouselItem>
          <CarouselItem>
            <CarouselVideo src="/zf-video.mp4" />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="flex flex-col items-center mt-12">
        <p className="text-muted text-xs text-center">
          ...and many, many more projects still to be listed.
        </p>
        <p className="text-muted text-xs text-center">
          In the meantime, check my archive of
        </p>
        <Link
          className="text-accent px-4 py-2 text-center mt-6 hover:underline"
          target="_blank"
          href="https://tomasmaillo.notion.site/Everything-I-ve-ever-made-3d0e512ce6f24e6498604f2a772b4c8d"
          {...getExternalLinkProps(
            'https://tomasmaillo.notion.site/Everything-I-ve-ever-made-3d0e512ce6f24e6498604f2a772b4c8d'
          )}>
          Everything I&apos;ve ever built ↗
        </Link>
      </div>
    </div>
  )
}
