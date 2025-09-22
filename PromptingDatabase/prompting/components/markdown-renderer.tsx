import ReactMarkdown from "react-markdown"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "")
            return !inline && match ? (
              <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-700 my-4">
                <code className="text-gray-100 text-sm font-mono" {...props}>
                  {String(children).replace(/\n$/, "")}
                </code>
              </pre>
            ) : (
              <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-200" {...props}>
                {children}
              </code>
            )
          },
          h1: ({ children }) => <h1 className="text-2xl font-bold text-foreground mb-4 text-balance">{children}</h1>,
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-foreground mb-3 mt-6 text-balance">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium text-foreground mb-2 mt-4 text-balance">{children}</h3>
          ),
          p: ({ children }) => <p className="text-card-foreground leading-relaxed mb-4 text-pretty">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-card-foreground mb-4 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-card-foreground mb-4 space-y-1">{children}</ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
              {children}
            </blockquote>
          ),
          iframe: ({ src, width, height, ...props }) => (
            <div className="my-6">
              <iframe
                src={src}
                width={width || "560"}
                height={height || "315"}
                className="w-full max-w-full rounded-lg"
                style={{ aspectRatio: "16/9" }}
                allowFullScreen
                {...props}
              />
            </div>
          ),
          video: ({ src, width, height, children, ...props }) => (
            <div className="my-6">
              <video
                controls
                width={width || "560"}
                height={height || "315"}
                className="w-full max-w-full rounded-lg"
                {...props}
              >
                {children}
              </video>
            </div>
          ),
          img: ({ src, alt, ...props }) => (
            <div className="my-6">
              <img src={src || "/placeholder.svg"} alt={alt} className="max-w-[50%] rounded-lg shadow-sm" {...props} />
            </div>
          ),
        }}
        rehypePlugins={[]}
        remarkPlugins={[]}
        skipHtml={false}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
