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

export const CRIS_MAILLO: Person = {
  name: 'Cris Maillo',
  link: 'https://crismaillo.net/',
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
