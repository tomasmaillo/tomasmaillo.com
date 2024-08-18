const ExperienceEntry = ({
  title,
  date,
  description,
}: {
  title: string
  date: string
  description: string
}) => (
  <div
    className="child mb-4 flex flex-row justify-between hover:bg-card rounded-lg p-2 box-border -mx-2 bg-card"
    style={{ width: 'calc(100% + 1rem)' }}>
    <div className="flex flex-col">
      <h2 className="">{title}</h2>
      <p className="opacity-70 text-sm">{description}</p>
    </div>
    <p className="text-sm opacity-70 text-right">{date}</p>
  </div>
)

const Experience = () => {
  return (
    <>
      <ExperienceEntry
        title="Baillie Gifford"
        date="Summer 2024"
        description="Software Engineering Intern"
      />

      <ExperienceEntry
        title="Spotify"
        date="Summer 2022"
        description="Software Engineering Intern"
      />

      <ExperienceEntry
        title="University of Edinburgh"
        date="2021 - Present"
        description="Computer Science and Artificial Intelligence student."
      />
    </>
  )
}

export default Experience
