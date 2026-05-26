import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-brand-500 hover:bg-brand-400 active:bg-brand-600 text-white shadow-lg shadow-brand-500/20 glow-brand',
  secondary: 'bg-surface-raised hover:bg-surface-border border border-surface-border text-white',
  ghost:     'text-white/70 hover:text-white hover:bg-white/10',
  danger:    'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-lg shadow-rose-500/20',
}

const sizeClasses: Record<Size, string> = {
  sm:  'px-3 py-2 text-sm min-h-[40px]',
  md:  'px-4 py-3 text-sm min-h-[48px]',
  lg:  'px-6 py-4 text-base min-h-[56px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading

  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
        'transition-all duration-150 active:scale-[0.97] focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'disabled:opacity-50 disabled:pointer-events-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  )
}
