import React, { createRef, useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { InView } from 'react-intersection-observer'
import './App.css'
import { PROJECTS } from './projects'

const App: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [inViewItems, setInViewItems] = useState<number[]>([])
  const itemRefs = useRef<{ [key: number]: React.RefObject<HTMLDivElement> }>(
    {}
  )

  const items = PROJECTS
  // Create a ref for each item in the initial render
  items.forEach((item) => {
    if (!itemRefs.current[item.id]) {
      itemRefs.current[item.id] = createRef()
    }
  })

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)

  useEffect(() => {
    const i = setInterval(() => {
      if (
        Math.abs(scrollVelocity.get()) < 5 &&
        !(
          new Set(selectedItems).size === new Set(inViewItems).size &&
          new Set([...selectedItems, ...inViewItems]).size ===
            new Set(selectedItems).size
        )
      ) {
        setSelectedItems(inViewItems)
      }
    }, 100)

    return () => {
      clearInterval(i)
    }
  }, [inViewItems, scrollVelocity, selectedItems])

  const handleInViewChange = (inView: boolean, id: number) => {
    if (inView) {
      setInViewItems((prev) => prev.filter((item) => item !== id))
    } else {
      setInViewItems((prev) => [...prev, id])
    }
  }

  const scrollToItem = (id: number) => {
    itemRefs.current[id]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  const selectedVerticalOffset = useTransform(
    scrollY,
    [
      0,
      Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      ),
    ],
    [0, window.innerHeight * 10],
    {
      clamp: false,
    }
  )

  // Create a spring to smooth the transitions
  const smoothSelectedVerticalOffset = useSpring(selectedVerticalOffset, {
    damping: 50,
    stiffness: 400,
  })

  // The y position for the div
  const y = useTransform(
    smoothSelectedVerticalOffset,
    (value) => -value / 50 + 120
  )

  return (
    <motion.div className="container">
      <div>
        <motion.div className="selected" style={{ y }}>
          <p
            style={{
              textAlign: 'left',
              fontSize: '16px',
              marginBottom: '0px',
            }}>
            Projects:
          </p>
          <svg
            width="403"
            height="1"
            viewBox="0 0 403 1"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <line
              y1="0.5"
              x2="403"
              y2="0.5"
              stroke="url(#paint0_linear_1229_5)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1229_5"
                x1="410.5"
                y1="0.99886"
                x2="5.49998"
                y2="0.999985"
                gradientUnits="userSpaceOnUse">
                <stop stop-opacity="0" />
                <stop offset="1" />
              </linearGradient>
            </defs>
          </svg>

          {items.map((item, i) => {
            if (!item.description) return null

            if (i === 3)
              return (
                <>
                  <p
                    style={{
                      textAlign: 'left',
                      fontSize: '16px',
                      marginBottom: '0px',
                    }}>
                    Education:
                  </p>
                  <svg
                    width="403"
                    height="1"
                    viewBox="0 0 403 1"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <line
                      y1="0.5"
                      x2="403"
                      y2="0.5"
                      stroke="url(#paint0_linear_1229_5)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_1229_5"
                        x1="410.5"
                        y1="0.99886"
                        x2="5.49998"
                        y2="0.999985"
                        gradientUnits="userSpaceOnUse">
                        <stop stop-opacity="0" />
                        <stop offset="1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </>
              )
            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  width: 'inherit',
                }}>
                <span
                  style={{
                    color: '#999999',
                    fontSize: '24px',
                  }}>
                  •
                </span>
                <motion.div
                  key={item.id}
                  layoutId={`item-${item.id}`}
                  className={`item ${
                    selectedItems.includes(item.id) ? 'visible' : 'hidden'
                  }`}
                  style={{ position: 'relative', fontSize: '14px' }}
                  transition={{
                    type: 'spring',
                    stiffness: 50,
                    damping: 12,
                    duration: 0.1,
                  }}
                  onClick={() => scrollToItem(item.id)}>
                  {item.description}
                </motion.div>
              </div>
            )
          })}
        </motion.div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10rem',
        }}>
        {items.map((item) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%',
              height: '70vh',
              position: 'relative',
              backgroundColor: '#ffffff',
            }}
            key={item.id}
            ref={itemRefs.current[item.id]}>
            {item.background && (
              <img
                src={item.background}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  borderRadius: '5px',
                  border: '1px solid #ececec',
                }}
              />
            )}
            <span
              style={{
                color: '#999999',
                width: '100%',
              }}>
              {item.id}
            </span>
            <InView
              as="div"
              onChange={(inView) => handleInViewChange(inView, item.id)}
              rootMargin="100px 0px -150px 0px"
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '2rem',
                  zIndex: 100,
                }}>
                <span style={{ fontSize: '2rem', zIndex: 10 }}>
                  {item.title}
                </span>

                {!selectedItems.includes(item.id) && item.description && (
                  <motion.div
                    layoutId={`item-${item.id}`}
                    className="item"
                    style={{
                      position: 'relative',
                      fontSize: '14px',
                      mixBlendMode: 'difference',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 55,
                      damping: 12,
                    }}>
                    {item.description}
                  </motion.div>
                )}
              </div>

              <u style={{ padding: '2rem', bottom: 0, textAlign: 'left' }}>
                Visit
              </u>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default App
