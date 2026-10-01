import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import satori from 'satori'
import sharp from 'sharp'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const require = createRequire(import.meta.url)

export const CARD_WIDTH = 1200
export const CARD_HEIGHT = 630
const RENDER_SCALE = 2

const COLORS = {
  bg: '#010409',
  primary: '#2563eb',
  glow: '#38bdf8',
  text: '#e2e8f0',
  muted: '#94a3b8',
}

function loadFonts() {
  const files = dirname(require.resolve('@fontsource/poppins/package.json'))
  return [400, 600, 700].flatMap((weight) =>
    ['latin', 'latin-ext'].map((subset) => ({
      name: 'Poppins',
      weight,
      style: 'normal',
      data: readFileSync(
        join(files, 'files', `poppins-${subset}-${weight}-normal.woff`),
      ),
    })),
  )
}

async function toDataUri(input, transform) {
  const buffer = await transform(sharp(input)).toBuffer({ resolveWithObject: true })
  return `data:image/${buffer.info.format};base64,${buffer.data.toString('base64')}`
}

let staticAssets
async function loadStaticAssets() {
  staticAssets ??= Promise.all([
    toDataUri(join(rootDir, 'assets', 'social_card_bg.png'), (img) =>
      img.resize(CARD_WIDTH, CARD_HEIGHT, { fit: 'cover' }).jpeg({ quality: 85 }),
    ),
    toDataUri(
      join(rootDir, 'public', 'images', 'kcd-logo-buenos-aires-2026.png'),
      (img) => img.resize({ height: 140 }).png(),
    ),
    toDataUri(join(rootDir, 'public', 'images', 'kcd-icon.png'), (img) =>
      img.resize(400).png(),
    ),
  ]).then(([background, logo, icon]) => ({
    background,
    logo,
    icon,
    fonts: loadFonts(),
  }))
  return staticAssets
}

const photoCache = new Map()
/** Speaker photos live on Sessionize's CDN; fetch once per process. */
function loadSpeakerPhoto(url) {
  if (!photoCache.has(url)) {
    photoCache.set(
      url,
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          return response.arrayBuffer()
        })
        .then((data) =>
          toDataUri(Buffer.from(data), (img) =>
            img.resize(480, 480, { fit: 'cover' }).jpeg({ quality: 88 }),
          ),
        )
        .catch((error) => {
          console.warn(`session-card: could not load ${url}: ${error.message}`)
          return null
        }),
    )
  }
  return photoCache.get(url)
}

// Minimal hyperscript for satori's React-element-shaped input.
function h(type, style, ...children) {
  const flat = children.flat().filter((child) => child != null && child !== false)
  return {
    type,
    props: {
      style: type === 'img' ? style.style : { display: 'flex', ...style },
      ...(type === 'img' ? { src: style.src, width: style.width, height: style.height } : {}),
      children: flat.length === 1 ? flat[0] : flat,
    },
  }
}

function titleFontSize(title) {
  if (title.length <= 40) return 62
  if (title.length <= 70) return 52
  if (title.length <= 100) return 44
  return 38
}

function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function avatar(speaker, photo, size) {
  const ring = {
    width: size,
    height: size,
    borderRadius: size / 2,
    border: `${Math.max(4, Math.round(size / 45))}px solid ${COLORS.primary}`,
    boxShadow: `0 0 48px ${COLORS.primary}`,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d1117',
  }
  if (photo) {
    return h('div', ring, h('img', { src: photo, width: size, height: size, style: { objectFit: 'cover' } }))
  }
  return h(
    'div',
    { ...ring, color: COLORS.glow, fontSize: size / 3, fontWeight: 700 },
    initials(speaker.name),
  )
}

