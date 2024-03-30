import { createRef, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useVelocity } from 'framer-motion'
import { InView } from 'react-intersection-observer'
import '../App.css'
import { PROJECTS } from '../projects'
import TopicDescriptionList from './TopicDescriptionList/TopicDescriptionList'
import ScrollOffset from './ScrollOffset'
import TopicDetails from './TopicDetails'
import StyledTopicDescription from './StyledTopicDescription'
import styled from 'styled-components'
import EverythingIveEverBuilt from '../EverythingIveEverBuilt'
import SideQuestsList from './SideQuestsList'

const ItemWrapper = styled.div<{ isClickable?: boolean }>`
  /* border: 1px solid ${(props) => props.theme.colors.border}; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: min(64vh, 600px);
  position: relative;
  border-radius: 12px;
  background-color: #ffffff;

  transition: all 0.2s;

  ${(props) =>
    props.isClickable &&
    `
    &:hover {
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
      outline: 1px solid rgba(0, 0, 0, 0.1);
    }
  `}
`

const CVViewHeader = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
      }}>
      <h2 style={{ margin: 0 }}>Paperless CV</h2>
      <a href="/TomasMailloCV.pdf">Paperful_CV.pdf</a>
    </div>
  )
}

const DesktopCVView: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>(
    PROJECTS.map((item) => item.id)
  )
  const [inViewItems, setInViewItems] = useState<number[]>([])
  const itemRefs = useRef<{ [key: number]: React.RefObject<HTMLDivElement> }>(
    {}
  )
  const [userProgress, setUserProgress] = useState<number>(1)

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
      <ScrollOffset>
        <CVViewHeader />
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
            <ItemWrapper
              key={item.id}
              ref={itemRefs.current[item.id]}
              as={item.url ? 'a' : 'div'}
              isClickable={!!item.url}
              href={item.url || '#'}>
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
                    pointerEvents: 'none',
                  }}
                />
              )}
              {item.backgroundElement}

              <InView
                as="div"
                onChange={(inView: boolean) =>
                  handleInViewChange(inView, item.id)
                }
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
                  <span
                    style={{
                      fontSize: '2rem',
                      zIndex: 10,
                      padding: '12px 12px 0px 12px',
                    }}>
                    {item.title}
                  </span>

                  {!selectedItems.includes(item.id) && item.description && (
                    <StyledTopicDescription
                      layoutId={`item-${item.id}`}
                      style={{
                        position: 'relative',
                        pointerEvents: 'none',
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
              </div>
            </ItemWrapper>
            <TopicDetails item={item} />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const MobileCVView: React.FC = () => {
  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
      <CVViewHeader />
      {PROJECTS.map((item) => (
        <motion.div
          key={item.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem',
            borderRadius: '10px',
          }}>
          <span
            style={{
              fontSize: '1rem',
              position: 'absolute',
              maxWidth: '50vw',
            }}>
            {item.title}
          </span>
          <img
            src={item.backgroundImg}
            style={{
              width: '100%',
              borderRadius: '10px',
              pointerEvents: 'none',
              backgroundColor: '#ffffff',
            }}
          />
          <span>
            <b>{item.description.title}</b> {' ⋅ '}
            <span style={{ opacity: 0.75 }}>{item.description.role}</span>
          </span>
          <span>{item.description.date}</span>
          {item.description.text}

          <TopicDetails item={item} />
        </motion.div>
      ))}
    </motion.div>
  )
}

const CVView: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      {isDesktop ? <DesktopCVView /> : <MobileCVView />}
      <SideQuestsList />
      <EverythingIveEverBuilt />
    </>
  )
}

export default CVView
