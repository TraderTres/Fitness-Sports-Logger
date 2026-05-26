import { Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { Dashboard } from './pages/Dashboard'
import { History } from './pages/History'

export default function App() {
  return (
    <div className="relative min-h-dvh bg-surface">

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-lg mx-auto">
        <Routes>
          <Route path="/"         element={<Dashboard />} />
          <Route path="/history"  element={<History />} />
        </Routes>
      </div>

      <BottomNav />
    </div>
  )
}
