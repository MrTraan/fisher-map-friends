import { ZONES } from '../data/zones'
import { tierIndex, type MapProps } from './mapShared'

const CELL_W = 124
const CELL_H = 62
const GAP = 6
const TOP = 34
const EK_X = 4 * CELL_W + 56
const WIDTH = EK_X + 4 * CELL_W
const HEIGHT = TOP + 8 * CELL_H

/** Schematic fallback map: zones as tiles in roughly their geographic position. */
export function MapView({ highlighted, dimOthers, selectedZone, skill, onSelect }: MapProps) {
  return (
    <svg className="map" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="group" aria-label="Schematic map of Azeroth">
      <text className="continent" x={2 * CELL_W} y={20} textAnchor="middle">Kalimdor</text>
      <text className="continent" x={EK_X + 2 * CELL_W} y={20} textAnchor="middle">Eastern Kingdoms</text>
      {ZONES.map((z) => {
        const x = (z.continent === 'kalimdor' ? 0 : EK_X) + z.grid.c * CELL_W + GAP / 2
        const y = TOP + z.grid.r * CELL_H + GAP / 2
        const w = z.grid.w * CELL_W - GAP
        const h = z.grid.h * CELL_H - GAP
        const locked = skill !== null && skill < z.minSkill
        const cls = [
          'zone',
          `tier-${tierIndex(z)}`,
          highlighted.has(z.id) ? 'hit' : dimOthers ? 'dim' : '',
          selectedZone === z.id ? 'selected' : '',
          locked ? 'locked' : '',
        ].join(' ')
        return (
          <g
            key={z.id}
            className={cls}
            tabIndex={0}
            role="button"
            aria-label={`${z.name}, skill ${z.minSkill} to cast`}
            onClick={() => onSelect(z.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(z.id)
              }
            }}
          >
            <rect x={x} y={y} width={w} height={h} rx={8} />
            <text className="zone-name" x={x + w / 2} y={y + h / 2 - 3} textAnchor="middle">{z.name}</text>
            <text className="zone-skill" x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle">
              {locked ? `needs ${z.minSkill}` : `${z.minSkill} / ${z.noGetawaySkill}`}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
