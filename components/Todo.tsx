import { isTodo } from '@/content/site'

// visible marker for content that still needs filling in under /content
export function Todo({ value }: { value: string }) {
  return (
    <span
      title="Placeholder, fill this in under /content"
      className="inline-block rounded border border-dashed border-current px-1.5 py-0.5 font-mono text-xs"
    >
      {value || 'TODO'}
    </span>
  )
}

// renders a real link, or the placeholder chip while the value is still a TODO_
export function LinkOrTodo({
  value,
  href,
  label,
  className = '',
}: {
  value: string
  href?: string
  label: string
  className?: string
}) {
  if (isTodo(value)) {
    return (
      <span className={className}>
        {label}: <Todo value={value} />
      </span>
    )
  }
  const target = href ?? value
  const external = target.startsWith('http')
  return (
    <a
      href={target}
      className={`underline decoration-1 underline-offset-4 hover:decoration-2 ${className}`}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {label}
    </a>
  )
}

export function TextOrTodo({ value }: { value: string }) {
  return isTodo(value) ? <Todo value={value} /> : <>{value}</>
}
