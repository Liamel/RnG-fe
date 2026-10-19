import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/styles.css'
import './styles/quest.css'
import './styles/crt.css'
import './styles/os.css'
import './styles/light.css'
import './styles/settings.css'
import './styles/soon.css'

// Pre-launch: every URL shows the coming-soon page. Set to false at launch to serve the full site.
// Locally, `VITE_COMING_SOON=false pnpm dev` previews the full site without flipping this.
const COMING_SOON = import.meta.env.VITE_COMING_SOON !== 'false'

const root = createRoot(document.getElementById('root')!)

if (COMING_SOON) {
  delete document.documentElement.dataset.theme // the splash is dark-only
  void import('./pages/ComingSoon.tsx').then(({ default: ComingSoon }) => {
    document.title = 'Skald Gaming — Coming Soon'
    root.render(<StrictMode><ComingSoon /></StrictMode>)
  })
} else {
  void Promise.all([import('./App.tsx'), import('react-router')]).then(([{ default: App }, { BrowserRouter }]) => {
    root.render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    )
  })
}
