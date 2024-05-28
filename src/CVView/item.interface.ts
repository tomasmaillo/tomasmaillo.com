export interface Item {
  id: number
  title: JSX.Element
  backgroundImg?: string
  backgroundElement?: JSX.Element
  description: {
    title: string
    role?: string
    date: string
    text: JSX.Element
  }
  topic: string
  details: {
    title: string
    value: JSX.Element
  }[]
  url?: string
}
