export interface Item {
  id: number
  title: JSX.Element
  background: string
  description: {
    title: string
    role?: string
    date: string
    text: JSX.Element
  }
  topic: string
  details?: {
    title: string
    value: JSX.Element
  }[]
}
