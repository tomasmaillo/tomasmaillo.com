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
      company: 'No peeking yet!',
      role: 'Software Engineering',
      period: '2025',
      imageUrl: 'https://unavatar.io/google/secret!',
      className: 'filter blur-sm select-none',
    },
    {
      company: 'University of Edinburgh',
      role: 'CS and AI student',
      period: '2021 - 2025',
      imageUrl: 'https://unavatar.io/x/EdinburghUni',
    },
    {
      company: 'Baillie Gifford',
      role: 'Software Engineering Intern',
      period: 'Summer 2024',
      imageUrl: 'https://unavatar.io/x/BaillieGifford',
    },
    {
      company: 'Spotify',
      role: 'Software Engineering Intern',
      period: 'Summer 2022',
      imageUrl: 'https://unavatar.io/google/spotify.com',
    },
  ]

  const moreExperiences = [
    {
      company: 'UoE Software Engineering Course',
      role: 'Lab Demonstrator and Marker',
      period: '2023',
      imageUrl: 'https://unavatar.io/x/EdinburghUni',
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
          <>
            <ExperienceItem key={exp.company} {...exp} />
            {index < experiences.length - 1 && <Divider />}
          </>
        ))}
      </div>

      <button
        onClick={() => setShowMore(!showMore)}
        className="text-accent text-sm hover:text-accent transition-colors flex ml-auto my-2">
        <div className="ml-auto">{showMore ? 'less' : 'more'}</div>
      </button>

      {showMore && (
        <div
          className="flex flex-col bg-card rounded-lg p-3 gap mt-2 animate-fadeIn -mx-2"
          style={{ width: 'calc(100% + 1rem)' }}>
          {moreExperiences.map((exp, index) => (
            <>
              <ExperienceItem key={exp.company} {...exp} />
              {index < moreExperiences.length - 1 && <Divider />}
            </>
          ))}
        </div>
      )}
    </>
  )
}

export default Experience
