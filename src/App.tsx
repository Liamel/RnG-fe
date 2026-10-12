import { useEffect, useLayoutEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import Atmosphere from './components/Atmosphere'
import Footer from './components/Footer'
import { GameOverlays } from './components/GameOverlays'
import Header from './components/Header'
import QuestLayer from './components/QuestLayer'
import { BootScreen, ChannelSwitch, PromptBar } from './components/ConsoleOS'
import { CrtOverlay } from './components/Signal'
import { visit, type PageKey } from './lib/quest'
import { useGlitch } from './lib/useGlitch'
import { useReveal } from './lib/useReveal'
import Contact from './pages/Contact'
import Games from './pages/Games'
import Home from './pages/Home'
import Integration from './pages/Integration'
import Studio from './pages/Studio'

const PAGES: Record<string, { key: PageKey; title: string }> = {
  '/': { key: 'home', title: 'Skald Gaming — Born to Stand Apart' },
  '/games': { key: 'games', title: 'Games Portfolio — Skald Gaming' },
  '/studio': { key: 'studio', title: 'Studio — Skald Gaming' },
  '/integration': { key: 'integration', title: 'Integration — Skald Gaming' },
  '/contact': { key: 'contact', title: 'Contact — Skald Gaming' },
}

function App() {
  const { pathname } = useLocation()
  const page = PAGES[pathname]

  useLayoutEffect(() => {
    if (!page) return
    scrollTo(0, 0)
    document.title = page.title
    document.body.dataset.page = page.key
  }, [page])
  // a passive effect, so <QuestLayer> is already listening for the achievement toasts
  useEffect(() => { if (page) visit(page.key) }, [page])
  useReveal(pathname)
  useGlitch(pathname)

  return (
    <GameOverlays>
      <Atmosphere />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/integration" element={<Integration />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <QuestLayer />
      <PromptBar />
      <ChannelSwitch />
      <BootScreen />
      <CrtOverlay />
    </GameOverlays>
  )
}

export default App
