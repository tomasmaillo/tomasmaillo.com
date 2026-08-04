import katex from 'katex'

const Latex = ({ children }: { children: string }) => {
  const latexPattern = /(\$\$?)([\s\S]+?)\1/g
  const segments = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = latexPattern.exec(children)) !== null) {
    const [source, delimiter, expression] = match

    if (match.index > lastIndex) {
      segments.push(children.slice(lastIndex, match.index))
    }

    segments.push(
      <span
        key={`${match.index}-${delimiter.length}`}
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(expression, {
            displayMode: delimiter === '$$',
            throwOnError: false,
          }),
        }}
      />,
    )

    lastIndex = match.index + source.length
  }

  if (lastIndex < children.length) {
    segments.push(children.slice(lastIndex))
  }

  return <>{segments}</>
}

export default Latex
