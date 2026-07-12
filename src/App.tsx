import { useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import GamesGrid from './components/GamesGrid'
import Operators from './components/Operators'
import About from './components/About'
import Footer from './components/Footer'
import WhiteSite from './components/WhiteSite'

function App() {
  const [theme, setTheme] = useState<'dark' | 'white'>('dark')
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'white' : 'dark'))

  if (theme === 'white') {
    return <WhiteSite onThemeToggle={toggleTheme} />
  }

  return (
    <>
      <Nav onThemeToggle={toggleTheme} />
      <main>
        <Hero />
        <Ticker />
        <GamesGrid />
        <Operators />
        <About />
      </main>
      <Footer />
    </>
  )
}

export default App
