import Nav from './components/Nav'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import GamesGrid from './components/GamesGrid'
import Operators from './components/Operators'
import About from './components/About'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Nav />
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
