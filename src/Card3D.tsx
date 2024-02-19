import { motion, useAnimation, useSpring } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

const springConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 40,
}

const CardSide = styled(motion.div)<{ isHovered: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  backface-visibility: hidden;
  color: white;

  position: absolute;
  transition: 0.2s box-shadow;

  box-sizing: border-box;
`

interface FlippableCardProps {
  children: React.ReactNode
  width: string
  height: string
  [key: string]: any
}

const Card3D = ({ children, width, height, ...props }: FlippableCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const dx = useSpring(0, springConfig)
  const dy = useSpring(0, springConfig)

  const controls = useAnimation()

  const zoom = useSpring(1, {
    duration: 0.1,
    damping: 7,
  })

  useEffect(() => {
    dx.set(-rotateX)
    dy.set(rotateY)
  }, [rotateX, rotateY])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = ref.current

    if (element) {
      const elementRect = element.getBoundingClientRect()
      if (!isHovered) {
        setIsHovered(true)
        zoom.set(1.05)
      }
      const x = event.clientX - (elementRect.left + elementRect.width / 2)
      const y = event.clientY - (elementRect.top + elementRect.height / 2)
      setRotateX((y / elementRect.height) * 20)
      setRotateY((x / elementRect.width) * 20)
    }
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setIsHovered(false)
    zoom.set(1)
  }

  return (
    <motion.div
      ref={ref}
      animate={controls}
      style={{
        width: width,
        height: height,
        perspective: 1200,
        transformStyle: 'preserve-3d',
        zIndex: 10,
        borderRadius: '100px',
      }}
      {...props}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        layoutId="uniqueid"
        style={{
          width: '100%',
          height: '100%',
          perspective: 1200,
          scale: zoom,
          rotateY: dy,
          rotateX: dx,

          transformStyle: 'preserve-3d',
        }}>
        {/* Front side */}
        <CardSide
          isHovered={isHovered}
          initial={{ rotateY: 0 }}
          transition={springConfig}>
          {children}
        </CardSide>
      </motion.div>
    </motion.div>
  )
}

export default Card3D
