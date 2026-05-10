import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter, createBrowserHistory } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'
import './styles.css'

const history = createBrowserHistory()

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: true,
      staleTime: 10 * 1000,
      refetchOnReconnect: 'always',
      refetchOnWindowFocus: false,
    },
  },
});

// Connectivity Watchdog:
// Long-running kiosks on Raspberry Pi often suffer from "zombie" network states
// after internet drops. A hard reload when connection is restored is the
// most reliable way to recover all assets (GIFs, videos) and API states.
window.addEventListener('online', () => {
  console.log('Internet restored. Reloading to ensure fresh network state...');
  // A small delay ensures the OS network stack has fully settled
  setTimeout(() => {
    window.location.reload();
  }, 2000);
});

// Nightly Maintenance Reload:
// Scheduled reload at 3:00 AM to prevent potential memory leaks in long-running kiosk sessions.
const scheduleNightlyReload = () => {
  const now = new Date();
  // Set target to 3:00:00 AM today
  const night = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3, 0, 0);

  // If it is already past 3:00 AM today, schedule it for 3:00 AM tomorrow
  if (now.getTime() > night.getTime()) {
    night.setDate(night.getDate() + 1);
  }

  const msUntilReload = night.getTime() - now.getTime();
  setTimeout(() => window.location.reload(), msUntilReload);
};

scheduleNightlyReload();

root.render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)