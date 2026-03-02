import { Flag, BarChart3 } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b border-border bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-racing-red rounded-lg flex items-center justify-center">
              <Flag size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Racing Miami
                <span className="text-racing-red ml-2 text-base font-medium">Transfer Optimizer</span>
              </h1>
              <p className="text-text-secondary text-xs mt-0.5">
                Centralized inventory balancing across 5 stores + warehouse
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-text-secondary">
            <div className="flex items-center gap-1.5">
              <BarChart3 size={14} />
              <span>6 Locations</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <span>17 SKUs</span>
            <div className="w-px h-4 bg-border" />
            <span>South Florida</span>
          </div>
        </div>
      </div>

      {/* Racing stripe accent */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-racing-red to-transparent" />
    </header>
  )
}
