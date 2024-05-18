import { useRef, useEffect, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'

function useIsInViewport(ref: any) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIsIntersecting(entry.isIntersecting)
      ),
    []
  )

  useEffect(() => {
    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [ref, observer])

  return isIntersecting
}

const Signature = () => {
  const ref = useRef(null)
  const isInViewport = useIsInViewport(ref)
  const [hasBeenInViewport, setHasBeenInViewport] = useState(false)

  const theme = useTheme()

  useEffect(() => {
    if (isInViewport && !hasBeenInViewport) {
      setHasBeenInViewport(true)
    }
  }, [isInViewport])

  return (
    <div
      style={{
        width: 'min(20%, 250px)',
      }}>
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="120 90 400 240">
        <style>
          {`
            #t-top-line {
              stroke-linecap: round;
              animation-delay: 10s;
              animation: t-top-line-animation 0.4s ease-in forwards;
            }
            @keyframes t-top-line-animation {
              to {
                stroke-dashoffset: 0;
              }
            }

            #scribble-line{
              stroke-linecap: round;
              animation-delay: 1.5s;
              animation: scribble-line-animation 1.5s ease-in forwards;
            }

            @keyframes scribble-line-animation {
              10% {
                stroke-dashoffset: 1000;
              }
              85% {
                stroke-dashoffset: 500;
              }
              100% {
                stroke-dashoffset: 0;
              }
            }
          `}
        </style>
        <g transform="translate(130, 100)">
          {hasBeenInViewport && (
            <>
              <path
                id="t-top-line"
                stroke={theme.colors.primary}
                strokeWidth="5"
                fill="none"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                d="M1.5 53C6.5 56.5 8 57 15.5 56.5C21.5 56.1 44.1667 52.6667 53.5 50.5L149.5 32C192 23 278.7 4.2 285.5 1"
              />
              <path
                id="scribble-line"
                stroke={theme.colors.primary}
                strokeWidth="5"
                fill="none"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                d="M54.4999 55.9999C51.1666 60.6666 46.5 71 45.5 73.9999C44.1961 77.9115 40.5 87.5 43.5 90.5C46.5 93.5 55.5 93 60.5 88.5C67.1666 83.5 81.1 73.0999 83.5 71.4999C86.5 69.4999 98.8334 60 97.5 55.9999C96.5 52.9999 90.7999 52 89 53.4999C86 55.9999 85 59 83.5 63C82 67 82 74.5 85.5 76C89 77.5 97.5 78.4999 103 73.9999C108.5 69.5 111.5 68 114 63C116.5 58 118 53.9999 119.5 55.9999C121 58 115 66.5 117.5 71.4999C120 76.4999 129.5 76 137 69.5C141.667 66.1667 150.8 57.6 150 50C149 40.5 153.062 61.5534 156.5 64.5C160 67.5 165.5 63.5 171 54.5C176.5 45.5 175.5 42.5001 180.5 41.5001C185.781 40.4439 189.869 56.5 198.5 56.5C207 56.5 217 44 220.5 38.5C224 33 228.5 27.5 230 28C231.5 28.5 231 34.5 232 38.5C232.874 41.9979 232.175 47.5 238.5 47.5C244 47.5 252.5 38.5 256 35C259.5 31.5 267 22.5 271 23C275 23.5 277.748 27.311 282 30.5C286 33.5 289 36.5 297.5 35C306 33.5 340.607 16.5571 342 16C344.5 15 362.07 9.35757 365.5 8.50004C369.5 7.5 373 8.50001 372 11C371 13.5 349 20 345.5 22C342 24 301.5 40.5 298.5 42C295.5 43.5 240.5 70.5 235 73.5C229.379 76.5662 143 130.5 140.5 132.5C137.685 134.752 41 202.5 26 216.5"
              />
            </>
          )}
        </g>
      </svg>
    </div>
  )
}

export default Signature
