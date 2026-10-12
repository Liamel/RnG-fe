/* Skald Gaming — "Skald Quest" gamification layer
   XP + ranks, achievements, hidden runes, and the "Spin the Saga" mini slot.
   Progress lives in this browser only (localStorage); everything works without it. */
import { useSyncExternalStore } from 'react'

export type PageKey = 'home' | 'games' | 'studio' | 'integration' | 'contact'

const KEY = 'skald-quest-v1'
export const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

export const RANKS = [
  { name: 'Initiate', xp: 0 },
  { name: 'Raider', xp: 150 },
  { name: 'Berserker', xp: 400 },
  { name: 'Jarl', xp: 800 },
  { name: 'Skald', xp: 1400 },
]
export const ACH = {
  enter:    { t: 'Enter the hall',  d: 'Visit the Skald site',                 xp: 10,  g: 'ᛟ' },
  core:     { t: 'Core ignited',    d: 'Activate the Skald core',              xp: 50,  g: 'ᛊ' },
  path:     { t: 'Pathfinder',      d: 'Visit all five pages',                 xp: 100, g: 'ᚱ' },
  demo:     { t: 'Live player',     d: 'Launch a playable game demo',          xp: 50,  g: 'ᛈ' },
  worlds:   { t: 'World walker',    d: 'Open three games',                     xp: 75,  g: 'ᚹ' },
  spin:     { t: 'First spin',      d: 'Spin the Saga reels',                  xp: 20,  g: 'ᛃ' },
  bigwin:   { t: 'Big win',         d: 'Land three of a kind',                 xp: 100, g: 'ᚷ' },
  deep:     { t: 'Deep diver',      d: 'Scroll to the very bottom of a page',  xp: 25,  g: 'ᛞ' },
  runes:    { t: 'Rune master',     d: 'Collect all five hidden runes',        xp: 250, g: 'ᚠ' },
  raven:    { t: 'Signal sent',     d: 'Send a message to the studio',         xp: 100, g: 'ᛗ' },
  berserk:  { t: 'Berserker',       d: "Secret: type the studio's name",       xp: 75,  g: 'ᛉ', secret: true },
} as const
export type AchId = keyof typeof ACH

// One hidden rune per page; it is rendered by <HiddenRune> inside that page's host element
export const RUNES: Record<PageKey, string> = { home: 'ᚠ', games: 'ᚢ', studio: 'ᚦ', integration: 'ᚨ', contact: 'ᚱ' }
export const RUNE_ORDER = Object.values(RUNES)
const FREE_SPINS = 5

// ---------- state ----------
interface State {
  xp: number
  ach: string[]
  runes: string[]
  visited: string[]
  games: string[]
  spins: { date: string; left: number }
}
const today = () => new Date().toISOString().slice(0, 10)
const fresh = (): State => ({ xp: 0, ach: [], runes: [], visited: [], games: [], spins: { date: today(), left: FREE_SPINS } })
let S: State
try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) as string) || {}) } catch { S = fresh() }
if (S.spins.date !== today()) S.spins = { date: today(), left: Math.max(S.spins.left, FREE_SPINS) }

const listeners = new Set<() => void>()
// State is immutable: every change builds new objects/arrays, since the React Compiler memoizes on nested paths (e.g. S.runes)
const set = (patch: Partial<State>) => {
  S = { ...S, ...patch }
  try { localStorage.setItem(KEY, JSON.stringify(S)) } catch { /* storage unavailable */ }
  listeners.forEach((l) => l())
}
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l) }

/** Re-renders the caller whenever quest progress changes and returns the current state. */
export const useQuest = () => useSyncExternalStore(subscribe, () => S)
/** Current state, for event handlers that run after later changes. */
export const questState = () => S

export const rankOf = (xp: number) => RANKS.reduce((r, k, i) => (xp >= k.xp ? i : r), 0)

// ---------- effects (rendered by <QuestLayer>) ----------
export type Fx =
  | { type: 'toast'; g: string; title: string; desc: string; xp: number; big?: boolean }
  | { type: 'float'; text: string; x: number; y: number }
  | { type: 'burst'; x: number; y: number; n: number }
  | { type: 'flash' }
  | { type: 'bump' }
const fxListeners = new Set<(fx: Fx) => void>()
export const onFx = (l: (fx: Fx) => void) => { fxListeners.add(l); return () => { fxListeners.delete(l) } }
const emit = (fx: Fx) => fxListeners.forEach((l) => l(fx))

export const toast = (g: string, title: string, desc: string, xp: number, big?: boolean) => emit({ type: 'toast', g, title, desc, xp, big })
export const burst = (x: number, y: number, n = 28) => { if (!reduced) emit({ type: 'burst', x, y, n }) }
export const flash = () => emit({ type: 'flash' })
export const centerOf = (el: Element): [number, number] => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2] }

// ---------- rewards ----------
export function addXP(n: number, x?: number, y?: number) {
  if (!n) return
  const before = rankOf(S.xp)
  set({ xp: S.xp + n })
  emit({ type: 'bump' })
  if (x != null && y != null) emit({ type: 'float', text: `+${n} XP`, x, y })
  const after = rankOf(S.xp)
  if (after > before) {
    setTimeout(() => {
      toast('ᛟ', `Rank up: ${RANKS[after].name}`, `You reached rank ${after + 1} of ${RANKS.length}`, 0, true)
      burst(innerWidth / 2, innerHeight / 2, 60)
      flash()
    }, 500)
  }
}

export function unlock(id: AchId, x?: number, y?: number) {
  if (S.ach.includes(id)) return false
  const a = ACH[id]
  set({ ach: [...S.ach, id] })
  toast(a.g, `Achievement · ${a.t}`, a.d, a.xp)
  addXP(a.xp, x, y)
  return true
}

export function reset() {
  set(fresh())
  toast('ᛟ', 'Saga reset', 'Your quest starts over', 0)
}

export function visit(page: PageKey) {
  unlock('enter')
  if (!S.visited.includes(page)) set({ visited: [...S.visited, page] })
  if (S.visited.length >= 5) unlock('path')
}

export function trackGame(id: string) {
  if (!S.games.includes(id)) set({ games: [...S.games, id] })
  if (S.games.length >= 3) unlock('worlds')
}

export function findRune(page: PageKey, x: number, y: number) {
  const g = RUNES[page]
  if (S.runes.includes(g)) return
  set({ runes: [...S.runes, g], spins: { ...S.spins, left: S.spins.left + 1 } })
  burst(x, y, 34)
  toast(g, `Rune found · ${S.runes.length}/${RUNE_ORDER.length}`, '+1 bonus spin on the Saga reels', 30)
  addXP(30, x, y)
  if (S.runes.length === RUNE_ORDER.length) {
    setTimeout(() => {
      unlock('runes')
      toast('ᚠ', 'Reward unlocked', 'Priority demo access: use code RUNEMASTER on the contact form', 0, true)
      burst(innerWidth / 2, innerHeight / 3, 80)
    }, 900)
  }
}

/** Uses one free spin; returns false when none are left. */
export function takeSpin() {
  if (S.spins.left <= 0) return false
  set({ spins: { ...S.spins, left: S.spins.left - 1 } })
  return true
}
