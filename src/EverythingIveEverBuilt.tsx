import styled from 'styled-components'

// Assuming these theme colors are defined in your theme object
interface Theme {
  colors: {
    card: string
    border: string
    primary: string
  }
}

interface StyledContainerProps {
  theme: Theme
}

const StyledContainer = styled.div<StyledContainerProps>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  bottom: 0;
  left: 0;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.card};
  border: 1px solid ${(props) => props.theme.colors.border};
  color: ${(props) => props.theme.colors.primary};
  backdrop-filter: blur(3px);
`

const EverythingIveEverBuilt: React.FC = () => {
  // const canvasRef = useRef<HTMLCanvasElement>(null)

  // useEffect(() => {
  //   const canvas = canvasRef.current
  //   if (!canvas) return

  //   const ctx = canvas.getContext('2d')
  //   if (!ctx) return

  //   const resizeCanvas = () => {
  //     if (canvas.parentElement) {
  //       canvas.width = canvas.parentElement.offsetWidth
  //       canvas.height = canvas.parentElement.offsetHeight
  //     }
  //   }

  //   window.addEventListener('resize', resizeCanvas)
  //   resizeCanvas()

  //   let angle = 0
  //   const draw = () => {
  //     const width = canvas.width
  //     const height = canvas.height
  //     ctx.clearRect(0, 0, width, height)

  //     ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
  //     ctx.fillRect(0, 0, width, height)

  //     const centerX = width / 2
  //     const centerY = height / 2
  //     const radius = Math.min(width, height) / 4

  //     ctx.beginPath()
  //     ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false)
  //     ctx.closePath()

  //     ctx.fillStyle = `hsl(${angle}, 100%, 50%)`
  //     ctx.fill()

  //     angle = (angle + 1) % 360

  //     requestAnimationFrame(draw)
  //   }

  //   draw()

  //   return () => window.removeEventListener('resize', resizeCanvas)
  // }, [])

  return (
    <StyledContainer>
      {/* <canvas ref={canvasRef}></canvas> */}
      <code>
        Slowly assembling an{' '}
        <a
          href="https://tomasmaillo.notion.site/Everything-I-ve-ever-made-3d0e512ce6f24e6498604f2a772b4c8d?pvs=4"
          target="_blank"
          rel="noopener noreferrer">
          archive
        </a>{' '}
        everything I've ever built.
      </code>
    </StyledContainer>
  )
}

export default EverythingIveEverBuilt
