import React, { createRef, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useVelocity } from 'framer-motion'
import { InView } from 'react-intersection-observer'
import '../App.css'
import { PROJECTS } from '../projects'
import TopicDescriptionList from './TopicDescriptionList/TopicDescriptionList'
import ScrollOffset from './ScrollOffset'

const CVView: React.FC = () => {
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

  return (
    <motion.div className="container">
      <ScrollOffset>
        <h1 style={{ fontFamily: 'PPMondwest-Regular', fontSize: '5rem' }}>
          Online ceevee
        </h1>
        <a href="/TomasMailloCV.pdf">PDF version</a>
        <TopicDescriptionList
          items={items}
          selectedItems={selectedItems}
          scrollToItem={scrollToItem}
        />
      </ScrollOffset>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10rem',
        }}>
        {items.map((item) => (
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
                height: '64vh',
                position: 'relative',
                borderRadius: '10px',
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
                    borderRadius: '10px',
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
                rootMargin="100px 0px -450px 0px"
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
                        mixBlendMode: 'multiply',
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

                <div style={{ padding: '2rem', textAlign: 'left' }}>
                  <u>Visit</u>
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '1rem',
              }}>
              {item.details?.map((detail) => (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: '1rem',
                  }}>
                  <span>{detail.title.toUpperCase()}</span>
                  <span>{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default CVView
