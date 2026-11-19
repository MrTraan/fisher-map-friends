import { CONTINENT_ART, ZONE_POS } from '../data/mapArt'
import { ZONES } from '../data/zones'
import type { Continent } from '../data/types'
import { tierIndex, type MapProps } from './mapShared'

const CONTINENTS: Continent[] = ['kalimdor', 'eastern-kingdoms']

/** Continent artwork with one clickable marker per zone. */
export function ArtMapView({ highlighted, dimOthers, selectedZone, skill, onSelect }: MapProps) {
  return (
    <div className="art-maps">
      {CONTINENTS.map((continent) => {
        const art = CONTINENT_ART[continent]
        const [cx, cy, cw, ch] = art.crop
        // Draw highlighted zones last so their labels sit on top.
        const zones = ZONES.filter((z) => z.continent === continent && ZONE_POS[z.id]).sort(
          (a, b) => Number(highlighted.has(a.id)) - Number(highlighted.has(b.id)),
        )
        return (
          <figure key={continent}>
            <figcaption>{art.name}</figcaption>
            <svg className="map art" viewBox={`${cx} ${cy} ${cw} ${ch}`} role="group" aria-label={`Map of ${art.name}`}>
              <image href={art.src} width={art.width} height={art.height} />
              {zones.map((z) => {
                const [x, y] = ZONE_POS[z.id]
                const locked = skill !== null && skill < z.minSkill
                const hit = highlighted.has(z.id)
                const cls = [
                  'pin',
                  `tier-${tierIndex(z)}`,
                  hit ? 'hit' : dimOthers ? 'dim' : '',
                  selectedZone === z.id ? 'selected' : '',
                  locked ? 'locked' : '',
                ].join(' ')
                // Keep labels inside the picture near the right edge.
                const flip = x > cx + cw - 160
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
                    <circle cx={x} cy={y} r={hit ? 10 : 8} />
                    <text className="pin-label" x={flip ? x - 13 : x + 13} y={y + 4} textAnchor={flip ? 'end' : 'start'}>
                      {z.name}
                      <tspan className="pin-skill"> {locked ? `needs ${z.minSkill}` : `${z.minSkill}/${z.noGetawaySkill}`}</tspan>
                    </text>
                  </g>
                )
              })}
            </svg>
          </figure>
        )
      })}
    </div>
  )
}
