import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../ui/carousel'

const CarouselImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <img
      className="object-contain w-full h-full bg-slate-50 rounded-lg"
      src={src}
      alt={alt}
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
    </div>
  )
}

export default Projects
