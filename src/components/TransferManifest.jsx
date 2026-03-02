import { locations, products } from '../data/inventory'
import { ArrowRight, Package, Truck } from 'lucide-react'

function getLocationName(id) {
  return locations.find(l => l.id === id)?.name || id
}

function getProductName(sku) {
  return products.find(p => p.sku === sku)?.name || sku
}

export default function TransferManifest({ transfers, stats }) {
  // Group by source location
  const grouped = {}
  for (const t of transfers) {
    if (!grouped[t.from]) grouped[t.from] = []
    grouped[t.from].push(t)
  }

  // Sort: warehouse first, then stores
  const sourceOrder = ['wh', ...Object.keys(grouped).filter(k => k !== 'wh').sort()]

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-bg-card border border-border rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <Truck size={18} className="text-racing-red" />
          <h3 className="font-semibold">Transfer Summary</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-text-secondary">Total Transfers</span>
            <p className="text-lg font-bold">{stats.totalTransfers}</p>
          </div>
          <div>
            <span className="text-text-secondary">Shipments</span>
            <p className="text-lg font-bold">{stats.totalPackages}</p>
          </div>
          <div>
            <span className="text-text-secondary">Units Moving</span>
            <p className="text-lg font-bold">{stats.totalUnits}</p>
          </div>
          <div>
            <span className="text-text-secondary">Deficit Reduced</span>
            <p className="text-lg font-bold text-status-green">
              {stats.beforeTotalDeficit - stats.afterTotalDeficit} units
            </p>
          </div>
        </div>
      </div>

      {/* Grouped transfers */}
      {sourceOrder.filter(s => grouped[s]).map(sourceId => {
        const sourceTransfers = grouped[sourceId]
        const isWarehouse = sourceId === 'wh'
        const totalFromSource = sourceTransfers.reduce((sum, t) => sum + t.quantity, 0)

        return (
          <div key={sourceId} className="bg-bg-card border border-border rounded-lg overflow-hidden">
            <div className={`px-5 py-3 border-b border-border flex items-center justify-between ${isWarehouse ? 'bg-surplus/5' : 'bg-accent-gold/5'}`}>
              <div className="flex items-center gap-2">
                <Package size={16} className={isWarehouse ? 'text-surplus' : 'text-accent-gold'} />
                <h4 className="font-semibold text-sm">
                  From: {getLocationName(sourceId)}
                </h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isWarehouse ? 'bg-surplus/10 text-surplus' : 'bg-accent-gold/10 text-accent-gold'}`}>
                  {isWarehouse ? 'Warehouse' : 'Store Surplus'}
                </span>
              </div>
              <span className="text-xs text-text-secondary">
                {sourceTransfers.length} transfers &middot; {totalFromSource} units
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-text-secondary uppercase tracking-wider">
                    <th className="text-left px-5 py-2.5 font-semibold">Destination</th>
                    <th className="text-left px-5 py-2.5 font-semibold">SKU</th>
                    <th className="text-center px-5 py-2.5 font-semibold">Qty</th>
                    <th className="text-left px-5 py-2.5 font-semibold">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {sourceTransfers.map((t, i) => (
                    <tr key={i} className="border-t border-border/30 hover:bg-bg-hover/30 transition-colors">
                      <td className="px-5 py-2.5">
                        <div className="flex items-center gap-2 text-sm">
                          <ArrowRight size={12} className="text-racing-red" />
                          <span className="font-medium">{getLocationName(t.to)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-2.5">
                        <div className="text-sm">{getProductName(t.sku)}</div>
                        <div className="text-[10px] text-text-secondary font-mono">{t.sku}</div>
                      </td>
                      <td className="px-5 py-2.5 text-center">
                        <span className="bg-racing-red/10 text-racing-red font-bold text-sm px-2.5 py-0.5 rounded">
                          {t.quantity}
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-xs text-text-secondary max-w-xs">
                        {t.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}
