export interface Item {
  id: number
  title: JSX.Element
  background: string
  description: JSX.Element
  topic: string
  details?: {
    title: string
    value: JSX.Element
  }[]
}
