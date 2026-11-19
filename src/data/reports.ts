// Catch reports from Wowhead's WoW Forever database ("Fishing Locations" on each item page),
// collected on 2026-11-19. The number is how many catches Wowhead recorded in that zone.
// It shows where a fish is common; it is not a drop rate. Counts below 2 are left out.

type Reports = Record<string, Record<string, number>>

/** fish id -> zone id -> number of reported catches */
export const FISH_REPORTS: Reports = {
  smallfish: {
    elwynn: 151, stormwind: 127, mulgore: 90, tirisfal: 53, durotar: 48, orgrimmar: 45, teldrassil: 45,
    darnassus: 39, darkshore: 36, zephras: 34, barrens: 30, 'thunder-bluff': 25, ironforge: 22, undercity: 22,
    silverpine: 19, westfall: 16, 'dun-morogh': 14, 'loch-modan': 14, duskwood: 10,
  },
  albacore: {
    wetlands: 99, westfall: 63, hillsbrad: 56, darkshore: 50, barrens: 39, ashenvale: 34, silverpine: 34, stormwind: 16,
  },
  'loch-frenzy': { 'loch-modan': 28 },
  deviate: { barrens: 22 },
  sagefish: { hillsbrad: 62, ashenvale: 40, 'loch-modan': 39, silverpine: 26, stonetalon: 12 },
  'greater-sagefish': { alterac: 54, stv: 50, riverglades: 30 },
  blackmouth: {
    stv: 171, 'western-plaguelands': 155, moonglade: 129, dustwallow: 127, feralas: 99, wetlands: 97, darkshore: 87,
    hillsbrad: 75, westfall: 65, azshara: 62, tanaris: 53, hinterlands: 45, silverpine: 36, desolace: 35, barrens: 33,
    ashenvale: 18, arathi: 17, 'swamp-of-sorrows': 17, ungoro: 17, felwood: 16, stormwind: 16, riverglades: 12,
    'eastern-plaguelands': 2,
  },
  firefin: {
    stv: 190, azshara: 157, dustwallow: 130, wetlands: 85, tanaris: 82, feralas: 75, hillsbrad: 59, desolace: 34,
    hinterlands: 34, stonetalon: 31, riverglades: 17, 'swamp-of-sorrows': 16, arathi: 15, ashenvale: 11,
    'mount-hyjal': 9, barrens: 5,
  },
  eel: { azshara: 265, stv: 88, tanaris: 83, feralas: 77, hinterlands: 26, riverglades: 20, 'eastern-plaguelands': 6 },
  trout: {
    'western-plaguelands': 161, dustwallow: 133, moonglade: 125, alterac: 91, stv: 84, arathi: 65, feralas: 64,
    hinterlands: 44, desolace: 40, 'swamp-of-sorrows': 35, azshara: 21, riverglades: 21, 'thousand-needles': 20,
    ungoro: 17, felwood: 15, ashenvale: 7, 'eastern-plaguelands': 3, hillsbrad: 2,
  },
  redgill: {
    'western-plaguelands': 240, moonglade: 198, feralas: 94, hinterlands: 93, ungoro: 57, felwood: 45, azshara: 34,
    'deadwind-pass': 17, 'eastern-plaguelands': 10, winterspring: 10, 'mount-hyjal': 9, ashenvale: 5, silithus: 2,
  },
  nightfin: {
    'western-plaguelands': 194, moonglade: 158, feralas: 86, hinterlands: 64, 'eastern-plaguelands': 44, ungoro: 27,
    azshara: 25, felwood: 22, 'deadwind-pass': 20, 'mount-hyjal': 13, winterspring: 12, ashenvale: 3, silithus: 2,
  },
  sunscale: {
    'western-plaguelands': 138, moonglade: 110, feralas: 68, hinterlands: 42, 'eastern-plaguelands': 36, azshara: 23,
    felwood: 20, ungoro: 17, 'deadwind-pass': 16, winterspring: 11, 'mount-hyjal': 8, ashenvale: 6, silithus: 4,
  },
  whitescale: { 'eastern-plaguelands': 61, 'deadwind-pass': 28, feralas: 19, winterspring: 13, 'mount-hyjal': 8, silithus: 4 },
  mightfish: { azshara: 139, tanaris: 54, feralas: 51, hinterlands: 33, stv: 13 },
  'large-mightfish': { azshara: 116, 'eastern-plaguelands': 7 },
  'winter-squid': { azshara: 255, tanaris: 50, feralas: 42, hinterlands: 29, stv: 17 },
  lobster: { azshara: 143, 'eastern-plaguelands': 6 },
  'lightning-eel': {
    feralas: 39, 'western-plaguelands': 29, 'eastern-plaguelands': 28, hinterlands: 19, ungoro: 18, felwood: 16,
    moonglade: 14, 'deadwind-pass': 13, azshara: 12, winterspring: 12, 'mount-hyjal': 7, ashenvale: 4, silithus: 4,
  },
  armorfish: { 'eastern-plaguelands': 40, 'deadwind-pass': 17, feralas: 14, winterspring: 12, 'mount-hyjal': 9, silithus: 5 },
  clam: { azshara: 238, tanaris: 57, feralas: 45, hinterlands: 30, stv: 16, 'eastern-plaguelands': 6 },
  ahi: { feralas: 9 },
  mahi: { 'swamp-of-sorrows': 191 },
  striker: { desolace: 15 },
  sailfin: { stv: 20 },
  tastyfish: { stv: 172 },
}

