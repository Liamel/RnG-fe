/* Skald Gaming — game catalogue (real titles only).
   Maths specs and descriptions are placeholders until confirmed.
   The first entry is the featured game (centre of the Home showcase).
   Fields: img (thumbnail), optional logo (transparent wordmark), optional demo (playable URL);
   demoProtected: true for password-gated demos (player shows an "open in new tab" hint for browsers that block iframe cookies);
   glyph + c1/c2/c3 are only used as generated fallback art if img is missing. */

export type GameType = 'slots' | 'holdwin' | 'crash' | 'table'

export interface Game {
  id: string
  title: string
  type: GameType
  glyph: string
  tag: '' | 'new' | 'hot'
  status?: string
  rtp: string
  vol: number
  max: string
  grid: string
  img?: string
  logo?: string
  demo?: string
  demoProtected?: boolean
  c1: string
  c2: string
  c3: string
  desc: string
}

export const typeLabel: Record<GameType, string> = { slots: 'Video Slot', holdwin: 'Hold & Win', crash: 'Crash', table: 'Table' }

export const GAMES: Game[] = [
  { id: 'juicy-fruits', title: 'Juicy Fruits', type: 'slots', glyph: '7', tag: 'new', status: 'Live demo',
    rtp: '96.50%', vol: 3, max: '5,000×', grid: '5×3 · 10 lines',
    img: '/assets/games/juicy-fruits-thumb.webp?v=2', logo: '/assets/games/juicy-fruits-logo.webp', demo: 'https://skaldsevens.vercel.app/', demoProtected: true,
    c1: '#3a1060', c2: '#ff5a1f', c3: '#ffd23f',
    desc: 'Classic fruit energy with a bold Skald attitude. Glossy symbols, blazing sevens and vibrant colour, finished with the Skald signature.' },
  { id: 'jade-garden-respin', title: 'Jade Garden Respin', type: 'slots', glyph: 'ᛟ', tag: 'new',
    rtp: '96.30%', vol: 4, max: '5,000×', grid: '5×3 · 10 lines · Respin',
    img: '/assets/games/jade-garden-respin-thumb.webp', demo: 'https://jg-respin.vercel.app/',
    c1: '#0d3b2a', c2: '#2fbf71', c3: '#ffd27a',
    desc: 'Your second chance in the lantern-lit garden. After any spin, pay to respin a single reel and chase the win while keeping your first prize.' },
  { id: 'jade-garden-40', title: 'Jade Garden 40', type: 'slots', glyph: 'ᛃ', tag: '',
    rtp: '96.20%', vol: 3, max: '4,000×', grid: '6×4 · 40 lines',
    img: '/assets/games/jade-garden-40-thumb.webp', demo: 'https://jadegarden40-alpha.vercel.app/',
    c1: '#3b0d12', c2: '#c9852a', c3: '#9fe3c8',
    desc: 'The golden-hour edition of Jade Garden: six reels and forty paylines across a sunset pavilion, with gilded symbols and frequent line hits.' },
  { id: 'jade-garden', title: 'Jade Garden', type: 'slots', glyph: 'ᛜ', tag: '',
    rtp: '96.10%', vol: 3, max: '3,000×', grid: '5×3 · 10 lines',
    img: '/assets/games/jade-garden-thumb.webp', demo: 'https://jade-garden-alpha.vercel.app/',
    c1: '#123a1f', c2: '#7ed957', c3: '#ffe39a',
    desc: 'The original garden. Rambutan, dragon fruit and longan spin beneath glowing lanterns, guarded by the jade lotus wild.' },
  { id: 'pista-spin', title: 'Pista Spin', type: 'slots', glyph: 'ᛈ', tag: 'new',
    rtp: '96.40%', vol: 4, max: '6,000×', grid: '5×3 · 25 lines',
    img: '/assets/games/pista-spin-thumb.webp', demo: 'https://pistaspin-alpha.vercel.app/',
    c1: '#3a1a05', c2: '#ff8a1f', c3: '#ffd23f',
    desc: 'A Philippine night-market fiesta under star lanterns. Grilled prawns, mango and coconut fill the reels while the clay pot bonus bubbles over with multipliers.' },
  { id: 'aniwilder', title: 'Aniwilder', type: 'slots', glyph: 'ᚹ', tag: '',
    rtp: '96.25%', vol: 3, max: '4,500×', grid: '5×3 · 243 ways',
    img: '/assets/games/aniwilder-thumb.webp', demo: 'https://aniwilder-alpha.vercel.app/',
    c1: '#0f2b14', c2: '#3fbf5a', c3: '#ffd27a',
    desc: 'A sun-drenched jungle crew of gorilla, elephant, red panda, turtle and giraffe. Each animal brings its own wild to the reels.' },
]

export const findGame = (id: string | null | undefined) => GAMES.find((g) => g.id === id)
