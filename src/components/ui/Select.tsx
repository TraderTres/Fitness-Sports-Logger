import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
}

export function Select({ label, options, error, id, className = '', ...rest }: SelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-medium text-white/70">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          className={[
            'w-full appearance-none rounded-xl bg-surface-raised border border-surface-border',
            'px-4 py-3 pr-10 text-white text-base min-h-[48px]',
            'transition-all duration-150 cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-rose-500 focus:ring-rose-500',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-surface-card text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
        />
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  )
}
