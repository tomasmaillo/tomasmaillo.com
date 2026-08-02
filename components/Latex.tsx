import katex from 'katex'

const Latex = ({ children }: { children: string }) => {
  const expression = children.startsWith('$') && children.endsWith('$')
    ? children.slice(1, -1)
    : children

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(expression, { throwOnError: false }),
      }}
    />
  )
}

export default Latex
