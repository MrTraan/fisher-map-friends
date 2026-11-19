import type { Catch, Water, Zone } from './types'

// Baseline: Classic-era zones, skill levels and open-water catches.
// WoW Forever changes (new fish, new zones such as Riverglades) still need adding.

const of = (water: Water, ...fish: string[]): Catch[] => fish.map((f) => ({ fish: f, water }))

// Typical open-water tables per skill tier.
const FRESH = {
  25: of('fresh', 'smallfish', 'mud-snapper'),
  75: of('fresh', 'smallfish', 'mud-snapper', 'catfish'),
  150: of('fresh', 'mud-snapper', 'catfish', 'sagefish'),
  225: of('fresh', 'catfish', 'trout', 'greater-sagefish'),
  300: of('fresh', 'trout', 'redgill', 'nightfin', 'sunscale'),
  425: of('fresh', 'redgill', 'nightfin', 'sunscale', 'whitescale', 'lightning-eel', 'armorfish'),
}
const COAST = {
  25: of('coast', 'mackerel', 'mud-snapper'),
  75: of('coast', 'mackerel', 'albacore', 'blackmouth'),
  150: of('coast', 'albacore', 'blackmouth', 'firefin'),
  225: of('coast', 'firefin', 'blackmouth', 'cod', 'yellowtail'),
  300: of('coast', 'yellowtail', 'cod', 'mightfish', 'eel', 'summer-bass', 'winter-squid', 'clam'),
}

const special = (fish: string, note: string): Catch => ({ fish, water: 'special', note })

const K = 'kalimdor' as const
const E = 'eastern-kingdoms' as const

