import { useEffect, useMemo, useState } from 'react'
import { ArtMapView } from './components/ArtMapView'
import { DetailPanel } from './components/DetailPanel'
import { MapView } from './components/MapView'
import { TIERS, type MapProps } from './components/mapShared'
import { CONTINENT_ART } from './data/mapArt'
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
          {artAvailable ? <ArtMapView {...mapProps} /> : <MapView {...mapProps} />}
          <div className="legend">
            <span>Skill for no getaways:</span>
            {TIERS.map((t, i) => (
              <span key={t} className="legend-item">
                <i className={`swatch tier-${i}`} /> {t}
              </span>
            ))}
            <span className="muted">
              {artAvailable
                ? 'Hover a marker for the zone name and "skill to cast / skill for no getaways".'
                : 'Each zone shows "skill to cast / skill for no getaways".'}
            </span>
          </div>
          <p className="muted small">
            Data is a Classic-era baseline and has not been checked against WoW Forever yet. New Forever fish
            and zones are missing.
          </p>
        </div>
        <aside className="panel">
          <DetailPanel selection={selection} onSelect={setSelection} />
        </aside>
      </main>
    </div>
  )
}
