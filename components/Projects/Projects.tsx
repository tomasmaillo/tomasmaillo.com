import Autoplay from 'embla-carousel-autoplay'
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

const Projects = () => {
  return (
    <div>
      <ProjectTitle>Vibe-Check</ProjectTitle>
      <ProjectDescription>
        Co-built a browser extension to improve lectures at university by giving
        real-time feedback from the audience to lecturers.
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

      <ProjectTitle>Project Share</ProjectTitle>
      <ProjectDescription>
        Elit duis consectetur culpa officia qui nostrud commodo in cillum cillum
        Lorem in ex culpa adipisicing.
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

      <ProjectTitle>Fan</ProjectTitle>
      <ProjectDescription>
        Elit duis consectetur culpa officia qui nostrud commodo in cillum cillum
        Lorem in ex culpa adipisicing.
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
    </div>
  )
}

export default Projects
