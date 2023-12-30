import { PeopleLink, STAN_FLINT, CRIS_MAILLO } from './peopleLinks'

const CreditedPeople = [
  <PeopleLink person={STAN_FLINT} />,
  <PeopleLink person={CRIS_MAILLO} />,
]

const Credits = () => {
  return (
    <div
      style={{
        bottom: 0,
        left: 0,
        zIndex: 10000,
        borderRadius: '10px',
        backgroundColor: '#ffffffd5',
        border: '1px solid #ececec',
        padding: '15px',
        backdropFilter: 'blur(3px)',
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: '0.5rem',
        }}>
        <span
          style={{
            fontSize: '16px',
          }}>
          Credit to the people that made this possible:
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: '0.5rem',
          }}>
          {CreditedPeople.map((person, i) => (
            <span>
              {person}
              {i < CreditedPeople.length - 1 && ','}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Credits
