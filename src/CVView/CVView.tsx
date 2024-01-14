import React, { createRef, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useVelocity } from 'framer-motion'
import { InView } from 'react-intersection-observer'
import '../App.css'
import { PROJECTS } from '../projects'
import TopicDescriptionList from './TopicDescriptionList/TopicDescriptionList'
import ScrollOffset from './ScrollOffset'
import TopicDetails from './TopicDetails'
import StyledTopicDescription from './StyledTopicDescription'

const CVView: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>(
    PROJECTS.map((item) => item.id)
  )
  const [inViewItems, setInViewItems] = useState<number[]>([])
  const itemRefs = useRef<{ [key: number]: React.RefObject<HTMLDivElement> }>(
    {}
  )
  const [userProgress, setUserProgress] = useState<number>(0)

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

  useEffect(() => {
    const missingItem =
      items
        .filter((item) => !selectedItems.includes(item.id))
        .sort((a, b) => a.id - b.id)[0]?.id || 0

    if (userProgress < missingItem) setUserProgress(missingItem)
  }, [selectedItems])

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
      <ScrollOffset
        fixedFooter={
          <p
            style={{
              position: 'absolute',
              bottom: '0',
              padding: '1rem',
              margin: 0,
              fontSize: '.75rem',
              right: 0,
              mixBlendMode: 'multiply',
              opacity: userProgress < items.length ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
            }}>
            {userProgress}/{items.length}
          </p>
        }>
        <h2
          style={{
            padding: '1rem',
            paddingTop: '4rem',
            fontSize: '1.5rem',
            margin: 0,
          }}>
          Paperless CV
        </h2>
        <a href="/TomasMailloCV.pdf">Paperful_CV.pdf</a>
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
                height: 'min(64vh, 600px)',
                position: 'relative',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
              }}
              key={item.id}
              ref={itemRefs.current[item.id]}>
              {item.backgroundImg && (
                <img
                  src={item.backgroundImg}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    borderRadius: '10px',
                  }}
                />
              )}
              {item.backgroundElement}
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
                    <StyledTopicDescription
                      layoutId={`item-${item.id}`}
                      style={{
                        position: 'relative',
                      }}
                      isHidden={false}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <span>
                          <b>{item.description.title}</b> {' ⋅ '}
                          <span style={{ opacity: 0.75 }}>
                            {item.description.role}
                          </span>
                        </span>
                        <b>{item.description.date}</b>
                      </div>
                      {item.description.text}
                    </StyledTopicDescription>
                  )}
                </div>

                <div style={{ padding: '2rem', textAlign: 'left' }}>
                  <u>Visit</u>
                </div>
              </div>
            </div>
            <TopicDetails item={item} />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default CVView
