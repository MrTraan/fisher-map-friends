export type Continent = 'kalimdor' | 'eastern-kingdoms'

/** Where in a zone a catch comes from. */
export type Water = 'fresh' | 'coast' | 'special'

export interface Fish {
  id: string
  name: string
  /** Short note: what it is used for, or when it can be caught. */
  note?: string
}

export interface Catch {
  fish: string
  water: Water
  note?: string
}

export interface Zone {
  id: string
  name: string
  continent: Continent
  /** Minimum fishing skill (lures included) to cast at all. */
  minSkill: number
  /** Skill at which fish stop getting away. */
  noGetawaySkill: number
  /** Position on the schematic map, in grid cells within the continent. */
  grid: { c: number; r: number; w: number; h: number }
  catches: Catch[]
  note?: string
}

export interface Container {
  id: string
  name: string
  kind: 'crate' | 'trunk' | 'locked chest' | 'bloated fish' | 'other'
  contents: string[]
  /** Zones where it is fished up. */
  zones?: string[]
  /** For bloated fish: caught wherever this fish is caught. */
  withFish?: string
  note?: string
}

export interface Pool {
  id: string
  name: string
  loot: string[]
  zones: string[]
  note?: string
}
