import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../ui/carousel'
import { cn } from '@/lib/utils'

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
    <img
      className={cn(
        'object-contain w-full h-full bg-slate-50 rounded-lg',
        addPadding && 'p-2'
      )}
      src={src}
      alt={alt}
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
        'object-cover w-full h-full bg-slate-50 rounded-lg overflow-hidden',
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
        Platform to increase lecture engagement by real-time interaction and
        data visualization. Worked alongside UoEdinburgh lecturers to trial the
        system in lectures.
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
        <ProjectTechItem>ViteJS</ProjectTechItem>
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

      <p className="text-xs opacity-50 mt-12 text-center">
        and many more projects to be listed...
      </p>
    </div>
  )
}

export default Projects
