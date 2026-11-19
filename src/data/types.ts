export type Continent = 'kalimdor' | 'eastern-kingdoms'

export interface Fish {
  id: string
  name: string
  /** Short note: what it is used for, or when and where it can be caught. */
  note?: string
}

export interface Zone {
  id: string
  name: string
  /** 'other' for zones not drawn on a continent map (cities, Zephras Isle). */
  continent: Continent | 'other'
  /** Minimum fishing skill (lures included) to cast at all. */
  minSkill: number
  /** Skill at which fish stop getting away. */
  noGetawaySkill: number
  /** True when the skill levels are a guess from the fish caught there. */
  skillEstimated?: boolean
  /** Zone added in WoW Forever. */
  isNew?: boolean
  /** Position on the schematic map, in grid cells within the continent. */
  grid?: { c: number; r: number; w: number; h: number }
  note?: string
}

export interface Container {
  id: string
  name: string
  kind: 'crate' | 'trunk' | 'locked chest' | 'bloated fish' | 'other'
  /** Classic-era contents; not yet confirmed for WoW Forever. */
  contents: string[]
  /** Classic-era zones, used only when there are no Wowhead reports for this container. */
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
