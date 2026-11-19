import { CONTAINERS, POOLS } from '../data/containers'
import { FISH } from '../data/fish'
import { CONTAINER_REPORTS, FISH_REPORTS, type Report } from '../data/reports'
import { ZONES } from '../data/zones'
import type { Container, Fish, Zone } from '../data/types'

export type Selection =
  | { type: 'zone'; id: string }
  | { type: 'fish'; id: string }
  | { type: 'container'; id: string }
  | { type: 'loot'; name: string }

export const fishById = new Map<string, Fish>(FISH.map((f) => [f.id, f]))
export const zoneById = new Map<string, Zone>(ZONES.map((z) => [z.id, z]))
export const containerById = new Map<string, Container>(CONTAINERS.map((c) => [c.id, c]))

const zonesFromIds = (ids: string[]) => ids.flatMap((id) => zoneById.get(id) ?? [])

/** Catches Wowhead recorded for a fish in a zone, and all catches recorded there. */
export function fishReports(fishId: string, zoneId: string): Report | undefined {
  return FISH_REPORTS[fishId]?.[zoneId]
}

export function containerReports(containerId: string, zoneId: string): Report | undefined {
  return CONTAINER_REPORTS[containerId]?.[zoneId]
}

/** Zones where a fish has been reported in WoW Forever. Fish with no reports have none. */
export function zonesForFish(fishId: string): Zone[] {
  return zonesFromIds(Object.keys(FISH_REPORTS[fishId] ?? {}))
}

/** Fish reported in a zone, most reported first. */
export function fishForZone(zoneId: string): { fish: Fish; reports: Report }[] {
  return FISH.flatMap((fish) => {
    const reports = fishReports(fish.id, zoneId)
    return reports === undefined ? [] : [{ fish, reports }]
  }).sort((a, b) => b.reports[0] - a.reports[0])
}

export function zonesForContainer(c: Container): Zone[] {
  if (CONTAINER_REPORTS[c.id]) return zonesFromIds(Object.keys(CONTAINER_REPORTS[c.id]))
  if (c.withFish) return zonesForFish(c.withFish)
  return zonesFromIds(c.zones ?? [])
}

export function containersForZone(zoneId: string): Container[] {
  return CONTAINERS.filter((c) => zonesForContainer(c).some((z) => z.id === zoneId))
}

export function poolsForZone(zoneId: string) {
  return POOLS.filter((p) => p.zones.includes(zoneId))
}

/** Containers and pools that can yield a given loot item. */
export function sourcesForLoot(name: string) {
  return {
    containers: CONTAINERS.filter((c) => c.contents.includes(name)),
    pools: POOLS.filter((p) => p.loot.includes(name)),
  }
}

export function zonesForSelection(sel: Selection | null): Set<string> {
  if (!sel) return new Set()
  switch (sel.type) {
    case 'zone':
      return new Set([sel.id])
    case 'fish':
      return new Set(zonesForFish(sel.id).map((z) => z.id))
    case 'container': {
      const c = containerById.get(sel.id)
      return new Set(c ? zonesForContainer(c).map((z) => z.id) : [])
    }
    case 'loot': {
      const { containers, pools } = sourcesForLoot(sel.name)
      return new Set([
        ...containers.flatMap((c) => zonesForContainer(c).map((z) => z.id)),
        ...pools.flatMap((p) => p.zones),
      ])
    }
  }
}

export interface SearchEntry {
  label: string
  kind: 'Fish' | 'Crate or chest' | 'Loot' | 'Zone'
  selection: Selection
}

const fishNames = new Set(FISH.map((f) => f.name))
const lootNames = [
  ...new Set([...CONTAINERS.flatMap((c) => c.contents), ...POOLS.flatMap((p) => p.loot)]),
].filter((n) => !fishNames.has(n))

const ENTRIES: SearchEntry[] = [
  ...FISH.map((f): SearchEntry => ({ label: f.name, kind: 'Fish', selection: { type: 'fish', id: f.id } })),
  ...CONTAINERS.filter((c) => !fishNames.has(c.name)).map(
    (c): SearchEntry => ({ label: c.name, kind: 'Crate or chest', selection: { type: 'container', id: c.id } }),
  ),
  ...lootNames.map((n): SearchEntry => ({ label: n, kind: 'Loot', selection: { type: 'loot', name: n } })),
  ...ZONES.map((z): SearchEntry => ({ label: z.name, kind: 'Zone', selection: { type: 'zone', id: z.id } })),
]

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '')

export function search(query: string, limit = 12): SearchEntry[] {
  const words = norm(query).split(' ').filter(Boolean)
  if (words.length === 0) return []
  return ENTRIES.map((e) => {
    const label = norm(e.label)
    if (!words.every((w) => label.includes(w))) return null
    // Prefer matches at the start of the name, then at the start of a word.
    const score = label.startsWith(words[0]) ? 0 : label.includes(' ' + words[0]) ? 1 : 2
    return { e, score }
  })
    .filter((x) => x !== null)
    // On a tie, fish come first: "redgill" should find Raw Redgill before Bloated Redgill.
    .sort(
      (a, b) =>
        a.score - b.score ||
        Number(b.e.kind === 'Fish') - Number(a.e.kind === 'Fish') ||
        a.e.label.localeCompare(b.e.label),
    )
    .slice(0, limit)
    .map((x) => x.e)
}
