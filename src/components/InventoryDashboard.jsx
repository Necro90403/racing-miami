import { locations, products, stores, categories } from '../data/inventory'

function getStockStatus(current, target) {
  if (current >= target) return 'at-target'
  if (current >= target * 0.8) return 'near-target'
  return 'below-target'
}

function StatusCell({ current, target, isWarehouse }) {
  if (isWarehouse) {
    return (
      <td className="px-3 py-2 text-center text-sm font-mono">
        <span className="text-surplus font-semibold">{current}</span>
      </td>
    )
  }

  const status = getStockStatus(current, target)
  const colors = {
    'at-target': 'bg-status-green/10 text-status-green',
    'near-target': 'bg-status-yellow/10 text-status-yellow',
    'below-target': 'bg-status-red/10 text-status-red',
  }

  return (
    <td className="px-3 py-2 text-center">
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-sm font-mono ${colors[status]}`}>
        <span className="font-semibold">{current}</span>
        <span className="text-[10px] opacity-60">/{target}</span>
      </div>
    </td>
  )
}

export default function InventoryDashboard({ inventory }) {
  // Calculate store deficits/surpluses
  const storeStats = stores.map(store => {
    let deficit = 0
    let surplus = 0
    for (const p of products) {
      const current = inventory[store.id]?.[p.sku] || 0
      const diff = current - p.target
      if (diff < 0) deficit += Math.abs(diff)
      else surplus += diff
    }
    return { ...store, deficit, surplus, net: surplus - deficit }
  })

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
        <span className="font-medium text-text-primary">Stock Status:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-status-green" />
          <span>At/Above Target</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-status-yellow" />
          <span>Within 20%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-status-red" />
          <span>Below Target</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-surplus" />
          <span>Warehouse Stock</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="bg-bg-card border-b border-border">
              <th className="text-left px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider sticky left-0 bg-bg-card z-10 min-w-[180px]">
                Product
              </th>
              {locations.map(loc => (
                <th key={loc.id} className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center min-w-[90px]">
                  {loc.shortName}
                  {loc.isWarehouse && <span className="block text-[10px] text-surplus font-normal normal-case">Warehouse</span>}
                </th>
              ))}
              <th className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center min-w-[80px]">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <>
                <tr key={`cat-${cat}`} className="bg-bg-hover/50">
                  <td colSpan={locations.length + 2} className="px-3 py-2 text-xs font-semibold text-racing-red uppercase tracking-widest">
                    {cat}
                  </td>
                </tr>
                {products.filter(p => p.category === cat).map(product => {
                  const total = locations.reduce((sum, loc) => sum + (inventory[loc.id]?.[product.sku] || 0), 0)
                  return (
                    <tr key={product.sku} className="border-b border-border/50 hover:bg-bg-hover/30 transition-colors">
                      <td className="px-3 py-2 sticky left-0 bg-bg-primary z-10">
                        <div className="text-sm font-medium">{product.name}</div>
                        <div className="text-[10px] text-text-secondary font-mono">{product.sku}</div>
                      </td>
                      {locations.map(loc => (
                        <StatusCell
                          key={loc.id}
                          current={inventory[loc.id]?.[product.sku] || 0}
                          target={product.target}
                          isWarehouse={loc.isWarehouse}
                        />
                      ))}
                      <td className="px-3 py-2 text-center text-sm font-mono font-semibold text-text-secondary">
                        {total}
                      </td>
                    </tr>
                  )
                })}
              </>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-bg-card border-t border-border">
              <td className="px-3 py-3 text-xs font-semibold text-text-secondary uppercase sticky left-0 bg-bg-card z-10">
                Store Balance
              </td>
              <td className="px-3 py-3 text-center text-xs text-surplus font-semibold">
                Bulk
              </td>
              {storeStats.map(s => (
                <td key={s.id} className="px-3 py-3 text-center">
                  <span className={`text-xs font-semibold ${s.net >= 0 ? 'text-status-green' : 'text-status-red'}`}>
                    {s.net >= 0 ? '+' : ''}{s.net}
                  </span>
                </td>
              ))}
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
