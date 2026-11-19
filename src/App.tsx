import { useEffect, useMemo, useState } from 'react'
import { ArtMapView, type MapMode } from './components/ArtMapView'
import { DetailPanel } from './components/DetailPanel'
import { MapView } from './components/MapView'
import { TIERS, type MapProps } from './components/mapShared'
import { CONTINENT_ART } from './data/mapArt'
import { ZONES } from './data/zones'
import { SearchBar } from './components/SearchBar'
import { zonesForSelection, type Selection } from './lib/catalog'

/** True once both continent images have loaded; false if either is missing. */
function useArtAvailable() {
  const [available, setAvailable] = useState(false)
  useEffect(() => {
    let cancelled = false
    const load = (src: string) =>
      new Promise<boolean>((resolve) => {
        const img = new Image()
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
        img.src = src
      })
    Promise.all(Object.values(CONTINENT_ART).map((a) => load(a.src))).then((ok) => {
      if (!cancelled) setAvailable(ok.every(Boolean))
    })
    return () => {
      cancelled = true
    }
  }, [])
  return available
}

export default function App() {
  const [selection, setSelection] = useState<Selection | null>(null)
  const [skillText, setSkillText] = useState('')
  const artAvailable = useArtAvailable()
  const [mapMode, setMapMode] = useState<MapMode>(() => {
    try {
      const saved = localStorage.getItem('mapMode')
      return saved === 'dots' || saved === 'shapes' ? saved : 'glow'
    } catch {
      return 'glow'
    }
  })
  const chooseMapMode = (mode: MapMode) => {
    setMapMode(mode)
    try {
      localStorage.setItem('mapMode', mode)
    } catch {
      // Storage can be unavailable (private window); the choice then lasts for this visit only.
    }
  }

  const highlighted = useMemo(() => zonesForSelection(selection), [selection])
  const skill = skillText.trim() === '' || Number.isNaN(Number(skillText)) ? null : Number(skillText)

  const mapProps: MapProps = {
    highlighted,
    dimOthers: selection !== null && selection.type !== 'zone',
    selectedZone: selection?.type === 'zone' ? selection.id : null,
    skill,
    onSelect: (id) => setSelection({ type: 'zone', id }),
  }

  return (
    <div className="app">
      <header>
        <h1>Fisher Map Friends</h1>
        <SearchBar onSelect={setSelection} />
        <label className="skill">
          My fishing skill
          <input
            type="number"
            min={1}
            max={450}
            placeholder="e.g. 150"
            value={skillText}
            onChange={(e) => setSkillText(e.target.value)}
          />
        </label>
      </header>

      <main>
        <div className="map-wrap">
          {artAvailable && (
            <div className="mode-toggle" role="group" aria-label="How zones are drawn">
              <span>Zones as</span>
              {(['glow', 'shapes', 'dots'] as MapMode[]).map((m) => (
                <button key={m} type="button" aria-pressed={mapMode === m} onClick={() => chooseMapMode(m)}>
                  {m === 'glow' ? 'Glow' : m === 'shapes' ? 'Shapes' : 'Dots'}
                </button>
              ))}
            </div>
          )}
          {artAvailable ? <ArtMapView mode={mapMode} {...mapProps} /> : <MapView {...mapProps} />}
          <div className="legend">
            <span>Skill for no getaways:</span>
            {TIERS.map((t, i) => (
              <span key={t} className="legend-item">
                <i className={`swatch tier-${i}`} /> {t}
              </span>
            ))}
            <span className="muted">
              {artAvailable
                ? 'Hover a zone for its name and "skill to cast / skill for no getaways".'
                : 'Each zone shows "skill to cast / skill for no getaways".'}
            </span>
          </div>
          <div className="off-map">
            <span>Not on the map:</span>
            {ZONES.filter((z) => z.continent === 'other').map((z) => (
              <button
                key={z.id}
                type="button"
                className={[
                  'off-map-zone',
                  highlighted.has(z.id) ? 'hit' : mapProps.dimOthers ? 'dim' : '',
                  skill !== null && skill < z.minSkill ? 'locked' : '',
                ].join(' ')}
                onClick={() => mapProps.onSelect(z.id)}
              >
                {z.name}
              </button>
            ))}
          </div>
          <p className="muted small">
            Where fish and crates are caught comes from the "Fished in" catch reports in Wowhead's WoW Forever
            database.
            Skill levels, pools and crate contents are still Classic-era data, and fish new in Forever are
            missing.
          </p>
        </div>
        <aside className="panel">
          <DetailPanel selection={selection} onSelect={setSelection} />
        </aside>
      </main>
    </div>
  )
}
