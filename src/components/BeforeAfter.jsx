import { useState } from 'react'
import { locations, products, stores, categories } from '../data/inventory'
import { ArrowRight, Eye } from 'lucide-react'

function getStockStatus(current, target) {
  if (current >= target) return 'at-target'
  if (current >= target * 0.8) return 'near-target'
  return 'below-target'
}

const statusColors = {
  'at-target': 'bg-status-green/10 text-status-green',
  'near-target': 'bg-status-yellow/10 text-status-yellow',
  'below-target': 'bg-status-red/10 text-status-red',
}

function MiniGrid({ inventory, label, accent }) {
  return (
    <div className="flex-1 min-w-0">
      <h4 className={`text-sm font-semibold mb-3 ${accent}`}>{label}</h4>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-bg-card">
              <th className="text-left px-2 py-2 font-semibold text-text-secondary sticky left-0 bg-bg-card z-10 min-w-[130px]">SKU</th>
              {stores.map(s => (
                <th key={s.id} className="px-2 py-2 text-center font-semibold text-text-secondary min-w-[60px]">{s.shortName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.sku} className="border-t border-border/30">
                <td className="px-2 py-1.5 font-medium sticky left-0 bg-bg-primary z-10 whitespace-nowrap">{p.name}</td>
                {stores.map(s => {
                  const val = inventory[s.id]?.[p.sku] || 0
                  const status = getStockStatus(val, p.target)
                  return (
                    <td key={s.id} className="px-2 py-1.5 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded font-mono font-semibold ${statusColors[status]}`}>
                        {val}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function BeforeAfter({ before, after, stats }) {
  const [view, setView] = useState('side')

  // Count below-target cells
  function countStatus(inv) {
    let below = 0, near = 0, good = 0
    for (const s of stores) {
      for (const p of products) {
        const status = getStockStatus(inv[s.id]?.[p.sku] || 0, p.target)
        if (status === 'below-target') below++
        else if (status === 'near-target') near++
        else good++
      }
    }
    return { below, near, good, total: below + near + good }
  }

  const beforeStats = countStatus(before)
  const afterStats = countStatus(after)

  return (
    <div className="space-y-6">
      {/* Impact summary */}
      <div className="bg-bg-card border border-border rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Eye size={18} className="text-racing-red" />
          <h3 className="font-semibold">Transfer Impact</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Before */}
          <div className="text-center">
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">Before Transfers</p>
            <div className="flex justify-center gap-3">
              <div>
                <span className="text-2xl font-bold text-status-red">{beforeStats.below}</span>
                <p className="text-[10px] text-text-secondary">Below Target</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-status-yellow">{beforeStats.near}</span>
                <p className="text-[10px] text-text-secondary">Near Target</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-status-green">{beforeStats.good}</span>
                <p className="text-[10px] text-text-secondary">At Target</p>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <ArrowRight size={24} className="text-racing-red" />
            </div>
          </div>

          {/* After */}
          <div className="text-center">
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">After Transfers</p>
            <div className="flex justify-center gap-3">
              <div>
                <span className="text-2xl font-bold text-status-red">{afterStats.below}</span>
                <p className="text-[10px] text-text-secondary">Below Target</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-status-yellow">{afterStats.near}</span>
                <p className="text-[10px] text-text-secondary">Near Target</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-status-green">{afterStats.good}</span>
                <p className="text-[10px] text-text-secondary">At Target</p>
              </div>
            </div>
          </div>
        </div>

        {/* Improvement bar */}
        <div className="mt-5 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-text-secondary">Fill Rate Improvement</span>
            <span className="font-semibold text-status-green">{stats.beforeFillRate}% → {stats.afterFillRate}%</span>
          </div>
          <div className="h-2 bg-bg-primary rounded-full overflow-hidden flex">
            <div
              className="h-full bg-status-red/50 transition-all"
              style={{ width: `${100 - parseFloat(stats.afterFillRate)}%` }}
            />
            <div
              className="h-full bg-status-green transition-all"
              style={{ width: `${stats.afterFillRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Side by side grids */}
      <div className="flex flex-col lg:flex-row gap-6">
        <MiniGrid inventory={before} label="Before Transfers" accent="text-status-red" />
        <MiniGrid inventory={after} label="After Transfers" accent="text-status-green" />
      </div>
    </div>
  )
}
