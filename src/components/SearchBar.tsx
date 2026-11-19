import { useMemo, useState } from 'react'
import { search, type Selection } from '../lib/catalog'
import { ItemIcon } from './ItemIcon'

export function SearchBar({ onSelect }: { onSelect: (s: Selection | null) => void }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const results = useMemo(() => search(query), [query])

  const choose = (i: number) => {
    const hit = results[i]
    if (!hit) return
    onSelect(hit.selection)
    setQuery(hit.label)
    setOpen(false)
  }

  return (
    <div className="search">
      <input
        type="search"
        placeholder="Search a fish, crate or item…"
        aria-label="Search a fish, crate or item"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          // Emptying the box (by hand or with its clear button) also drops what was picked.
          if (e.target.value === '') onSelect(null)
          setActive(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActive((a) => Math.min(a + 1, results.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActive((a) => Math.max(a - 1, 0))
          } else if (e.key === 'Enter') {
            choose(active)
          } else if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
      />
      {open && query.trim() !== '' && (
        <ul className="results" role="listbox">
          {results.length === 0 && <li className="none">Nothing found</li>}
          {results.map((r, i) => (
            <li
              key={r.kind + r.label}
              role="option"
              aria-selected={i === active}
              className={i === active ? 'active' : ''}
              // mousedown fires before the input's blur closes the list
              onMouseDown={(e) => {
                e.preventDefault()
                choose(i)
              }}
              onMouseEnter={() => setActive(i)}
            >
              <span className="result-label">
                {r.kind !== 'Zone' && <ItemIcon name={r.label} />}
                {r.label}
              </span>
              <span className="result-kind">{r.kind}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
