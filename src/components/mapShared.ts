import type { Zone } from '../data/types'

export const TIERS = [25, 75, 150, 225, 300, 425]

export function tierIndex(z: Zone) {
  const i = TIERS.indexOf(z.noGetawaySkill)
  return i === -1 ? TIERS.length - 1 : i
}

export interface MapProps {
  highlighted: Set<string>
  /** True when the highlight comes from a fish or item, so other zones are dimmed. */
  dimOthers: boolean
  selectedZone: string | null
  skill: number | null
  onSelect: (zoneId: string) => void
}