function speakerVisual(speakers, photos, icon) {
  if (speakers.length === 0) {
    return h('img', { src: icon, width: 280, height: 280, style: {} })
  }
  const size = speakers.length === 1 ? 300 : speakers.length === 2 ? 230 : 170
  return h(
    'div',
    { flexDirection: speakers.length === 2 ? 'column' : 'row', flexWrap: 'wrap', gap: 0, alignItems: 'center', justifyContent: 'center' },
    speakers.map((speaker, index) =>
      h(
        'div',
        speakers.length === 2
          ? { marginTop: index === 0 ? 0 : -40, marginLeft: index === 0 ? -80 : 80 }
          : { margin: 8 },
        avatar(speaker, photos[index], size),
      ),
    ),
  )
}

/**
 * Render a 1200x630 JPEG social card for one session.
 * @param {import('../../src/lib/sessionMeta.ts').SessionCardData} card
 */
export async function renderSessionCard(card) {
  const assets = await loadStaticAssets()
  const speakers = card.speakers.slice(0, 4)
  const photos = await Promise.all(
    speakers.map((speaker) => (speaker.photo ? loadSpeakerPhoto(speaker.photo) : null)),
  )
  const names = speakers.map((speaker) => speaker.name).join(', ')
  const affiliation = speakers.length === 1 ? speakers[0].affiliation : undefined

  const tree = h(
    'div',
    {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      fontFamily: 'Poppins',
      color: COLORS.text,
      backgroundColor: COLORS.bg,
      backgroundImage: `url(${assets.background})`,
      backgroundSize: `${CARD_WIDTH}px ${CARD_HEIGHT}px`,
    },
    h(
      'div',
      {
        position: 'absolute',
        top: 0,
        left: 0,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundImage:
          'linear-gradient(90deg, rgba(1,4,9,0.96) 0%, rgba(1,4,9,0.9) 55%, rgba(1,4,9,0.55) 100%)',
      },
    ),
    h(
      'div',
      { position: 'absolute', top: 0, left: 0, width: CARD_WIDTH, height: CARD_HEIGHT, padding: 56 },
      h(
        'div',
        { flexDirection: 'column', width: 720, height: '100%', justifyContent: 'space-between' },
        h(
          'div',
          { alignItems: 'center', justifyContent: 'space-between' },
          h('img', { src: assets.logo, width: 218, height: 70, style: {} }),
          h(
            'div',
            {
              backgroundColor: COLORS.primary,
              color: '#ffffff',
              borderRadius: 999,
              padding: '8px 22px',
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: 'uppercase',
            },
            card.typeLabel,
          ),
        ),
        h(
          'div',
          { flexDirection: 'column' },
          h(
            'div',
            {
              display: 'block',
              fontSize: titleFontSize(card.title),
              fontWeight: 700,
              lineHeight: 1.12,
              color: '#ffffff',
              lineClamp: 4,
            },
            card.title,
          ),
          names
            ? h(
                'div',
                { flexDirection: 'column', marginTop: 24 },
                h('div', { fontSize: 30, fontWeight: 600, color: COLORS.glow }, names),
                affiliation
                  ? h('div', { fontSize: 22, color: COLORS.muted, marginTop: 4 }, affiliation)
                  : null,
              )
            : null,
        ),
        h(
          'div',
          { flexDirection: 'column', borderTop: `2px solid ${COLORS.primary}`, paddingTop: 18 },
          h('div', { fontSize: 26, fontWeight: 600, color: '#ffffff' }, card.dateLabel),
          h(
            'div',
            { fontSize: 22, color: COLORS.muted, marginTop: 2 },
            `${card.timeLabel}  ·  ${card.roomLabel}  ·  ${card.venue}`,
          ),
        ),
      ),
      h(
        'div',
        { flex: 1, alignItems: 'center', justifyContent: 'center' },
        speakerVisual(speakers, photos, assets.icon),
      ),
    ),
  )

  const svg = await satori(tree, { width: CARD_WIDTH, height: CARD_HEIGHT, fonts: assets.fonts })
  return sharp(Buffer.from(svg))
    .resize(CARD_WIDTH * RENDER_SCALE, CARD_HEIGHT * RENDER_SCALE)
    .png({ compressionLevel: 9 })
    .toBuffer()
}
