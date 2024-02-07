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

export const RUSSELL_COOK: Person = {
  name: 'Russell Cook',
}

export const PAULINA_GERCHUK: Person = {
  name: 'Paulina Gerchuk',
  link: 'https://paulinagerch.uk/',
}

export const TOMAS_CUBELLS: Person = {
  name: 'Tomás Cubells',
  link: 'https://tomascubells.com/',
}


export const PeopleLink = ({ person, ...props }: { person: Person }) => {
  return (
    <a
      {...props}
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
