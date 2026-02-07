'use client'

import Image from 'next/image'
import React, { useState } from 'react'

const Divider = () => (
  <svg
    className="w-[95%] h-[1px] mx-auto my-3"
    viewBox="0 0 100 1"
    preserveAspectRatio="none">
    <line
      x1="0"
      y1="0"
      x2="100"
      y2="0"
      stroke="currentColor"
      strokeOpacity="0.1"
    />
  </svg>
)

const ExperienceItem = ({
  company,
  role,
  period,
  imageUrl,
  className,
  url,
}: {
  company: string
  role: string
  period: string
  imageUrl: string
  className?: string
  url?: string
}) => (
  <div
    className={`flex md:flex-row flex-col justify-between gap-2 md:items-center py-1 ${className}`}>
    <p className="flex flex-row items-center gap-2">
      <Image
        src={imageUrl}
        alt={company}
        width={20}
        height={20}
        draggable={false}
        className="rounded-full select-none"
      />
      {company}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent text-sm hover:underline">
          ↗
        </a>
      )}
    </p>
    <p className="text-muted text-xs">
      {role}
      <span className="select-none"> · </span>
      {period}
    </p>
  </div>
)

const Experience = () => {
  const [showMore, setShowMore] = useState(false)

  const experiences = [
    {
      company: 'Stripe',
      role: 'Software Engineer',
      period: 'Sept 2025',
      imageUrl: '/experience/stripe.svg',
    },
    {
      company: 'University of Edinburgh',
      role: 'CS and AI student',
      period: '2021 - 2025',
      imageUrl: '/experience/university-of-edinburgh.svg',
    },
    {
      company: 'Baillie Gifford',
      role: 'Software Engineering Intern',
      period: 'Summer 2024',
      imageUrl: '/experience/baillie-gifford.svg',
    },
    {
      company: 'Spotify',
      role: 'Software Engineering Intern',
      period: 'Summer 2022',
      imageUrl: '/experience/spotify.svg',
    },
  ]

  const moreExperiences = [
    {
      company: 'UoE Software Engineering Course',
      role: 'Lab Demonstrator and Marker',
      period: '2023',
      imageUrl: '/experience/university-of-edinburgh.svg',
    },
    {
      company: 'Code Cadets',
      role: 'Part-time High School Computer Science Teacher',
      period: '2024',
      imageUrl: 'https://unavatar.io/google/codecadets.co.uk',
    },
    {
      company: 'Computer Science Society',
      role: 'Committee Member',
      period: '2023 - 2025',
      imageUrl: 'https://favicone.com/comp-soc.com?s=126',
      url: 'https://comp-soc.com',
    },
    {
      company: 'Project Share Society',
      role: 'Founder & President',
      period: '2023 - 2025',
      imageUrl: 'https://favicone.com/projectshare.comp-soc.com?s=126',
      url: 'https://projectshare.comp-soc.com',
    },
    {
      company: 'Hack The Burgh 11 - Hackathon',
      role: 'Organiser',
      period: '2025',
      imageUrl: 'https://favicone.com/hacktheburgh.com?s=126',
      url: 'https://hacktheburgh.com',
    },
  ]

  return (
    <>
      <div
        className="flex flex-col bg-card rounded-lg gap p-3 -mx-2"
        style={{ width: 'calc(100% + 1rem)' }}>
        {experiences.map((exp, index) => (
          <React.Fragment key={exp.company}>
            <ExperienceItem {...exp} />
            {index < experiences.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </div>

      <div className="flex justify-center my-2">
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-muted hover:text-foreground transition-colors duration-200 p-1 rounded-full hover:bg-muted/50">
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              showMore ? 'rotate-45' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out -mx-2 ${
          showMore ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ width: 'calc(100% + 1rem)' }}>
        <div className="flex flex-col bg-card rounded-lg p-3 gap">
          {moreExperiences.map((exp, index) => (
            <React.Fragment key={exp.company}>
              <ExperienceItem {...exp} />
              {index < moreExperiences.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  )
}

export default Experience
