import { CONTAINERS } from '../data/containers'
import type { Container, Zone } from '../data/types'
import { ItemIcon, WowheadLink } from './ItemIcon'
import {
  containerById,
  containerReports,
  containersForZone,
  fishById,
  fishForZone,
  fishReports,
  poolsForZone,
  sourcesForLoot,
  zoneById,
  zonesForContainer,
  zonesForFish,
  type Selection,
} from '../lib/catalog'

interface Props {
  selection: Selection | null
  onSelect: (s: Selection) => void
}

/** How well a catch is backed: Wowhead's Forever reports, or Classic data only. */
function reportsLabel(reports: number | undefined) {
  if (reports === undefined) return 'Classic data, not confirmed in Forever'
  return `${reports} ${reports === 1 ? 'report' : 'reports'}${reports < 10 ? ' (few)' : ''}`
}

/** Item name behind a selection, used to find its icon. Zones have none. */
function itemName(sel: Selection): string | undefined {
  switch (sel.type) {
    case 'fish':
      return fishById.get(sel.id)?.name
    case 'container':
      return containerById.get(sel.id)?.name
    case 'loot':
      return sel.name
    case 'zone':
      return undefined
  }
}

function Link({ to, onSelect, children }: { to: Selection; onSelect: Props['onSelect']; children: React.ReactNode }) {
  const name = itemName(to)
  return (
    <button type="button" className="link" onClick={() => onSelect(to)}>
      {name && <ItemIcon name={name} />}
      {children}
    </button>
  )
}

function Title({ name }: { name: string }) {
  return (
    <>
      <h2 className="title">
        <ItemIcon name={name} large />
        {name}
      </h2>
      <WowheadLink name={name} />
    </>
  )
}

function skillText(z: Zone) {
  return `cast at ${z.minSkill}, no getaways at ${z.noGetawaySkill}${z.skillEstimated ? ' (estimated)' : ''}`
}

/** Zones for a fish or container. With `reports`, the most reported zones come first. */
function ZoneList({ zones, onSelect, reports }: { zones: Zone[]; onSelect: Props['onSelect']; reports?: (z: Zone) => number | undefined }) {
  if (zones.length === 0) return <p className="muted">No zone recorded yet.</p>
  const sorted = [...zones].sort((a, b) =>
    reports ? (reports(b) ?? -1) - (reports(a) ?? -1) || a.minSkill - b.minSkill : a.minSkill - b.minSkill || a.name.localeCompare(b.name),
  )
  return (
    <ul className="rows">
      {sorted.map((z) => (
        <li key={z.id}>
          <Link to={{ type: 'zone', id: z.id }} onSelect={onSelect}>{z.name}</Link>
          {reports && <span className="muted"> · {reportsLabel(reports(z))}</span>}
          <div className="muted small">{skillText(z)}</div>
        </li>
      ))}
    </ul>
  )
}

function Contents({ c, onSelect }: { c: Container; onSelect: Props['onSelect'] }) {
  return (
    <ul className="chips">
      {c.contents.map((name) => (
        <li key={name}>
          <Link to={{ type: 'loot', name }} onSelect={onSelect}>{name}</Link>
        </li>
      ))}
    </ul>
  )
}

