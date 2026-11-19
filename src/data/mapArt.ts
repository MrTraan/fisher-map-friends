import type { Continent } from './types'

// Continent artwork lives in public/maps/ — see public/maps/README.md for sources.

export interface ContinentArt {
  name: string
  src: string
  /** Full image size in pixels. */
  width: number
  height: number
  /** The part of the image that holds the landmass: x, y, width, height. */
  crop: [number, number, number, number]
}

export const CONTINENT_ART: Record<Continent, ContinentArt> = {
  kalimdor: { name: 'Kalimdor', src: '/maps/kalimdor.jpg', width: 1002, height: 668, crop: [330, 20, 390, 650] },
  'eastern-kingdoms': { name: 'Eastern Kingdoms', src: '/maps/eastern-kingdoms.jpg', width: 1002, height: 668, crop: [345, 0, 390, 650] },
}

/** Marker position of each zone, in pixels of its continent image. Placed by eye. */
export const ZONE_POS: Record<string, [number, number]> = {
  // Kalimdor
  teldrassil: [424, 78],
  moonglade: [539, 139],
  winterspring: [599, 157],
  darkshore: [469, 193],
  felwood: [511, 180],
  azshara: [623, 251],
  ashenvale: [514, 270],
  stonetalon: [437, 302],
  barrens: [527, 360],
  durotar: [580, 353],
  desolace: [418, 379],
  mulgore: [475, 411],
  dustwallow: [552, 443],
  feralas: [431, 468],
  'thousand-needles': [507, 494],
  silithus: [431, 571],
  ungoro: [495, 564],
  tanaris: [552, 571],
  'mount-hyjal': [526, 223],

  // Eastern Kingdoms
  tirisfal: [443, 148],
  'western-plaguelands': [504, 142],
  'eastern-plaguelands': [578, 148],
  silverpine: [409, 238],
  alterac: [469, 193],
  hillsbrad: [463, 221],
  hinterlands: [559, 203],
  arathi: [537, 247],
  wetlands: [533, 315],
  'dun-morogh': [463, 353],
  'loch-modan': [571, 360],
  elwynn: [469, 468],
  redridge: [537, 472],
  westfall: [418, 513],
  duskwood: [473, 513],
  'swamp-of-sorrows': [552, 507],
  stv: [469, 577],
  'deadwind-pass': [513, 498],
  riverglades: [603, 434],
}
