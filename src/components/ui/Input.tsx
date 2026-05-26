import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  unit?: string
}

export function Input({ label, error, hint, unit, id, className = '', ...rest }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-white/70"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          className={[
            'w-full rounded-xl bg-surface-raised border border-surface-border',
            'px-4 py-3 text-white placeholder-white/30 text-base',
            'min-h-[48px] transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-rose-500 focus:ring-rose-500',
            unit && 'pr-14',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/40 font-medium pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {hint && !error && <p className="text-xs text-white/40">{hint}</p>}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  )
}
