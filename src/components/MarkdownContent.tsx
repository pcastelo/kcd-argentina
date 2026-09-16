import type { ReactNode } from 'react'

type MarkdownContentProps = {
  content: string
  className?: string
}

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
  let lastIndex = 0
  let match = linkPattern.exec(text)

  while (match !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(
      <a
        key={`${match.index}-${match[1]}`}
        href={match[2]}
        className="text-primary hover:text-primary/90 underline"
        rel="noopener noreferrer"
        target="_blank"
      >
        {match[1]}
      </a>,
    )
    lastIndex = match.index + match[0].length
    match = linkPattern.exec(text)
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const blocks = content.trim().split(/\n{2,}/)

  return (
    <div
      className={`space-y-4 text-text-muted leading-relaxed${className ? ` ${className}` : ''}`}
    >
      {blocks.map((block, index) => {
        const trimmed = block.trim()
        if (!trimmed) {
          return null
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h3
              key={index}
              className="text-lg font-semibold text-text"
            >
              {trimmed.slice(3)}
            </h3>
          )
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h4
              key={index}
              className="text-base font-semibold text-text"
            >
              {trimmed.slice(4)}
            </h4>
          )
        }

        if (trimmed.startsWith('- ')) {
          const items = trimmed
            .split('\n')
            .map((line) => line.replace(/^- /, '').trim())
            .filter(Boolean)

          return (
            <ul key={index} className="list-disc space-y-2 pl-5">
              {items.map((item) => (
                <li key={item}>{renderInline(item)}</li>
              ))}
            </ul>
          )
        }

        return (
          <p key={index}>{renderInline(trimmed.replace(/\n/g, ' '))}</p>
        )
      })}
    </div>
  )
}
