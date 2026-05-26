import { NavLink } from 'react-router-dom'
import { LayoutDashboard, History } from 'lucide-react'

export function BottomNav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'flex flex-col items-center gap-1 flex-1 py-3 transition-colors duration-150',
      'touch-target justify-center',
      isActive ? 'text-brand-400' : 'text-white/30 hover:text-white/60',
    ].join(' ')

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center bg-surface-card border-t border-surface-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Main navigation"
    >
      <NavLink to="/" end className={linkClass} aria-label="Dashboard">
        <LayoutDashboard size={22} />
        <span className="text-[10px] font-semibold uppercase tracking-wide">Dashboard</span>
      </NavLink>
      <NavLink to="/history" className={linkClass} aria-label="History">
        <History size={22} />
        <span className="text-[10px] font-semibold uppercase tracking-wide">History</span>
      </NavLink>
    </nav>
  )
}
