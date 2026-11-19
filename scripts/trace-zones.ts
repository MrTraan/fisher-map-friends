// Traces an outline for each zone on the continent maps and writes src/data/zoneShapes.ts.
//
//   node scripts/trace-zones.ts
//
// How it works: every zone marker in mapArt.ts is a seed, one per cell drawn on the map.
// Regions grow outwards from the seeds over land pixels, and crossing a dark line (a zone
// border drawn on the map) is very expensive, so each region fills its drawn cell and
// neighbours meet on the line. The sea is recognised by its dull colour and is never entered.

import jpeg from 'jpeg-js'
import { readFileSync, writeFileSync } from 'node:fs'
import { CONTINENT_ART, ZONE_POS } from '../src/data/mapArt.ts'
import { ZONES } from '../src/data/zones.ts'

// Zones without fishing data still need a seed, or their land would be given to a neighbour.
// Their shapes are thrown away.
const FILLER_SEEDS: Record<string, [number, number][]> = {
  kalimdor: [],
  'eastern-kingdoms': [
    [500, 440], // Searing Gorge
    [564, 395], // Badlands
    [520, 442], // Burning Steppes
    [553, 534], // Blasted Lands
    [609, 67], // far north
    [409, 240], // peninsula south of Silverpine
    [550, 103], // strip north of Eastern Plaguelands
    [620, 133], // strip east of Eastern Plaguelands
    [590, 187], // strip south of Eastern Plaguelands
    [493, 233], // cell between Hillsbrad and Arathi
    [600, 347], // strip east of Loch Modan
  ],
}

// Border lines hidden under the continent's lettering, redrawn by hand.
const WALLS: Record<string, [number, number][][]> = {
  kalimdor: [],
  'eastern-kingdoms': [[[462, 398], [482, 395], [511, 396], [530, 388]]],
}

// Where the continent's name is printed: x1, y1, x2, y2. Thick dark strokes in these boxes
// are letters, not borders.
const LETTER_BOXES: Record<string, [number, number, number, number][]> = {
  kalimdor: [[352, 322, 640, 358]],
  'eastern-kingdoms': [[348, 364, 540, 398], [414, 398, 650, 430]],
}

// Parts of the picture that are not land but are coloured like it (the scorched edge of
// the parchment): x1, y1, x2, y2.
const NOT_LAND: Record<string, [number, number, number, number][]> = {
  kalimdor: [[592, 612, 720, 670], [466, 636, 720, 670]],
  'eastern-kingdoms': [],
}

const LAND_CHROMA = 90 // average max(r,g,b) - min(r,g,b) around a pixel; land is above this
const DULL_LAND_CHROMA = 57 // ...or above this inside the boxes below

// A few zones are painted in dull colours. Inside these boxes (x1, y1, x2, y2) the lower
// land threshold applies; it is too close to the colour of the hatched sea to use everywhere.
const DULL_BOXES: Record<string, [number, number, number, number][]> = {
  kalimdor: [],
  'eastern-kingdoms': [
    [392, 165, 440, 235], // Silverpine
    [435, 495, 530, 540], // Duskwood and Deadwind Pass
  ],
}
const SEA_CHROMA = 40 // the pale band of water drawn around every coast is less colourful than this
const LETTER_LUM = 58 // strokes this dark and several pixels thick are lettering, not borders
const LINE_DARK = 8 // a pixel this much darker than its surroundings is part of a drawn line
const LINE_COST = 60 // extra cost per unit of darkness beyond that: lines are near-walls
const MAX_COST = 1000 // regions stop growing here: enough to fill a cell, not to cross a drawn line
const FILL = 4 // afterwards regions spread this many pixels over the lines and the coast rim
const NECK = 3 // parts of a region joined to the rest by a neck narrower than twice this are cut off
const SIMPLIFY = 0.7 // outline simplification tolerance, in pixels
const MIN_AREA = 25 // drop detached bits smaller than this many pixels
const MIN_HOLE = 40 // fill holes smaller than this many pixels

