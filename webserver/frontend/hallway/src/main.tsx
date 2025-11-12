import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter, createHashHistory } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import './styles.css'

const history = createHashHistory()

// Set up a Router instance
const router = createRouter({
  history,
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

if (!rootElement) throw new Error('Root element not found')

const root = ReactDOM.createRoot(rootElement)
root.render(<RouterProvider router={router} />)