import { createContext, use } from 'react'

export interface Overlays {
  openGame: (id: string) => void
  openDemo: (id: string) => void
}
export const OverlaysContext = createContext<Overlays>({ openGame: () => {}, openDemo: () => {} })
/** Opens the game details modal or the live demo player (provided by <GameOverlays>). */
export const useGameOverlays = () => use(OverlaysContext)