export const ZONES: Zone[] = [
  // Kalimdor
  { id: 'teldrassil', name: 'Teldrassil', continent: K, minSkill: 1, noGetawaySkill: 25, grid: { c: 0, r: 0, w: 1, h: 1 }, catches: [...FRESH[25], ...COAST[25]] },
  { id: 'moonglade', name: 'Moonglade', continent: K, minSkill: 205, noGetawaySkill: 300, grid: { c: 1, r: 0, w: 1, h: 1 }, catches: [...FRESH[300]] },
  { id: 'winterspring', name: 'Winterspring', continent: K, minSkill: 330, noGetawaySkill: 425, grid: { c: 2, r: 0, w: 2, h: 1 }, catches: [...FRESH[425]] },
  { id: 'darkshore', name: 'Darkshore', continent: K, minSkill: 1, noGetawaySkill: 75, grid: { c: 0, r: 1, w: 1, h: 1 }, catches: [...FRESH[75], ...COAST[75]] },
  { id: 'felwood', name: 'Felwood', continent: K, minSkill: 205, noGetawaySkill: 300, grid: { c: 1, r: 1, w: 1, h: 1 }, catches: [...FRESH[300]] },
  {
    id: 'azshara', name: 'Azshara', continent: K, minSkill: 205, noGetawaySkill: 300, grid: { c: 2, r: 1, w: 2, h: 1 },
    catches: [
      ...FRESH[300], ...COAST[300],
      special('large-mightfish', 'Bay of Storms (skill 330 to cast, 425 for no getaways).'),
      special('lobster', 'Bay of Storms (skill 330 to cast, 425 for no getaways).'),
    ],
    note: 'The Bay of Storms is a harder sub-area: 330 to cast, 425 for no getaways.',
  },
  { id: 'ashenvale', name: 'Ashenvale', continent: K, minSkill: 55, noGetawaySkill: 150, grid: { c: 0, r: 2, w: 3, h: 1 }, catches: [...FRESH[150], ...COAST[150]] },
  { id: 'stonetalon', name: 'Stonetalon Mountains', continent: K, minSkill: 55, noGetawaySkill: 150, grid: { c: 0, r: 3, w: 2, h: 1 }, catches: [...FRESH[150]] },
  {
    id: 'barrens', name: 'The Barrens', continent: K, minSkill: 1, noGetawaySkill: 75, grid: { c: 2, r: 3, w: 1, h: 2 },
    catches: [...FRESH[75], ...COAST[75], special('deviate', 'The oases and Wailing Caverns.')],
  },
  { id: 'durotar', name: 'Durotar', continent: K, minSkill: 1, noGetawaySkill: 25, grid: { c: 3, r: 3, w: 1, h: 1 }, catches: [...FRESH[25], ...COAST[25]] },
  {
    id: 'desolace', name: 'Desolace', continent: K, minSkill: 130, noGetawaySkill: 225, grid: { c: 0, r: 4, w: 1, h: 1 },
    catches: [...COAST[225], special('striker', "Sar'theris Strand.")],
  },
  { id: 'mulgore', name: 'Mulgore', continent: K, minSkill: 1, noGetawaySkill: 25, grid: { c: 1, r: 4, w: 1, h: 1 }, catches: [...FRESH[25]] },
  { id: 'dustwallow', name: 'Dustwallow Marsh', continent: K, minSkill: 130, noGetawaySkill: 225, grid: { c: 3, r: 4, w: 1, h: 1 }, catches: [...FRESH[225], ...COAST[225]] },
  {
    id: 'feralas', name: 'Feralas', continent: K, minSkill: 205, noGetawaySkill: 300, grid: { c: 0, r: 5, w: 2, h: 1 },
    catches: [...FRESH[300], ...COAST[300], special('ahi', 'Verdantis River.')],
  },
  { id: 'thousand-needles', name: 'Thousand Needles', continent: K, minSkill: 130, noGetawaySkill: 225, grid: { c: 2, r: 5, w: 2, h: 1 }, catches: [...FRESH[225]] },
  { id: 'silithus', name: 'Silithus', continent: K, minSkill: 330, noGetawaySkill: 425, grid: { c: 0, r: 6, w: 1, h: 1 }, catches: [...FRESH[425]] },
  { id: 'ungoro', name: "Un'Goro Crater", continent: K, minSkill: 205, noGetawaySkill: 300, grid: { c: 1, r: 6, w: 1, h: 1 }, catches: [...FRESH[300]] },
  { id: 'tanaris', name: 'Tanaris', continent: K, minSkill: 205, noGetawaySkill: 300, grid: { c: 2, r: 6, w: 2, h: 1 }, catches: [...COAST[300], ...of('coast', 'firefin', 'blackmouth')] },

  // Eastern Kingdoms
  { id: 'tirisfal', name: 'Tirisfal Glades', continent: E, minSkill: 1, noGetawaySkill: 25, grid: { c: 0, r: 0, w: 2, h: 1 }, catches: [...FRESH[25], ...COAST[25]] },
  { id: 'western-plaguelands', name: 'Western Plaguelands', continent: E, minSkill: 205, noGetawaySkill: 300, grid: { c: 2, r: 0, w: 1, h: 1 }, catches: [...FRESH[300]] },
  { id: 'eastern-plaguelands', name: 'Eastern Plaguelands', continent: E, minSkill: 330, noGetawaySkill: 425, grid: { c: 3, r: 0, w: 1, h: 1 }, catches: [...FRESH[425]] },
  { id: 'silverpine', name: 'Silverpine Forest', continent: E, minSkill: 1, noGetawaySkill: 75, grid: { c: 0, r: 1, w: 1, h: 1 }, catches: [...FRESH[75], ...COAST[75]] },
  { id: 'alterac', name: 'Alterac Mountains', continent: E, minSkill: 130, noGetawaySkill: 225, grid: { c: 1, r: 1, w: 1, h: 1 }, catches: [...FRESH[225]] },
  { id: 'hinterlands', name: 'The Hinterlands', continent: E, minSkill: 205, noGetawaySkill: 300, grid: { c: 2, r: 1, w: 2, h: 1 }, catches: [...FRESH[300], ...COAST[300]] },
  { id: 'hillsbrad', name: 'Hillsbrad Foothills', continent: E, minSkill: 55, noGetawaySkill: 150, grid: { c: 0, r: 2, w: 2, h: 1 }, catches: [...FRESH[150], ...COAST[150]] },
  { id: 'arathi', name: 'Arathi Highlands', continent: E, minSkill: 130, noGetawaySkill: 225, grid: { c: 2, r: 2, w: 2, h: 1 }, catches: [...FRESH[225], ...COAST[225]] },
  { id: 'wetlands', name: 'Wetlands', continent: E, minSkill: 55, noGetawaySkill: 150, grid: { c: 1, r: 3, w: 3, h: 1 }, catches: [...FRESH[150], ...COAST[150]] },
  { id: 'dun-morogh', name: 'Dun Morogh', continent: E, minSkill: 1, noGetawaySkill: 25, grid: { c: 0, r: 4, w: 2, h: 1 }, catches: [...FRESH[25]] },
  {
    id: 'loch-modan', name: 'Loch Modan', continent: E, minSkill: 1, noGetawaySkill: 75, grid: { c: 2, r: 4, w: 2, h: 1 },
    catches: [...FRESH[75], ...of('fresh', 'loch-frenzy')],
  },
  { id: 'westfall', name: 'Westfall', continent: E, minSkill: 1, noGetawaySkill: 75, grid: { c: 0, r: 5, w: 1, h: 1 }, catches: [...FRESH[75], ...COAST[75]] },
  { id: 'elwynn', name: 'Elwynn Forest', continent: E, minSkill: 1, noGetawaySkill: 25, grid: { c: 1, r: 5, w: 1, h: 1 }, catches: [...FRESH[25]] },
  { id: 'redridge', name: 'Redridge Mountains', continent: E, minSkill: 55, noGetawaySkill: 150, grid: { c: 2, r: 5, w: 2, h: 1 }, catches: [...FRESH[150]] },
  { id: 'duskwood', name: 'Duskwood', continent: E, minSkill: 55, noGetawaySkill: 150, grid: { c: 1, r: 6, w: 1, h: 1 }, catches: [...FRESH[150]] },
  {
    id: 'swamp-of-sorrows', name: 'Swamp of Sorrows', continent: E, minSkill: 130, noGetawaySkill: 225, grid: { c: 2, r: 6, w: 2, h: 1 },
    catches: [...FRESH[225], ...COAST[225], special('mahi', 'Misty Reed Strand.')],
  },
  {
    id: 'stv', name: 'Stranglethorn Vale', continent: E, minSkill: 130, noGetawaySkill: 225, grid: { c: 0, r: 7, w: 2, h: 1 },
    catches: [
      ...FRESH[225], ...COAST[225],
      ...of('coast', 'eel', 'mightfish', 'summer-bass', 'winter-squid'),
      special('sailfin', 'Savage Coast.'),
      special('tastyfish', 'Pools, during the Sunday Fishing Extravaganza.'),
    ],
    note: 'The southern coast (Wild Shore, Jaguero Isle) is harder: 205 to cast, 300 for no getaways.',
  },
]
