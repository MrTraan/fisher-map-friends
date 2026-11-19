import type { Container, Pool } from './types'

// Contents and pools are Classic-era data, not yet confirmed for WoW Forever.
// Where each container is fished up comes from reports.ts when Wowhead has reports;
// the `zones` lists here are the Classic fallback.
export const CONTAINERS: Container[] = [
  {
    id: 'message-in-a-bottle', name: 'Message in a Bottle', kind: 'other',
    contents: ['Low-level buff scrolls', 'Recipes (item level 11-31)'],
    zones: ['ashenvale', 'darkshore', 'hillsbrad', 'silverpine', 'barrens', 'westfall', 'wetlands'],
  },
  {
    id: 'dented-crate', name: 'Dented Crate', kind: 'crate',
    contents: ['Coarse Blasting Powder', 'Copper Modulator', 'Copper Tube', 'Handful of Copper Bolts'],
    zones: ['darkshore', 'silverpine', 'barrens', 'westfall'],
  },
  {
    id: 'waterlogged-crate', name: 'Waterlogged Crate', kind: 'crate',
    contents: ['Bronze Framework', 'Bronze Tube', 'Coarse Blasting Powder', 'Copper Modulator', 'Heavy Blasting Powder'],
    zones: ['ashenvale', 'hillsbrad', 'wetlands'],
  },
  {
    id: 'sealed-crate', name: 'Sealed Crate', kind: 'crate',
    contents: ['Bronze Framework', 'Gyrochronatom', 'Heavy Blasting Powder', 'Iron Strut'],
    zones: ['arathi', 'desolace', 'dustwallow', 'stv', 'swamp-of-sorrows'],
  },
  {
    id: 'heavy-crate', name: 'Heavy Crate', kind: 'crate',
    contents: ['Goblin Rocket Fuel', 'Inlaid Mithril Cylinder', 'Mithril Casing', 'Solid Blasting Powder', 'Zesty Clam Meat'],
    zones: ['azshara', 'feralas', 'tanaris', 'hinterlands'],
  },
  {
    id: 'battered-chest', name: 'Battered Chest', kind: 'trunk',
    contents: ['Bolt of Linen Cloth', 'Light Leather'],
    zones: ['durotar', 'teldrassil'],
  },
  {
    id: 'small-chest', name: 'Small Chest', kind: 'trunk',
    contents: ['Uncommon gear (item level 8-19)', 'Bolt of Linen Cloth', 'Bolt of Woolen Cloth'],
    zones: ['darkshore', 'silverpine', 'barrens', 'westfall'],
  },
  {
    id: 'tightly-sealed-trunk', name: 'Tightly Sealed Trunk', kind: 'trunk',
    contents: [
      'Recipes and uncommon gear (item level 11-20)', 'Leather bags', 'Bolt of Linen Cloth', 'Bolt of Woolen Cloth',
      'Light Leather', 'Medium Leather', 'Lesser Healing Potion', 'Minor Mana Potion',
    ],
    zones: ['darkshore', 'loch-modan', 'silverpine', 'barrens', 'westfall'],
  },
  {
    id: 'watertight-trunk', name: 'Watertight Trunk', kind: 'trunk',
    contents: [
      'Recipes and uncommon gear (item level 21-30)', 'Sacks', 'Bolt of Silk Cloth', 'Bolt of Woolen Cloth',
      'Heavy Leather', 'Medium Leather', 'Healing Potion', 'Lesser Mana Potion',
    ],
    zones: ['ashenvale', 'hillsbrad', 'stonetalon', 'wetlands'],
  },
  {
    id: 'iron-bound-trunk', name: 'Iron Bound Trunk', kind: 'trunk',
    contents: [
      'Recipes and uncommon gear (item level 31-40)', 'Large Knapsack', 'Bolt of Mageweave', 'Bolt of Silk Cloth',
      'Heavy Leather', 'Thick Leather', 'Greater Healing Potion', 'Mana Potion',
    ],
    zones: ['alterac', 'arathi', 'desolace', 'dustwallow', 'stv', 'barrens'],
  },
  {
    id: 'mithril-bound-trunk', name: 'Mithril Bound Trunk', kind: 'trunk',
    contents: [
      'Recipes and uncommon gear (item level 41-50)', "Journeyman's Backpack", 'Troll-hide Bag', 'Bolt of Mageweave',
      'Bolt of Runecloth', 'Rugged Leather', 'Thick Leather', 'Greater Mana Potion', 'Superior Healing Potion',
      'Aquamarine', 'Citrine', 'Star Ruby',
    ],
    zones: ['azshara', 'feralas', 'stv', 'tanaris'],
  },
  {
    id: 'small-locked-chest', name: 'Small Locked Chest', kind: 'locked chest',
    contents: ['Bolt of Silk Cloth', 'Bolt of Woolen Cloth', 'Heavy Leather', 'Medium Leather', 'Moss Agate', 'Battle Slayer', "Sage's Cloak"],
    zones: ['ashenvale', 'hillsbrad', 'wetlands'],
    note: 'Needs lockpicking 1.',
  },
  {
    id: 'sturdy-locked-chest', name: 'Sturdy Locked Chest', kind: 'locked chest',
    contents: ['Uncommon gear (item level 31-40)', 'Large Knapsack', 'Cloth', 'Leather'],
    zones: ['arathi', 'desolace', 'dustwallow', 'stv', 'swamp-of-sorrows'],
    note: 'Needs lockpicking 70.',
  },
  {
    id: 'ironbound-locked-chest', name: 'Ironbound Locked Chest', kind: 'locked chest',
    contents: ['Uncommon gear (item level 41-50)', 'Bolt of Mageweave', 'Bolt of Silk Cloth', 'Heavy Leather', 'Thick Leather'],
    zones: ['azshara', 'feralas', 'tanaris', 'hinterlands'],
    note: 'Needs lockpicking 175.',
  },
  {
    id: 'reinforced-locked-chest', name: 'Reinforced Locked Chest', kind: 'locked chest',
    contents: ['Uncommon gear (item level 51-60)', "Journeyman's Backpack", "Traveler's Backpack", 'Bolt of Mageweave', 'Rugged Leather', 'Thick Leather', 'Star Ruby'],
    zones: ['azshara'],
    note: 'Needs lockpicking 250. Bay of Storms only.',
  },
  {
    id: 'bloated-smallfish', name: 'Bloated Smallfish', kind: 'bloated fish',
    contents: ['Malachite', 'Tigerseye'], withFish: 'smallfish',
  },
  {
    id: 'bloated-mud-snapper', name: 'Bloated Mud Snapper', kind: 'bloated fish',
    contents: ['Malachite', 'Moss Agate', 'Shadowgem', 'Tigerseye'], withFish: 'mud-snapper',
  },
  {
    id: 'bloated-catfish', name: 'Bloated Catfish', kind: 'bloated fish',
    contents: ['Lesser Moonstone', 'Moss Agate', 'Shadowgem', 'Uncommon rings (item level 21-28)'], withFish: 'catfish',
  },
  {
    id: 'bloated-trout', name: 'Bloated Trout', kind: 'bloated fish',
    contents: ['Aquamarine', 'Citrine', 'Jade', 'Lesser Moonstone', 'Amulets and rings (item level 31-40)'], withFish: 'trout',
  },
  {
    id: 'bloated-redgill', name: 'Bloated Redgill', kind: 'bloated fish',
    contents: ['Aquamarine', 'Blue Sapphire', 'Citrine', 'Large Opal', 'Star Ruby', 'Amulets and rings (item level 36-45)'], withFish: 'redgill',
  },
  {
    id: 'bloated-salmon', name: 'Bloated Salmon', kind: 'bloated fish',
    contents: ['Azerothian Diamond', 'Blue Sapphire', 'Huge Emerald', 'Large Opal', 'Star Ruby', 'Rings (item level 52-60)'], withFish: 'sunscale',
  },
  {
    id: 'big-mouth-clam', name: 'Big-mouth Clam', kind: 'other',
    contents: ['Zesty Clam Meat', 'Black Pearl', 'Golden Pearl', 'Iridescent Pearl', 'Small Lustrous Pearl'],
    zones: ['azshara', 'feralas', 'stv', 'tanaris', 'hinterlands'],
  },
]

