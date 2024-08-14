import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props) => (
      <h1 className="text-3xl my-4 font-editorialNew" {...props} />
    ),
    h2: (props) => <h2 className="my-4 mt-12 font-medium " {...props} />,
    li: (props) => (
      <li
        className="text-sm my-2 list-decimal list-inside ml-4"
        {...props}
      />
    ),
    ol: (props) => <ol className="list-decimal my-8" {...props} />,
    a: (props) => <a className="text-[#EB5D31] hover:underline" {...props} />,
    p: (props) => <p className="text-sm mt-4 mb-6" {...props} />,
    strong: (props) => <strong className="font-bold" {...props} />,
    em: (props) => <em className="italic" {...props} />,
    blockquote: (props) => (
      <blockquote className="border-l-4 pl-4 [&>*]:bg-red-600" {...props} />
    ),
  }
}
