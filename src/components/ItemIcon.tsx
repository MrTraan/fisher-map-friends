import { iconUrl, wowheadUrl } from '../data/wowhead'

/** Wowhead icon for an item name. Renders nothing if the item has no known icon. */
export function ItemIcon({ name, large = false }: { name: string; large?: boolean }) {
  const src = iconUrl(name, large ? 'large' : 'medium')
  if (!src) return null
  return (
    <img
      className={large ? 'item-icon large' : 'item-icon'}
      src={src}
      alt=""
      loading="lazy"
      // If Wowhead can't serve the icon, drop it rather than show a broken image.
      onError={(e) => (e.currentTarget.style.display = 'none')}
    />
  )
}

export function WowheadLink({ name }: { name: string }) {
  const href = wowheadUrl(name)
  if (!href) return null
  return (
    <a className="wowhead" href={href} target="_blank" rel="noreferrer">
      View on Wowhead ↗
    </a>
  )
}