export const POOLS: Pool[] = [
  {
    id: 'firefin-school', name: 'Firefin Snapper School', loot: ['Firefin Snapper'],
    zones: ['arathi', 'azshara', 'desolace', 'dustwallow', 'feralas', 'hillsbrad', 'stv', 'tanaris', 'wetlands'],
    note: 'Salt water.',
  },
  {
    id: 'blackmouth-school', name: 'Oily Blackmouth School', loot: ['Oily Blackmouth'],
    zones: ['arathi', 'azshara', 'darkshore', 'desolace', 'dustwallow', 'feralas', 'hillsbrad', 'silverpine', 'stv', 'tanaris', 'barrens', 'westfall', 'wetlands'],
    note: 'Salt water.',
  },
  {
    id: 'eel-swarm', name: 'Stonescale Eel Swarm', loot: ['Stonescale Eel'],
    zones: ['azshara', 'feralas', 'stv', 'tanaris'],
    note: 'Salt water.',
  },
  {
    id: 'oil-spill', name: 'Oil Spill', loot: ['Firefin Snapper'],
    zones: ['stonetalon'],
  },
  {
    id: 'deviate-school', name: 'School of Deviate Fish', loot: ['Deviate Fish'],
    zones: ['barrens'], note: 'The oases.',
  },
  {
    id: 'elemental-water', name: 'Patch of Elemental Water', loot: ['Essence of Water', 'Elemental Water', 'Globe of Water'],
    zones: ['azshara'], note: 'Bay of Storms.',
  },
]