function ZoneDetail({ zone, onSelect }: { zone: Zone; onSelect: Props['onSelect'] }) {
  const catches = fishForZone(zone.id)
  const containers = containersForZone(zone.id)
  const pools = poolsForZone(zone.id)
  return (
    <>
      <p className="kind">{zone.isNew ? 'Zone · new in Forever' : 'Zone'}</p>
      <h2>{zone.name}</h2>
      <p>
        Skill <strong>{zone.minSkill}</strong> to cast, <strong>{zone.noGetawaySkill}</strong> for no getaways
        {zone.skillEstimated ? ' (estimated from the fish caught here)' : ''}.
      </p>
      {zone.note && <p className="muted">{zone.note}</p>}

      <section>
        <h3>Fish</h3>
        {catches.length === 0 && <p className="muted">No catch recorded yet.</p>}
        <ul className="rows">
          {catches.map(({ fish, reports }) => (
            <li key={fish.id}>
              <Link to={{ type: 'fish', id: fish.id }} onSelect={onSelect}>{fish.name}</Link>
              <span className="muted small"> · {reportsLabel(reports)}</span>
            </li>
          ))}
        </ul>
      </section>

      {pools.length > 0 && (
        <section>
          <h3>Pools (Classic data)</h3>
          <ul className="rows">
            {pools.map((p) => (
              <li key={p.id}>
                {p.name}
                <span className="muted"> · {p.loot.join(', ')}{p.note ? ` · ${p.note}` : ''}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {containers.length > 0 && (
        <section>
          <h3>Crates, chests and bloated fish</h3>
          {containers.map((c) => (
            <div key={c.id} className="container-card">
              <Link to={{ type: 'container', id: c.id }} onSelect={onSelect}>{c.name}</Link>
              <span className="muted small">
                {' '}· {c.kind}
                {c.withFish ? '' : ` · ${reportsLabel(containerReports(c.id, zone.id))}`}
              </span>
              <Contents c={c} onSelect={onSelect} />
            </div>
          ))}
        </section>
      )}
    </>
  )
}

function FishDetail({ id, onSelect }: { id: string; onSelect: Props['onSelect'] }) {
  const fish = fishById.get(id)
  if (!fish) return null
  const zones = zonesForFish(id)
  const opens = CONTAINERS.find((c) => c.name === fish.name)
  const bloated = CONTAINERS.filter((c) => c.withFish === id)
  return (
    <>
      <p className="kind">Fish</p>
      <Title name={fish.name} />
      {fish.note && <p>{fish.note}</p>}
      {opens && (
        <section>
          <h3>Can contain</h3>
          <Contents c={opens} onSelect={onSelect} />
        </section>
      )}
      <section>
        <h3>Where to catch it ({zones.length} zones)</h3>
        <ZoneList zones={zones} onSelect={onSelect} reports={(z) => fishReports(id, z.id)} />
      </section>
      {bloated.length > 0 && (
        <section>
          <h3>Rare bloated version</h3>
          {bloated.map((c) => (
            <div key={c.id} className="container-card">
              <Link to={{ type: 'container', id: c.id }} onSelect={onSelect}>{c.name}</Link>
              <Contents c={c} onSelect={onSelect} />
            </div>
          ))}
        </section>
      )}
    </>
  )
}

function ContainerDetail({ id, onSelect }: { id: string; onSelect: Props['onSelect'] }) {
  const c = containerById.get(id)
  if (!c) return null
  const zones = zonesForContainer(c)
  return (
    <>
      <p className="kind">{c.kind}</p>
      <Title name={c.name} />
      {c.note && <p>{c.note}</p>}
      {c.withFish && (
        <p>
          A rare catch wherever you catch{' '}
          <Link to={{ type: 'fish', id: c.withFish }} onSelect={onSelect}>{fishById.get(c.withFish)?.name}</Link>.
        </p>
      )}
      <section>
        <h3>Can contain (Classic data)</h3>
        <Contents c={c} onSelect={onSelect} />
      </section>
      <section>
        <h3>Where to fish it up ({zones.length} zones)</h3>
        <ZoneList
          zones={zones}
          onSelect={onSelect}
          reports={c.withFish ? (z) => fishReports(c.withFish!, z.id) : (z) => containerReports(c.id, z.id)}
        />
      </section>
    </>
  )
}

function LootDetail({ name, onSelect }: { name: string; onSelect: Props['onSelect'] }) {
  const { containers, pools } = sourcesForLoot(name)
  return (
    <>
      <p className="kind">Loot</p>
      <Title name={name} />
      {containers.length > 0 && (
        <section>
          <h3>Found inside</h3>
          <ul className="rows">
            {containers.map((c) => (
              <li key={c.id}>
                <Link to={{ type: 'container', id: c.id }} onSelect={onSelect}>{c.name}</Link>
                <div className="muted small">
                  {c.withFish
                    ? `Rare catch with ${fishById.get(c.withFish)?.name}`
                    : zonesForContainer(c).map((z) => z.name).join(', ')}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      {pools.length > 0 && (
        <section>
          <h3>Fished from pools</h3>
          <ul className="rows">
            {pools.map((p) => (
              <li key={p.id}>
                {p.name}
                <div className="muted small">
                  {p.zones.map((z) => zoneById.get(z)?.name).join(', ')}{p.note ? ` · ${p.note}` : ''}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}

export function DetailPanel({ selection, onSelect }: Props) {
  if (!selection) {
    return (
      <div className="empty">
        <h2>Pick a zone or search</h2>
        <p className="muted">
          Click a zone to see its fish, pools and crates. Search for a fish, a crate, or an item such as
          "Aquamarine" to light up every zone where you can get it.
        </p>
      </div>
    )
  }
  switch (selection.type) {
    case 'zone': {
      const zone = zoneById.get(selection.id)
      return zone ? <ZoneDetail zone={zone} onSelect={onSelect} /> : null
    }
    case 'fish':
      return <FishDetail id={selection.id} onSelect={onSelect} />
    case 'container':
      return <ContainerDetail id={selection.id} onSelect={onSelect} />
    case 'loot':
      return <LootDetail name={selection.name} onSelect={onSelect} />
  }
}
