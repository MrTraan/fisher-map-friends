import { useMemo, useState } from 'react'
import { DetailPanel } from './components/DetailPanel'
import { MapView, TIERS } from './components/MapView'
import { SearchBar } from './components/SearchBar'
import { zonesForSelection, type Selection } from './lib/catalog'

export default function App() {
  const [selection, setSelection] = useState<Selection | null>(null)
  const [skillText, setSkillText] = useState('')

  const highlighted = useMemo(() => zonesForSelection(selection), [selection])
  const skill = skillText.trim() === '' || Number.isNaN(Number(skillText)) ? null : Number(skillText)

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
          <MapView
            highlighted={highlighted}
            dimOthers={selection !== null && selection.type !== 'zone'}
            selectedZone={selection?.type === 'zone' ? selection.id : null}
            skill={skill}
            onSelect={(id) => setSelection({ type: 'zone', id })}
          />
          <div className="legend">
            <span>Skill for no getaways:</span>
            {TIERS.map((t, i) => (
              <span key={t} className="legend-item">
                <i className={`swatch tier-${i}`} /> {t}
              </span>
            ))}
            <span className="muted">Each zone shows "skill to cast / skill for no getaways".</span>
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
