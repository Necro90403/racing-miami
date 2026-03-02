// Transfer Optimization Engine
// Calculates optimal inventory transfers across all locations

import { locations, stores, products } from '../data/inventory'

/**
 * Calculate optimal transfers to balance inventory across stores.
 * @param {Object} inventory - Current inventory state { locationId: { sku: qty } }
 * @returns {Object} { transfers: [...], afterInventory: {...}, stats: {...} }
 */
export function calculateOptimalTransfers(inventory) {
  const transfers = []
  const afterInventory = JSON.parse(JSON.stringify(inventory))

  for (const product of products) {
    const { sku, target } = product

    // Step 1: Calculate deficits and surpluses for stores
    const deficits = [] // { storeId, amount }
    const surpluses = [] // { storeId, amount }

    for (const store of stores) {
      const current = inventory[store.id]?.[sku] || 0
      const diff = current - target

      if (diff < 0) {
        deficits.push({ locationId: store.id, amount: Math.abs(diff) })
      } else if (diff > 0) {
        surpluses.push({ locationId: store.id, amount: diff })
      }
    }

    if (deficits.length === 0) continue

    const totalDeficit = deficits.reduce((sum, d) => sum + d.amount, 0)
    const warehouseStock = inventory['wh']?.[sku] || 0
    const totalSurplus = surpluses.reduce((sum, s) => sum + s.amount, 0)
    const totalAvailable = warehouseStock + totalSurplus

    // Step 2: Calculate allocation ratio
    const fillRatio = totalAvailable >= totalDeficit ? 1 : totalAvailable / totalDeficit

    // Step 3: Allocate from warehouse first, then from surplus stores
    let remainingWarehouse = warehouseStock
    let remainingSurpluses = surpluses.map(s => ({ ...s }))

    // Sort deficits largest first for fair distribution
    const sortedDeficits = [...deficits].sort((a, b) => b.amount - a.amount)

    for (const deficit of sortedDeficits) {
      let needed = Math.floor(deficit.amount * fillRatio)
      if (needed === 0) continue

      // Try warehouse first
      if (remainingWarehouse > 0) {
        const fromWH = Math.min(needed, remainingWarehouse)
        if (fromWH > 0) {
          transfers.push({
            from: 'wh',
            to: deficit.locationId,
            sku,
            quantity: fromWH,
            reason: `${getLocationName(deficit.locationId)} has ${inventory[deficit.locationId]?.[sku] || 0} ${product.name}, target is ${target}`,
          })
          afterInventory['wh'][sku] -= fromWH
          afterInventory[deficit.locationId][sku] = (afterInventory[deficit.locationId][sku] || 0) + fromWH
          remainingWarehouse -= fromWH
          needed -= fromWH
        }
      }

      // Then pull from surplus stores
      if (needed > 0) {
        for (const surplus of remainingSurpluses) {
          if (surplus.amount <= 0 || needed <= 0) continue
          const fromStore = Math.min(needed, surplus.amount)
          if (fromStore > 0) {
            transfers.push({
              from: surplus.locationId,
              to: deficit.locationId,
              sku,
              quantity: fromStore,
              reason: `${getLocationName(deficit.locationId)} has ${inventory[deficit.locationId]?.[sku] || 0} ${product.name}, target is ${target}`,
            })
            afterInventory[surplus.locationId][sku] -= fromStore
            afterInventory[deficit.locationId][sku] = (afterInventory[deficit.locationId][sku] || 0) + fromStore
            surplus.amount -= fromStore
            needed -= fromStore
          }
        }
      }
    }
  }

  // Calculate stats
  const stats = calculateStats(inventory, afterInventory, transfers)

  return { transfers, afterInventory, stats }
}

function getLocationName(id) {
  return locations.find(l => l.id === id)?.name || id
}

function calculateStats(beforeInv, afterInv, transfers) {
  let beforeBelowTarget = 0
  let afterBelowTarget = 0
  let beforeTotalDeficit = 0
  let afterTotalDeficit = 0

  for (const store of stores) {
    for (const product of products) {
      const { sku, target } = product
      const before = beforeInv[store.id]?.[sku] || 0
      const after = afterInv[store.id]?.[sku] || 0

      if (before < target) {
        beforeBelowTarget++
        beforeTotalDeficit += (target - before)
      }
      if (after < target) {
        afterBelowTarget++
        afterTotalDeficit += (target - after)
      }
    }
  }

  const totalCells = stores.length * products.length
  const totalUnits = transfers.reduce((sum, t) => sum + t.quantity, 0)

  // Group transfers by source for package count
  const sources = new Set(transfers.map(t => `${t.from}-${t.to}`))

  return {
    totalTransfers: transfers.length,
    totalPackages: sources.size,
    totalUnits,
    beforeBelowTarget,
    afterBelowTarget,
    beforeTotalDeficit,
    afterTotalDeficit,
    totalCells,
    beforeFillRate: ((totalCells - beforeBelowTarget) / totalCells * 100).toFixed(1),
    afterFillRate: ((totalCells - afterBelowTarget) / totalCells * 100).toFixed(1),
  }
}
