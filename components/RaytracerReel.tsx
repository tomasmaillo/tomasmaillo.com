export default function RaytracerReel({ className }: { className: string }) {
  return (
    <video
      className={className}
      src="/raytracer/showreel.mp4"
      poster="/raytracer/showreel-poster.webp"
      aria-label="An orange triangle drops behind two glass spheres. After a grid of metal finishes, focus shifts from a copper cube to a silver ring. A plane slices an ivory knight, tracing the cut in red. Chrome spheres reflect a copper sphere."
      width={1920}
      height={1080}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      draggable={false}
    />
  )
}