// Wowhead's Forever pages for these six fish show no fishing locations.
// Their zones below are the Classic-era ones and are not confirmed for Forever.
export const CLASSIC_FISH_ZONES: Record<string, string[]> = {
  'mud-snapper': [
    'teldrassil', 'darkshore', 'ashenvale', 'stonetalon', 'barrens', 'durotar', 'mulgore', 'tirisfal', 'silverpine',
    'hillsbrad', 'wetlands', 'dun-morogh', 'loch-modan', 'westfall', 'elwynn', 'redridge', 'duskwood',
  ],
  mackerel: ['teldrassil', 'durotar', 'tirisfal', 'darkshore', 'barrens', 'silverpine', 'westfall'],
  catfish: [
    'darkshore', 'barrens', 'silverpine', 'loch-modan', 'westfall', 'ashenvale', 'stonetalon', 'hillsbrad', 'wetlands',
    'redridge', 'duskwood', 'dustwallow', 'thousand-needles', 'alterac', 'arathi', 'swamp-of-sorrows', 'stv',
  ],
  cod: ['desolace', 'dustwallow', 'arathi', 'swamp-of-sorrows', 'stv', 'azshara', 'feralas', 'tanaris', 'hinterlands'],
  yellowtail: ['desolace', 'dustwallow', 'arathi', 'swamp-of-sorrows', 'stv', 'azshara', 'feralas', 'tanaris', 'hinterlands'],
  'summer-bass': ['azshara', 'feralas', 'tanaris', 'hinterlands', 'stv'],
}

/** container id -> zone id -> number of reported catches */
export const CONTAINER_REPORTS: Reports = {
  'message-in-a-bottle': {
    wetlands: 70, darkshore: 52, hillsbrad: 41, westfall: 39, barrens: 25, silverpine: 24, ashenvale: 20, stormwind: 12,
  },
  'dented-crate': { darkshore: 50, westfall: 39, barrens: 28, silverpine: 22 },
  'waterlogged-crate': { wetlands: 72, hillsbrad: 36, ashenvale: 19 },
  'sealed-crate': { desolace: 24, riverglades: 17, arathi: 13, stv: 12, 'swamp-of-sorrows': 12, dustwallow: 11 },
  'heavy-crate': { azshara: 33, hinterlands: 18, feralas: 16, stv: 14, tanaris: 12 },
  'small-chest': { silverpine: 23, stormwind: 16, westfall: 14, darkshore: 12, barrens: 12 },
  'small-locked-chest': { wetlands: 73, hillsbrad: 33, ashenvale: 20 },
  'sturdy-locked-chest': { desolace: 23, 'swamp-of-sorrows': 16, dustwallow: 14, arathi: 13, riverglades: 11, stv: 11 },
  'battered-chest': { durotar: 29, teldrassil: 11, tirisfal: 11 },
  'ironbound-locked-chest': { feralas: 17, stv: 17, hinterlands: 17, azshara: 13, tanaris: 12 },
  'watertight-trunk': { hillsbrad: 57, wetlands: 39, stonetalon: 32, ashenvale: 23 },
  'iron-bound-trunk': { stv: 90, dustwallow: 34, riverglades: 29, alterac: 27, desolace: 27, arathi: 9, barrens: 5 },
  'mithril-bound-trunk': { stv: 79, tanaris: 49, azshara: 42, feralas: 39, riverglades: 24 },
  'tightly-sealed-trunk': { darkshore: 43, barrens: 41, westfall: 34, 'loch-modan': 30, silverpine: 20, redridge: 17 },
}
