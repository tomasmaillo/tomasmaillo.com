import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../ui/carousel'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const CarouselImage = ({
  src,
  alt,
  addPadding,
}: {
  src: string
  alt: string
  addPadding?: boolean
}) => {
  return (
    <Image
      className={cn(
        'object-contain w-full h-full bg-zinc-50 rounded-lg',
        addPadding && 'p-2'
      )}
      src={src}
      alt={alt}
      width={500}
      height={500}
      // TODO: Add placeholder
      // placeholder="blur"
      // blurDataURL={src}
    />
  )
}

const CarouselVideo = ({
  src,
  addPadding,
}: {
  src: string
  addPadding?: boolean
}) => {
  return (
    <video
      className={cn(
        'object-cover w-full h-full bg-zinc-50 rounded-lg overflow-hidden',
        addPadding && 'p-2'
      )}
      src={src}
      autoPlay
      loop
      muted
      playsInline
    />
  )
}

const ProjectTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="mt-12 mb-2">{children}</h2>
}

const ProjectDescription = ({ children }: { children: React.ReactNode }) => {
  return <p className="opacity-70 text-sm mb-2">{children}</p>
}

const ProjectTech = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap gap-x-3 mt-2 justify-center items-center">
    {children}
  </div>
)

const ProjectTechItem = ({ children }: { children: React.ReactNode }) => {
  return <span className="opacity-70 text-xs mb-2">{children}</span>
}

const Projects = () => {
  return (
    <div className="mt-32">
      <ProjectTitle>Vibe-Check</ProjectTitle>
      <ProjectDescription>
        Platform to increase lecture engagement through real-time audience
        interaction and data visualization. Worked alongside UoEdinburgh
        lecturers to trial the system in lectures.
      </ProjectDescription>
      <Carousel>
        <CarouselContent>
          <CarouselItem>
            <CarouselImage src="/vc-phone.png" alt="Project 1" />
          </CarouselItem>
          <CarouselItem>
            <CarouselImage src="/vc-browser.png" alt="Project 2" />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <ProjectTech>
        <ProjectTechItem>Svelte</ProjectTechItem>
        <ProjectTechItem>TypeScript</ProjectTechItem>
        <ProjectTechItem>WebSockets</ProjectTechItem>
        <ProjectTechItem>NodeJS</ProjectTechItem>
        <ProjectTechItem>Chrome-Extension</ProjectTechItem>
      </ProjectTech>

      <ProjectTitle>Project Share</ProjectTitle>
      <ProjectDescription>
        Founded UoEdinburgh&apos;s Project Share society, gathering a subset of
        the most talented and proactive tech students of the Uni to hold regular
        meetups and share updates on personal tech projects.
      </ProjectDescription>
      <Carousel>
        <CarouselContent>
          <CarouselItem>
            <CarouselImage src="/ps-browser.png" alt="Project 1" />
          </CarouselItem>
          <CarouselItem>
            <CarouselImage src="/ps-browser-2.png" alt="Project 2" />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <ProjectTech>
        <ProjectTechItem>ReactJS</ProjectTechItem>
        <ProjectTechItem>TypeScript</ProjectTechItem>
      </ProjectTech>

      <ProjectTitle>Fan</ProjectTitle>
      <ProjectDescription>
        Developed a smart fan prototype with computer vision capabilities. The
        fan tracks users and responds to hand gestures for control.
        Additionally, created a companion app for remote fan operation and data
        monitoring.
      </ProjectDescription>
      <Carousel>
        <CarouselContent>
          <CarouselItem>
            <CarouselImage addPadding src="/zf-phone.png" alt="Project 1" />
          </CarouselItem>
          <CarouselItem>
            <CarouselVideo src="/zf-video.mp4" />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <ProjectTech>
        <ProjectTechItem>React Native</ProjectTechItem>
        <ProjectTechItem>TypeScript</ProjectTechItem>
        <ProjectTechItem>Expo</ProjectTechItem>
        <ProjectTechItem>Flask</ProjectTechItem>
        <ProjectTechItem>Python</ProjectTechItem>
      </ProjectTech>

      <div className="flex flex-col items-center mt-12">
        <p className="text-xs opacity-50 text-center">
          ...and many many more projects to be listed.
        </p>
        <p className="text-xs opacity-50 text-center">
          In the meantime, check my archive of
        </p>
        <a
          className="text-[#EB5D30] px-4 py-2 text-center text-underline mt-6 hover:text-underline"
          style={{ textDecoration: 'underline' }}
          target="_blank"
          href="https://tomasmaillo.notion.site/Everything-I-ve-ever-made-3d0e512ce6f24e6498604f2a772b4c8d">
          Everything I&apos;ve ever Built
        </a>
      </div>
    </div>
  )
}

export default Projects
