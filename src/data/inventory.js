// Racing Miami — Inventory Data Layer
// This module is cleanly separated so it can be swapped for Shopify API / CSV import later

export const locations = [
  { id: 'wh', name: 'Warehouse', shortName: 'WH', isWarehouse: true },
  { id: 'brickell', name: 'Brickell', shortName: 'BRK', isWarehouse: false },
  { id: 'wynwood', name: 'Wynwood', shortName: 'WYN', isWarehouse: false },
  { id: 'aventura', name: 'Aventura', shortName: 'AVN', isWarehouse: false },
  { id: 'doral', name: 'Doral', shortName: 'DRL', isWarehouse: false },
  { id: 'miami-beach', name: 'Miami Beach', shortName: 'MIB', isWarehouse: false },
]

export const stores = locations.filter(l => !l.isWarehouse)

export const categories = ['Caps', 'T-Shirts', 'Jackets', 'Accessories']

export const products = [
  // Caps — target: 12 per store
  { sku: 'CAP-RBR', name: 'Red Bull Cap', category: 'Caps', target: 12 },
  { sku: 'CAP-FER', name: 'Ferrari Cap', category: 'Caps', target: 12 },
  { sku: 'CAP-MCL', name: 'McLaren Cap', category: 'Caps', target: 12 },
  { sku: 'CAP-MER', name: 'Mercedes Cap', category: 'Caps', target: 12 },

  // T-Shirts — target: 8 per store
  { sku: 'TEE-RBR-S', name: 'Red Bull Tee S', category: 'T-Shirts', target: 8 },
  { sku: 'TEE-RBR-M', name: 'Red Bull Tee M', category: 'T-Shirts', target: 8 },
  { sku: 'TEE-RBR-L', name: 'Red Bull Tee L', category: 'T-Shirts', target: 8 },
  { sku: 'TEE-FER-M', name: 'Ferrari Tee M', category: 'T-Shirts', target: 8 },
  { sku: 'TEE-FER-L', name: 'Ferrari Tee L', category: 'T-Shirts', target: 8 },
  { sku: 'TEE-MCL-M', name: 'McLaren Tee M', category: 'T-Shirts', target: 8 },

  // Jackets — target: 6 per store
  { sku: 'JKT-MCL', name: 'McLaren Jacket', category: 'Jackets', target: 6 },
  { sku: 'JKT-MER', name: 'Mercedes Jacket', category: 'Jackets', target: 6 },
  { sku: 'JKT-FER', name: 'Ferrari Jacket', category: 'Jackets', target: 6 },

  // Accessories — target: 15 per store
  { sku: 'ACC-KEY', name: 'Keychain Pack', category: 'Accessories', target: 15 },
  { sku: 'ACC-LAN', name: 'Lanyard Set', category: 'Accessories', target: 15 },
  { sku: 'ACC-PHN', name: 'Phone Case', category: 'Accessories', target: 15 },
  { sku: 'ACC-FLAG', name: 'Mini Flag Set', category: 'Accessories', target: 15 },
]

// Placeholder inventory — some stores over, some under, warehouse has bulk
// Format: { [locationId]: { [sku]: quantity } }
export const initialInventory = {
  'wh': {
    'CAP-RBR': 45, 'CAP-FER': 38, 'CAP-MCL': 52, 'CAP-MER': 30,
    'TEE-RBR-S': 25, 'TEE-RBR-M': 20, 'TEE-RBR-L': 18, 'TEE-FER-M': 22, 'TEE-FER-L': 15, 'TEE-MCL-M': 28,
    'JKT-MCL': 14, 'JKT-MER': 10, 'JKT-FER': 12,
    'ACC-KEY': 60, 'ACC-LAN': 45, 'ACC-PHN': 35, 'ACC-FLAG': 50,
  },
  'brickell': {
    'CAP-RBR': 14, 'CAP-FER': 3, 'CAP-MCL': 12, 'CAP-MER': 7,
    'TEE-RBR-S': 8, 'TEE-RBR-M': 2, 'TEE-RBR-L': 5, 'TEE-FER-M': 10, 'TEE-FER-L': 3, 'TEE-MCL-M': 8,
    'JKT-MCL': 6, 'JKT-MER': 2, 'JKT-FER': 8,
    'ACC-KEY': 5, 'ACC-LAN': 18, 'ACC-PHN': 9, 'ACC-FLAG': 15,
  },
  'wynwood': {
    'CAP-RBR': 8, 'CAP-FER': 15, 'CAP-MCL': 4, 'CAP-MER': 12,
    'TEE-RBR-S': 3, 'TEE-RBR-M': 8, 'TEE-RBR-L': 1, 'TEE-FER-M': 6, 'TEE-FER-L': 8, 'TEE-MCL-M': 2,
    'JKT-MCL': 3, 'JKT-MER': 9, 'JKT-FER': 4,
    'ACC-KEY': 20, 'ACC-LAN': 7, 'ACC-PHN': 15, 'ACC-FLAG': 3,
  },
  'aventura': {
    'CAP-RBR': 6, 'CAP-FER': 12, 'CAP-MCL': 9, 'CAP-MER': 2,
    'TEE-RBR-S': 10, 'TEE-RBR-M': 4, 'TEE-RBR-L': 8, 'TEE-FER-M': 1, 'TEE-FER-L': 6, 'TEE-MCL-M': 11,
    'JKT-MCL': 1, 'JKT-MER': 6, 'JKT-FER': 2,
    'ACC-KEY': 15, 'ACC-LAN': 10, 'ACC-PHN': 4, 'ACC-FLAG': 22,
  },
  'doral': {
    'CAP-RBR': 12, 'CAP-FER': 7, 'CAP-MCL': 16, 'CAP-MER': 14,
    'TEE-RBR-S': 5, 'TEE-RBR-M': 9, 'TEE-RBR-L': 3, 'TEE-FER-M': 8, 'TEE-FER-L': 2, 'TEE-MCL-M': 4,
    'JKT-MCL': 8, 'JKT-MER': 3, 'JKT-FER': 6,
    'ACC-KEY': 8, 'ACC-LAN': 15, 'ACC-PHN': 20, 'ACC-FLAG': 6,
  },
  'miami-beach': {
    'CAP-RBR': 3, 'CAP-FER': 10, 'CAP-MCL': 7, 'CAP-MER': 5,
    'TEE-RBR-S': 6, 'TEE-RBR-M': 3, 'TEE-RBR-L': 9, 'TEE-FER-M': 4, 'TEE-FER-L': 8, 'TEE-MCL-M': 6,
    'JKT-MCL': 4, 'JKT-MER': 7, 'JKT-FER': 1,
    'ACC-KEY': 12, 'ACC-LAN': 3, 'ACC-PHN': 15, 'ACC-FLAG': 10,
  },
}
