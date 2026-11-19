import type { Zone } from './types'

// Which fish and crates each zone gives comes from src/data/reports.ts.
// Skill levels are the Classic-era values, which WoW Forever guides also use; no source
// confirms them for Forever yet. Zones new in Forever have estimated skill levels.

const K = 'kalimdor' as const
const E = 'eastern-kingdoms' as const
const O = 'other' as const

export const ZONES: Zone[] = [
  // Kalimdor
  { id: 'teldrassil', name: 'Teldrassil', continent: K, minSkill: 1, noGetawaySkill: 25, grid: { c: 0, r: 0, w: 1, h: 1 } },
  { id: 'moonglade', name: 'Moonglade', continent: K, minSkill: 205, noGetawaySkill: 300, grid: { c: 1, r: 0, w: 1, h: 1 } },
  { id: 'winterspring', name: 'Winterspring', continent: K, minSkill: 330, noGetawaySkill: 425, grid: { c: 2, r: 0, w: 2, h: 1 } },
  { id: 'darkshore', name: 'Darkshore', continent: K, minSkill: 1, noGetawaySkill: 75, grid: { c: 0, r: 1, w: 1, h: 1 } },
  { id: 'felwood', name: 'Felwood', continent: K, minSkill: 205, noGetawaySkill: 300, grid: { c: 1, r: 1, w: 1, h: 1 } },
  {
    id: 'azshara', name: 'Azshara', continent: K, minSkill: 205, noGetawaySkill: 300, grid: { c: 2, r: 1, w: 2, h: 1 },
    note: 'The Bay of Storms is a harder sub-area (Classic: 330 to cast, 425 for no getaways). Large Raw Mightfish and Darkclaw Lobster come from there.',
  },
  { id: 'ashenvale', name: 'Ashenvale', continent: K, minSkill: 55, noGetawaySkill: 150, grid: { c: 0, r: 2, w: 3, h: 1 } },
  {
    id: 'mount-hyjal', name: 'Mount Hyjal', continent: K, minSkill: 330, noGetawaySkill: 425, grid: { c: 3, r: 2, w: 1, h: 1 },
    isNew: true, skillEstimated: true,
  },
  { id: 'stonetalon', name: 'Stonetalon Mountains', continent: K, minSkill: 55, noGetawaySkill: 150, grid: { c: 0, r: 3, w: 2, h: 1 } },
  { id: 'barrens', name: 'The Barrens', continent: K, minSkill: 1, noGetawaySkill: 75, grid: { c: 2, r: 3, w: 1, h: 2 } },
  { id: 'durotar', name: 'Durotar', continent: K, minSkill: 1, noGetawaySkill: 25, grid: { c: 3, r: 3, w: 1, h: 1 } },
  { id: 'desolace', name: 'Desolace', continent: K, minSkill: 130, noGetawaySkill: 225, grid: { c: 0, r: 4, w: 1, h: 1 } },
  { id: 'mulgore', name: 'Mulgore', continent: K, minSkill: 1, noGetawaySkill: 25, grid: { c: 1, r: 4, w: 1, h: 1 } },
  { id: 'dustwallow', name: 'Dustwallow Marsh', continent: K, minSkill: 130, noGetawaySkill: 225, grid: { c: 3, r: 4, w: 1, h: 1 } },
  { id: 'feralas', name: 'Feralas', continent: K, minSkill: 205, noGetawaySkill: 300, grid: { c: 0, r: 5, w: 2, h: 1 } },
  { id: 'thousand-needles', name: 'Thousand Needles', continent: K, minSkill: 130, noGetawaySkill: 225, grid: { c: 2, r: 5, w: 2, h: 1 } },
  { id: 'silithus', name: 'Silithus', continent: K, minSkill: 330, noGetawaySkill: 425, grid: { c: 0, r: 6, w: 1, h: 1 } },
  { id: 'ungoro', name: "Un'Goro Crater", continent: K, minSkill: 205, noGetawaySkill: 300, grid: { c: 1, r: 6, w: 1, h: 1 } },
  { id: 'tanaris', name: 'Tanaris', continent: K, minSkill: 205, noGetawaySkill: 300, grid: { c: 2, r: 6, w: 2, h: 1 } },

  // Eastern Kingdoms
  { id: 'tirisfal', name: 'Tirisfal Glades', continent: E, minSkill: 1, noGetawaySkill: 25, grid: { c: 0, r: 0, w: 2, h: 1 } },
  { id: 'western-plaguelands', name: 'Western Plaguelands', continent: E, minSkill: 205, noGetawaySkill: 300, grid: { c: 2, r: 0, w: 1, h: 1 } },
  { id: 'eastern-plaguelands', name: 'Eastern Plaguelands', continent: E, minSkill: 330, noGetawaySkill: 425, grid: { c: 3, r: 0, w: 1, h: 1 } },
  { id: 'silverpine', name: 'Silverpine Forest', continent: E, minSkill: 1, noGetawaySkill: 75, grid: { c: 0, r: 1, w: 1, h: 1 } },
  { id: 'alterac', name: 'Alterac Mountains', continent: E, minSkill: 130, noGetawaySkill: 225, grid: { c: 1, r: 1, w: 1, h: 1 } },
  { id: 'hinterlands', name: 'The Hinterlands', continent: E, minSkill: 205, noGetawaySkill: 300, grid: { c: 2, r: 1, w: 2, h: 1 } },
  { id: 'hillsbrad', name: 'Hillsbrad Foothills', continent: E, minSkill: 55, noGetawaySkill: 150, grid: { c: 0, r: 2, w: 2, h: 1 } },
  { id: 'arathi', name: 'Arathi Highlands', continent: E, minSkill: 130, noGetawaySkill: 225, grid: { c: 2, r: 2, w: 2, h: 1 } },
  { id: 'wetlands', name: 'Wetlands', continent: E, minSkill: 55, noGetawaySkill: 150, grid: { c: 1, r: 3, w: 3, h: 1 } },
  { id: 'dun-morogh', name: 'Dun Morogh', continent: E, minSkill: 1, noGetawaySkill: 25, grid: { c: 0, r: 4, w: 2, h: 1 } },
  { id: 'loch-modan', name: 'Loch Modan', continent: E, minSkill: 1, noGetawaySkill: 75, grid: { c: 2, r: 4, w: 2, h: 1 } },
  { id: 'westfall', name: 'Westfall', continent: E, minSkill: 1, noGetawaySkill: 75, grid: { c: 0, r: 5, w: 1, h: 1 } },
  { id: 'elwynn', name: 'Elwynn Forest', continent: E, minSkill: 1, noGetawaySkill: 25, grid: { c: 1, r: 5, w: 1, h: 1 } },
  { id: 'redridge', name: 'Redridge Mountains', continent: E, minSkill: 55, noGetawaySkill: 150, grid: { c: 2, r: 5, w: 1, h: 1 } },
  {
    id: 'riverglades', name: 'Riverglades', continent: E, minSkill: 130, noGetawaySkill: 225, grid: { c: 3, r: 5, w: 1, h: 1 },
    isNew: true, skillEstimated: true,
    note: 'New level 35-45 zone east of the Badlands and Burning Steppes.',
  },
  { id: 'duskwood', name: 'Duskwood', continent: E, minSkill: 55, noGetawaySkill: 150, grid: { c: 1, r: 6, w: 1, h: 1 } },
  { id: 'swamp-of-sorrows', name: 'Swamp of Sorrows', continent: E, minSkill: 130, noGetawaySkill: 225, grid: { c: 2, r: 6, w: 2, h: 1 } },
  {
    id: 'stv', name: 'Stranglethorn Vale', continent: E, minSkill: 130, noGetawaySkill: 225, grid: { c: 0, r: 7, w: 2, h: 1 },
    note: 'The southern coast (Wild Shore, Jaguero Isle) is harder (Classic: 205 to cast, 300 for no getaways).',
  },
  { id: 'deadwind-pass', name: 'Deadwind Pass', continent: E, minSkill: 330, noGetawaySkill: 425, grid: { c: 2, r: 7, w: 1, h: 1 } },

  // Not on the continent maps
  {
    id: 'zephras', name: 'Zephras Isle', continent: O, minSkill: 1, noGetawaySkill: 25, isNew: true, skillEstimated: true,
    note: 'New level 1-12 starting zone, a flying island reached by airship.',
  },
  { id: 'stormwind', name: 'Stormwind City', continent: O, minSkill: 1, noGetawaySkill: 75 },
  { id: 'ironforge', name: 'Ironforge', continent: O, minSkill: 1, noGetawaySkill: 75 },
  { id: 'darnassus', name: 'Darnassus', continent: O, minSkill: 1, noGetawaySkill: 75 },
  { id: 'orgrimmar', name: 'Orgrimmar', continent: O, minSkill: 1, noGetawaySkill: 75 },
  { id: 'thunder-bluff', name: 'Thunder Bluff', continent: O, minSkill: 1, noGetawaySkill: 75 },
  { id: 'undercity', name: 'Undercity', continent: O, minSkill: 1, noGetawaySkill: 75 },
]
