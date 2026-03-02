import { Package, ArrowRightLeft, TrendingUp, CheckCircle } from 'lucide-react'

export default function StatsBar({ stats }) {
  const items = [
    {
      icon: ArrowRightLeft,
      label: 'Transfers',
      value: stats.totalTransfers,
      color: 'text-racing-red',
    },
    {
      icon: Package,
      label: 'Shipments',
      value: stats.totalPackages,
      color: 'text-accent-gold',
    },
    {
      icon: TrendingUp,
      label: 'Units Moving',
      value: stats.totalUnits,
      color: 'text-surplus',
    },
    {
      icon: CheckCircle,
      label: 'Fill Rate',
      value: `${stats.beforeFillRate}% → ${stats.afterFillRate}%`,
      color: 'text-status-green',
    },
  ]

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map(item => (
          <div key={item.label} className="bg-bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-3">
            <item.icon size={18} className={item.color} />
            <div>
              <div className="text-xs text-text-secondary">{item.label}</div>
              <div className="text-sm font-semibold">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
