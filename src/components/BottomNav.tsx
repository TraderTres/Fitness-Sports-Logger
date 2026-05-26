import { NavLink } from 'react-router-dom'
import { LayoutDashboard, History, Zap } from 'lucide-react'

export function BottomNav() {
  const mobileClass = ({ isActive }: { isActive: boolean }) =>
    [
      'flex flex-col items-center justify-center gap-1 flex-1 py-3',
      'text-[10px] font-semibold uppercase tracking-wide transition-colors duration-150',
      isActive ? 'text-brand-400' : 'text-white/30',
    ].join(' ')

  const desktopClass = ({ isActive }: { isActive: boolean }) =>
    [
      'flex items-center gap-3 px-6 py-3.5 mx-3 rounded-xl',
      'text-sm font-semibold transition-all duration-150',
      isActive
        ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
        : 'text-white/40 hover:text-white hover:bg-white/5',
    ].join(' ')

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center bg-surface-card/90 backdrop-blur-sm border-t border-surface-border md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Main navigation"
      >
        <NavLink to="/" end className={mobileClass} aria-label="Dashboard">
          <LayoutDashboard size={22} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/history" className={mobileClass} aria-label="History">
          <History size={22} />
          <span>History</span>
        </NavLink>
      </nav>

      <nav
        className="hidden md:flex fixed top-0 left-0 bottom-0 w-[240px] z-40 flex-col bg-surface-card border-r border-surface-border"
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center gap-3 px-6 py-6 border-b border-surface-border">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-base font-extrabold text-white tracking-tight">FitLog</p>
            <p className="text-[10px] text-white/30 font-medium uppercase tracking-widest">Fitness Tracker</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 pt-4">
          <NavLink to="/" end className={desktopClass} aria-label="Dashboard">
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/history" className={desktopClass} aria-label="History">
            <History size={18} />
            History
          </NavLink>
        </div>
      </nav>
    </>
  )
}