function trace(continent: 'kalimdor' | 'eastern-kingdoms') {
  const art = CONTINENT_ART[continent]
  const img = jpeg.decode(readFileSync(`public${art.src}`), { useTArray: true })
  const [cx, cy, cw, chRaw] = art.crop
  const ch = Math.min(chRaw, img.height - cy)
  const n = cw * ch

  const lum = new Float32Array(n)
  const chroma = new Float32Array(n)
  for (let y = 0; y < ch; y++)
    for (let x = 0; x < cw; x++) {
      const i = ((y + cy) * img.width + x + cx) * 4
      const r = img.data[i], g = img.data[i + 1], b = img.data[i + 2]
      lum[y * cw + x] = 0.3 * r + 0.59 * g + 0.11 * b
      chroma[y * cw + x] = Math.max(r, g, b) - Math.min(r, g, b)
    }

  const blur = (src: Float32Array, radius: number) => {
    const out = new Float32Array(n)
    for (let y = 0; y < ch; y++)
      for (let x = 0; x < cw; x++) {
        let sum = 0, count = 0
        for (let dy = -radius; dy <= radius; dy++)
          for (let dx = -radius; dx <= radius; dx++) {
            const xx = x + dx, yy = y + dy
            if (xx < 0 || yy < 0 || xx >= cw || yy >= ch) continue
            sum += src[yy * cw + xx]
            count++
          }
        out[y * cw + x] = sum / count
      }
    return out
  }
  const chromaAround = blur(chroma, 1)
  const lumAround = blur(lum, 4)

  // Land, including the dark rim drawn along every coast, is more colourful than the sea.
  // Two things stop a region at the coast:
  // - the pale, colourless band of water drawn around every coast and lake ("shallows");
  // - the hatched sea beyond it, brownish but still duller than the dullest land.
  const chromaWide = blur(chroma, 2)
  const shallows = new Uint8Array(n)
  const sea = new Uint8Array(n)
  const landChroma = new Float32Array(n).fill(LAND_CHROMA)
  for (const [x1, y1, x2, y2] of DULL_BOXES[continent])
    for (let y = y1 - cy; y <= y2 - cy; y++) for (let x = x1 - cx; x <= x2 - cx; x++) landChroma[y * cw + x] = DULL_LAND_CHROMA
  for (const [x1, y1, x2, y2] of NOT_LAND[continent])
    for (let y = y1 - cy; y <= Math.min(y2 - cy, ch - 1); y++) for (let x = x1 - cx; x <= x2 - cx; x++) landChroma[y * cw + x] = Infinity
  for (let i = 0; i < n; i++) {
    shallows[i] = chromaAround[i] < SEA_CHROMA ? 1 : 0
    sea[i] = shallows[i] || chromaWide[i] < landChroma[i] ? 1 : 0
  }

  // Thick, very dark strokes inside the name boxes are letters. They must not act as
  // borders, so they (and a 2 pixel margin for their soft edges) cost nothing extra.
  const lumNear = blur(lum, 2)
  const thick = new Float32Array(n)
  for (const [x1, y1, x2, y2] of LETTER_BOXES[continent])
    for (let y = y1 - cy; y <= y2 - cy; y++)
      for (let x = x1 - cx; x <= x2 - cx; x++) if (lumNear[y * cw + x] < LETTER_LUM) thick[y * cw + x] = 1
  const lettering = blur(thick, 2)

  // Cost of stepping onto each pixel; Infinity for sea.
  const cost = new Float32Array(n)
  for (let i = 0; i < n; i++)
    cost[i] = sea[i] ? Infinity : lettering[i] > 0 ? 1 : 1 + LINE_COST * Math.max(0, lumAround[i] - lum[i] - LINE_DARK)

  for (const wall of WALLS[continent])
    for (let k = 0; k + 1 < wall.length; k++) {
      const [x1, y1] = wall[k], [x2, y2] = wall[k + 1]
      const len = Math.ceil(Math.hypot(x2 - x1, y2 - y1) * 2)
      for (let t = 0; t <= len; t++) {
        const x = Math.round(x1 + ((x2 - x1) * t) / len) - cx, y = Math.round(y1 + ((y2 - y1) * t) / len) - cy
        for (const [dx, dy] of [[0, 0], [1, 0], [0, 1]]) cost[(y + dy) * cw + x + dx] = 2 * MAX_COST
      }
    }

  const zones = ZONES.filter((z) => z.continent === continent && ZONE_POS[z.id])
  const seeds: { label: number; x: number; y: number }[] = [
    ...zones.map((z, i) => ({ label: i, x: ZONE_POS[z.id][0] - cx, y: ZONE_POS[z.id][1] - cy })),
    ...FILLER_SEEDS[continent].map(([x, y], i) => ({ label: zones.length + i, x: x - cx, y: y - cy })),
  ]

  // Multi-source Dijkstra.
  console.log(`  ${continent}: growing regions`)
  const dist = new Float64Array(n).fill(Infinity)
  const label = new Int16Array(n).fill(-1)
  const heap: [number, number][] = []
  const push = (d: number, i: number) => {
    heap.push([d, i])
    let k = heap.length - 1
    while (k > 0) {
      const p = (k - 1) >> 1
      if (heap[p][0] <= heap[k][0]) break
      ;[heap[p], heap[k]] = [heap[k], heap[p]]
      k = p
    }
  }
  const pop = () => {
    const top = heap[0]
    const last = heap.pop()!
    if (heap.length) {
      heap[0] = last
      let k = 0
      for (;;) {
        const l = 2 * k + 1, r = l + 1
        let m = k
        if (l < heap.length && heap[l][0] < heap[m][0]) m = l
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r
        if (m === k) break
        ;[heap[m], heap[k]] = [heap[k], heap[m]]
        k = m
      }
    }
    return top
  }
  for (const s of seeds) {
    let i = Math.round(s.y) * cw + Math.round(s.x)
    if (cost[i] === Infinity) {
      // The marker sits on a pixel that reads as sea: start from the nearest land pixel instead.
      let best = Infinity
      for (let dy = -20; dy <= 20; dy++)
        for (let dx = -20; dx <= 20; dx++) {
          const x = Math.round(s.x) + dx, y = Math.round(s.y) + dy
          if (x < 0 || y < 0 || x >= cw || y >= ch || cost[y * cw + x] === Infinity) continue
          const d = dx * dx + dy * dy
          if (d < best) [best, i] = [d, y * cw + x]
        }
      console.warn(`  seed ${s.label} of ${continent} is on sea, moved ${Math.sqrt(best).toFixed(0)} px`)
    }
    dist[i] = 0
    label[i] = s.label
    push(0, i)
  }
  const steps = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414]]
  while (heap.length) {
    const [d, i] = pop()
    if (d > dist[i]) continue
    const x = i % cw, y = (i - x) / cw
    for (const [dx, dy, len] of steps) {
      const xx = x + dx, yy = y + dy
      if (xx < 0 || yy < 0 || xx >= cw || yy >= ch) continue
      const j = yy * cw + xx
      if (cost[j] === Infinity) continue
      const nd = d + cost[j] * len
      if (nd < dist[j] && nd <= MAX_COST) {
        dist[j] = nd
        label[j] = label[i]
        push(nd, j)
      }
    }
  }

  console.log(`  ${continent}: smoothing`)
  // The regions now fill their cells but stop short of the drawn lines and the coast rim.
  // Spread them a few pixels so neighbours meet in the middle of a line and coastal zones
  // cover the rim. Cells nobody claimed (no marker) stay empty.
  let frontier: number[] = []
  for (let i = 0; i < n; i++) if (label[i] >= 0) frontier.push(i)
  for (let step = 0; step < FILL; step++) {
    const next: number[] = []
    for (const i of frontier) {
      const x = i % cw, y = (i - x) / cw
      for (const [dx, dy] of step % 2 ? steps : steps.slice(0, 4)) {
        const xx = x + dx, yy = y + dy
        if (xx < 0 || yy < 0 || xx >= cw || yy >= ch) continue
        const j = yy * cw + xx
        if (label[j] >= 0 || shallows[j]) continue
        label[j] = label[i]
        next.push(j)
      }
    }
    frontier = next
  }

  // A region that slipped through a small gap in the coastline hangs on by a thin neck.
  // Shrink every region by NECK pixels, keep its largest piece, and grow that back.
  {
    const depth = new Int16Array(n) // steps to the nearest pixel with another label
    let ring: number[] = []
    for (let i = 0; i < n; i++) {
      if (label[i] < 0) continue
      const x = i % cw, y = (i - x) / cw
      const edge = x === 0 || y === 0 || x === cw - 1 || y === ch - 1 ||
        label[i - 1] !== label[i] || label[i + 1] !== label[i] || label[i - cw] !== label[i] || label[i + cw] !== label[i]
      if (edge) {
        depth[i] = 1
        ring.push(i)
      }
    }
    for (let dpt = 2; ring.length; dpt++) {
      const next: number[] = []
      for (const i of ring) {
        const x = i % cw, y = (i - x) / cw
        for (const [dx, dy] of dpt % 2 ? steps : steps.slice(0, 4)) {
          const xx = x + dx, yy = y + dy
          if (xx < 0 || yy < 0 || xx >= cw || yy >= ch) continue
          const j = yy * cw + xx
          if (label[j] < 0 || depth[j]) continue
          depth[j] = dpt
          next.push(j)
        }
      }
      ring = next
    }
    // Connected pieces of each region's core (depth > NECK); remember the largest per label.
    const piece = new Int32Array(n).fill(-1)
    const bestPiece = new Map<number, { id: number; size: number }>()
    let pieces = 0
    for (let i = 0; i < n; i++) {
      if (label[i] < 0 || depth[i] <= NECK || piece[i] >= 0) continue
      const id = pieces++
      let size = 0
      const todo = [i]
      piece[i] = id
      while (todo.length) {
        const k = todo.pop()!
        size++
        const x = k % cw
        for (const j of [k - 1, k + 1, k - cw, k + cw]) {
          if (j < 0 || j >= n || Math.abs((j % cw) - x) > 1) continue
          if (label[j] !== label[i] || depth[j] <= NECK || piece[j] >= 0) continue
          piece[j] = id
          todo.push(j)
        }
      }
      const best = bestPiece.get(label[i])
      if (!best || size > best.size) bestPiece.set(label[i], { id, size })
    }
    const keep = new Uint8Array(n)
    let grow: number[] = []
    for (let i = 0; i < n; i++)
      if (piece[i] >= 0 && bestPiece.get(label[i])!.id === piece[i]) {
        keep[i] = 1
        grow.push(i)
      }
    for (let step = 0; step <= NECK; step++) {
      const next: number[] = []
      for (const i of grow) {
        const x = i % cw, y = (i - x) / cw
        for (const [dx, dy] of steps) {
          const xx = x + dx, yy = y + dy
          if (xx < 0 || yy < 0 || xx >= cw || yy >= ch) continue
          const j = yy * cw + xx
          if (keep[j] || label[j] !== label[i]) continue
          keep[j] = 1
          next.push(j)
        }
      }
      grow = next
    }
    for (let i = 0; i < n; i++) if (!keep[i]) label[i] = -1
  }

  // Tidy single-pixel raggedness only: each land pixel takes the most common label right around it.
  {
    const next = label.slice()
    for (let y = 1; y < ch - 1; y++)
      for (let x = 1; x < cw - 1; x++) {
        const i = y * cw + x
        if (label[i] < 0) continue
        const counts = new Map<number, number>()
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const l = label[i + dy * cw + dx]
            if (l >= 0) counts.set(l, (counts.get(l) ?? 0) + 1)
          }
        let best = label[i], bestCount = 0
        for (const [l, c] of counts) if (c > bestCount) [best, bestCount] = [l, c]
        next[i] = best
      }
    label.set(next)
  }

  console.log(`  ${continent}: tracing outlines`)
  const shapes: Record<string, string> = {}
  zones.forEach((z, zi) => {
    // Collect the boundary edges of this zone's pixels, clockwise around each pixel.
    const edges = new Map<number, number[]>() // start vertex -> end vertices
    const vw = cw + 1
    const add = (x1: number, y1: number, x2: number, y2: number) => {
      const a = y1 * vw + x1
      if (!edges.has(a)) edges.set(a, [])
      edges.get(a)!.push(y2 * vw + x2)
    }
    const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < cw && y < ch && label[y * cw + x] === zi
    for (let y = 0; y < ch; y++)
      for (let x = 0; x < cw; x++) {
        if (!inside(x, y)) continue
        if (!inside(x, y - 1)) add(x, y, x + 1, y)
        if (!inside(x + 1, y)) add(x + 1, y, x + 1, y + 1)
        if (!inside(x, y + 1)) add(x + 1, y + 1, x, y + 1)
        if (!inside(x - 1, y)) add(x, y + 1, x, y)
      }

    const loops: [number, number][][] = []
    for (const [start, ends] of edges) {
      while (ends.length) {
        const loop: [number, number][] = []
        let v = start
        for (;;) {
          loop.push([v % vw, Math.floor(v / vw)])
          const out = edges.get(v)
          if (!out || !out.length) break
          v = out.pop()!
          if (v === start) break
        }
        loops.push(loop)
      }
    }

    const area = (p: [number, number][]) => {
      let a = 0
      for (let i = 0; i < p.length; i++) {
        const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]
        a += x1 * y2 - x2 * y1
      }
      return a / 2
    }

    // Douglas-Peucker on an open run of points.
    const simplify = (p: [number, number][]): [number, number][] => {
      if (p.length < 3) return p
      const [ax, ay] = p[0], [bx, by] = p[p.length - 1]
      const len = Math.hypot(bx - ax, by - ay) || 1
      let worst = 0, at = 0
      for (let i = 1; i < p.length - 1; i++) {
        const d = Math.abs((bx - ax) * (ay - p[i][1]) - (ax - p[i][0]) * (by - ay)) / len
        if (d > worst) [worst, at] = [d, i]
      }
      if (worst <= SIMPLIFY) return [p[0], p[p.length - 1]]
      return [...simplify(p.slice(0, at + 1)).slice(0, -1), ...simplify(p.slice(at))]
    }

    const d = loops
      // Outer outlines have positive area, holes (lakes) negative. Drop specks and pinholes.
      .filter((l) => area(l) >= MIN_AREA || area(l) <= -MIN_HOLE)
      .map((l) => {
        // Split the closed loop in two halves so the simplifier has fixed end points.
        const half = Math.floor(l.length / 2)
        const pts = [...simplify(l.slice(0, half + 1)).slice(0, -1), ...simplify([...l.slice(half), l[0]]).slice(0, -1)]
        return 'M' + pts.map(([x, y]) => `${x + cx},${y + cy}`).join('L') + 'Z'
      })
      .join('')
    if (!d) console.warn(`  no shape for ${z.id}`)
    shapes[z.id] = d
  })
  console.log(`${continent}: ${zones.length} zones traced`)
  return shapes
}

const all = { ...trace('kalimdor'), ...trace('eastern-kingdoms') }
const body = Object.entries(all)
  .map(([id, d]) => `  ${JSON.stringify(id)}: ${JSON.stringify(d)},`)
  .join('\n')
writeFileSync(
  'src/data/zoneShapes.ts',
  `// Generated by scripts/trace-zones.ts from the continent maps. Do not edit by hand.\n` +
    `// SVG path of each zone's outline, in pixels of its continent image.\n\n` +
    `export const ZONE_SHAPES: Record<string, string> = {\n${body}\n}\n`,
)
console.log('wrote src/data/zoneShapes.ts')
