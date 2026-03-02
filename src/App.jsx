import { useState } from 'react'
import { initialInventory, locations, products, stores } from './data/inventory'
import { calculateOptimalTransfers } from './engine/optimizer'
import InventoryDashboard from './components/InventoryDashboard'
import TransferManifest from './components/TransferManifest'
import BeforeAfter from './components/BeforeAfter'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import { Zap } from 'lucide-react'

export default function App() {
  const [inventory] = useState(initialInventory)
  const [result, setResult] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleOptimize = () => {
    setIsCalculating(true)
    setTimeout(() => {
      const optimized = calculateOptimalTransfers(inventory)
      setResult(optimized)
      setIsCalculating(false)
      setActiveTab('manifest')
    }, 800)
  }

  const tabs = [
    { id: 'dashboard', label: 'Inventory Overview' },
    { id: 'manifest', label: 'Transfer Manifest', disabled: !result },
    { id: 'compare', label: 'Before / After', disabled: !result },
  ]

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      {result && <StatsBar stats={result.stats} />}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 border-b border-border mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors relative
                ${activeTab === tab.id
                  ? 'text-racing-red'
                  : tab.disabled
                    ? 'text-text-secondary/40 cursor-not-allowed'
                    : 'text-text-secondary hover:text-text-primary cursor-pointer'
                }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-racing-red" />
              )}
            </button>
          ))}

          <div className="ml-auto pb-2">
            <button
              onClick={handleOptimize}
              disabled={isCalculating}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer
                ${isCalculating
                  ? 'bg-racing-red/30 text-white/50'
                  : 'bg-racing-red hover:bg-racing-red-glow text-white shadow-lg shadow-racing-red/20 hover:shadow-racing-red/40'
                }`}
            >
              <Zap size={16} className={isCalculating ? 'animate-pulse' : ''} />
              {isCalculating ? 'Calculating...' : result ? 'Recalculate Transfers' : 'Calculate Optimal Transfers'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-12">
        {activeTab === 'dashboard' && (
          <InventoryDashboard inventory={inventory} />
        )}
        {activeTab === 'manifest' && result && (
          <TransferManifest transfers={result.transfers} stats={result.stats} />
        )}
        {activeTab === 'compare' && result && (
          <BeforeAfter before={inventory} after={result.afterInventory} stats={result.stats} />
        )}
      </div>
    </div>
  )
}
