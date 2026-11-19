// Builds the "Glow" overlay: the world map's own highlight image for each zone.
//
//   node scripts/build-glows.ts
//
// Writes public/maps/glow/<zone id>.png and src/data/zoneGlows.ts.
//
// Where the data comes from:
// - scripts/zone-highlights.json lists, for every zone, which game image is its highlight
//   and where it sits on the continent map. It was produced in the game by the addon in
//   tools/ZoneHighlightDump (type /zonedump, then /reload).
// - The images themselves are downloaded from Blizzard's public game-data servers.

import { CASCClient } from '@rhyster/wow-casc-dbc'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import zlib from 'node:zlib'
import { CONTINENT_ART } from '../src/data/mapArt.ts'
import { ZONES } from '../src/data/zones.ts'

const REGION = 'eu'
const PRODUCT = 'wowf' // World of Warcraft Forever
const SOLID = 1.8 // how far the glow is stretched: higher fills more of the zone solidly

interface Highlight {
  zone: string
  fileDataID: number
  /** Position and size on the continent map, as fractions of its width and height. */
  x: number
  y: number
  width: number
  height: number
  /** The part of the image that is actually used, as fractions of its size. */
  usedX: number
  usedY: number
}
const dump: { build: string; continents: { name: string; highlights: Highlight[] }[] } = JSON.parse(
  readFileSync('scripts/zone-highlights.json', 'utf8'),
)

/** Brightness (0..255) of every pixel of a BLP2 texture. Highlights are DXT1-compressed. */
function blpBrightness(buf: Buffer) {
  if (buf.toString('latin1', 0, 4) !== 'BLP2') throw new Error('not a BLP2 texture')
  const encoding = buf[8], alphaDepth = buf[9]
  if (encoding !== 2 || alphaDepth !== 0) throw new Error(`unsupported BLP encoding ${encoding}/${alphaDepth}`)
  const width = buf.readUInt32LE(12), height = buf.readUInt32LE(16)
  const src = buf.subarray(buf.readUInt32LE(20))
  const out = new Uint8Array(width * height)
  const bright = (v: number) => Math.max(((v >> 11) & 31) * 255 / 31, ((v >> 5) & 63) * 255 / 63, (v & 31) * 255 / 31)
  let s = 0
  for (let by = 0; by < height; by += 4)
    for (let bx = 0; bx < width; bx += 4) {
      const v0 = src.readUInt16LE(s), v1 = src.readUInt16LE(s + 2)
      const b0 = bright(v0), b1 = bright(v1)
      // Four colours per block: the two stored ones and two blends (or one blend and "clear").
      const levels = v0 > v1 ? [b0, b1, (2 * b0 + b1) / 3, (b0 + 2 * b1) / 3] : [b0, b1, (b0 + b1) / 2, 0]
      const picks = src.readUInt32LE(s + 4)
      s += 8
      for (let k = 0; k < 16; k++) {
        const x = bx + (k & 3), y = by + (k >> 2)
        if (x < width && y < height) out[y * width + x] = levels[(picks >>> (2 * k)) & 3]
      }
    }
  return { width, height, data: out }
}

/** Writes a white PNG whose transparency is the given alpha channel. */
function writeAlphaPng(file: string, width: number, height: number, alpha: Uint8Array) {
  const raw = Buffer.alloc((width * 4 + 1) * height, 255)
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0 // filter type of the row
    for (let x = 0; x < width; x++) raw[y * (width * 4 + 1) + 1 + x * 4 + 3] = alpha[y * width + x]
  }
  const chunk = (type: string, body: Buffer) => {
    const length = Buffer.alloc(4)
    length.writeUInt32BE(body.length)
    const typed = Buffer.concat([Buffer.from(type), body])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(zlib.crc32(typed) >>> 0)
    return Buffer.concat([length, typed, crc])
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(width, 0)
  header.writeUInt32BE(height, 4)
  header[8] = 8 // bits per channel
  header[9] = 6 // RGBA
  writeFileSync(
    file,
    Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      chunk('IHDR', header),
      chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
      chunk('IEND', Buffer.alloc(0)),
    ]),
  )
}

const version = await CASCClient.getProductVersion(REGION, PRODUCT)
if (!version) throw new Error(`no ${PRODUCT} build found for region ${REGION}`)
console.log(`game build ${version.VersionsName} (positions were recorded on ${dump.build})`)
const client = new CASCClient(REGION, PRODUCT, version)
await client.init()

mkdirSync('public/maps/glow', { recursive: true })
const { width: W, height: H } = CONTINENT_ART.kalimdor // both continent maps are the same size
const rows: string[] = []
for (const continent of dump.continents)
  for (const h of continent.highlights) {
    const zone = ZONES.find((z) => z.name === h.zone)
    if (!zone) {
      console.log(`  skipped ${h.zone}: not a zone in the app`)
      continue
    }
    const keys = client.getContentKeysByFileDataID(h.fileDataID)
    if (!keys?.length) throw new Error(`file ${h.fileDataID} (${h.zone}) not found in the game data`)
    const { buffer } = await client.getFileByContentKey(keys[0].cKey)
    const tex = blpBrightness(buffer)

    // Keep only the used part of the image, and stretch the glow so the middle of the
    // zone is solid and only its rim fades out.
    const w = Math.round(tex.width * h.usedX), hh = Math.round(tex.height * h.usedY)
    const alpha = new Uint8Array(w * hh)
    let max = 1
    for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) max = Math.max(max, tex.data[y * tex.width + x])
    for (let y = 0; y < hh; y++)
      for (let x = 0; x < w; x++) alpha[y * w + x] = Math.round(255 * Math.min(1, (tex.data[y * tex.width + x] / max) * SOLID))
    writeAlphaPng(`public/maps/glow/${zone.id}.png`, w, hh, alpha)

    const px = (v: number) => Math.round(v * 10) / 10
    rows.push(`  ${JSON.stringify(zone.id)}: [${px(h.x * W)}, ${px(h.y * H)}, ${px(h.width * W)}, ${px(h.height * H)}],`)
  }

writeFileSync(
  'src/data/zoneGlows.ts',
  `// Generated by scripts/build-glows.ts. Do not edit by hand.\n` +
    `// The world map's own highlight for each zone, taken from the game.\n` +
    `// Images are in public/maps/glow/<zone id>.png: white, with the glow strength as transparency.\n` +
    `// Each entry is where the image sits on its continent map: x, y, width, height in pixels.\n\n` +
    `export const ZONE_GLOWS: Record<string, [number, number, number, number]> = {\n${rows.join('\n')}\n}\n\n` +
    `export const glowUrl = (zoneId: string) => \`/maps/glow/\${zoneId}.png\`\n`,
)
console.log(`wrote ${rows.length} glows`)
