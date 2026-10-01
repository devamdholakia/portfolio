type Option<T> = { value: T; label: string }

type Props<T> = {
  label: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}

// a row of toggle buttons where exactly one is pressed
export function Segmented<T extends string | number>({ label, options, value, onChange }: Props<T>) {
  return (
    <div role="group" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-cream p-1">
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={String(option.value)}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              active ? 'bg-espresso text-cream' : 'text-espresso hover:bg-latte'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
