import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Cada rota carrega só o próprio código e CSS, então os estilos dos temas nunca se misturam.
// Os links entre rotas recarregam a página de propósito, pelo mesmo motivo.
const routes = {
  '/': { load: () => import('./chooser/Chooser.jsx'), icon: '/favicon.svg' },
  '/elden-ring': { load: () => import('./elden/App.jsx'), icon: '/favicon-elden.svg' },
  '/stormlight': { load: () => import('./stormlight/App.jsx'), icon: '/favicon-stormlight.svg' },
}

const path = location.pathname.replace(/\/+$/, '') || '/'
const route = routes[path] ?? routes['/']
if (!routes[path]) history.replaceState(null, '', '/')

document.querySelector('link[rel="icon"]').href = route.icon

route.load().then(({ default: Page }) => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Page />
    </StrictMode>,
  )
})
