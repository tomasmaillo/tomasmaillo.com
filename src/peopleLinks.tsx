interface Person {
  name: string
  link?: string
  image?: string
  description?: string
}

export const STAN_FLINT: Person = {
  name: 'Stan Flint',
  link: 'https://stanflint.dev/',
}

export const ALEXANDERLEE: Person = {
  name: 'Alexander Lee',
  link: 'https://www.linkedin.com/in/alexander-lee-1b7a2b1b0/',
}

export const PeopleLink = ({ person }: { person: Person }) => {
  return (
    <a
      className="App-link"
      href={person.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        textDecoration: 'underline',
      }}>
      {person.name}
    </a>
  )
}
