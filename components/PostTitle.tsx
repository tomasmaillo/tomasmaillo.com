import type { FC, SVGProps } from 'react'

const PostTitle = ({
  children,
  Icon,
}: {
  children: React.ReactNode
  Icon: FC<SVGProps<SVGSVGElement>>
}) => (
  <h1 className="my-4 flex items-center gap-3 font-sans text-3xl">
    <Icon className="h-9 w-9 shrink-0 fill-current text-foreground overflow-visible" />
    <span>{children}</span>
  </h1>
)

export default PostTitle
