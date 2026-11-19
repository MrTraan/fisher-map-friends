import { CONTINENT_ART, ZONE_POS } from '../data/mapArt'
import { ZONE_GLOWS, glowUrl } from '../data/zoneGlows'
import { ZONE_SHAPES } from '../data/zoneShapes'
import { ZONES } from '../data/zones'
import type { Continent } from '../data/types'
import { tierIndex, type MapProps } from './mapShared'

const CONTINENTS: Continent[] = ['kalimdor', 'eastern-kingdoms']

export type MapMode = 'glow' | 'shapes' | 'dots'

/**
 * Continent artwork with every zone clickable, drawn as the game's own soft highlight
 * ('glow'), as a traced outline filled with colour ('shapes') or as one marker ('dots').
 */
export function ArtMapView({ mode, highlighted, dimOthers, selectedZone, skill, onSelect }: MapProps & { mode: MapMode }) {
  return (
    <div className="art-maps">
      {CONTINENTS.map((continent) => {
        const art = CONTINENT_ART[continent]
        const [cx, cy, cw, ch] = art.crop
        // Draw highlighted zones last so their outlines and labels sit on top.
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
                // A zone the tracing script found no outline for falls back to a marker.
                const shape = mode === 'dots' ? undefined : ZONE_SHAPES[z.id]
                const glow = mode === 'glow' && shape ? ZONE_GLOWS[z.id] : undefined
                const cls = [
                  glow ? 'glow' : shape ? 'shape' : 'pin',
                  `tier-${tierIndex(z)}`,
                  hit ? 'hit' : dimOthers ? 'dim' : '',
                  selectedZone === z.id ? 'selected' : '',
                  locked ? 'locked' : '',
                ].join(' ')
                const skillLabel = locked ? `needs ${z.minSkill}` : `${z.minSkill}/${z.noGetawaySkill}`
                // Keep marker labels inside the picture near the right edge.
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
                    {shape ? (
                      <>
                        {glow && (
                          <>
                            <mask id={`glow-${z.id}`} maskUnits="userSpaceOnUse" x={glow[0]} y={glow[1]} width={glow[2]} height={glow[3]}>
                              <image href={glowUrl(z.id)} x={glow[0]} y={glow[1]} width={glow[2]} height={glow[3]} preserveAspectRatio="none" />
                            </mask>
                            <rect x={glow[0]} y={glow[1]} width={glow[2]} height={glow[3]} mask={`url(#glow-${z.id})`} />
                          </>
                        )}
                        {/* In glow mode the traced outline is invisible and only catches the mouse. */}
                        <path d={shape} fillRule="evenodd" />
                        <text className="pin-label" x={x} y={y + 4} textAnchor="middle">
                          {z.name}
                          <tspan className="pin-skill" x={x} dy={12}>{skillLabel}</tspan>
                        </text>
                      </>
                    ) : (
                      <>
                        <circle cx={x} cy={y} r={hit ? 10 : 8} />
                        <text className="pin-label" x={flip ? x - 13 : x + 13} y={y + 4} textAnchor={flip ? 'end' : 'start'}>
                          {z.name}
                          <tspan className="pin-skill"> {skillLabel}</tspan>
                        </text>
                      </>
                    )}
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
