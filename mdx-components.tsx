import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props) => (
      <h1 className="text-3xl my-4 font-editorialNew" {...props} />
    ),
    h2: (props) => <h2 className="my-4" {...props} />,
    li: (props) => <li className="ml-8" {...props} />,
    ol: (props) => <ol className="list-decimal ml-6" {...props} />,
    a: (props) => <a className="text-blue-500 underline" {...props} />,
    p: (props) => <p className="text-sm mb-4" {...props} />,
    strong: (props) => <strong className="font-bold" {...props} />,
    em: (props) => <em className="italic" {...props} />,
    blockquote: (props) => (
      <blockquote className="border-l-4 pl-4 [&>*]:bg-red-600" {...props} />
    ),
  }
}
