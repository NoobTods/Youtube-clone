import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// [CHANGED - quota] React Query setup: one QueryClient shared by the whole app.
//  - staleTime: 10 min  -> data is considered fresh for 10 minutes; no component
//    re-requesting the same query within that window hits RapidAPI again.
//  - refetchOnWindowFocus: false -> clicking back into the browser tab does NOT
//    silently spend a request (React Query's default does).
//  - retry: 1 -> one retry on failure is enough; more retries would burn quota
//    on endpoints that are failing anyway (e.g. quota exhausted -> 429).
//  - gcTime (default 5 min): closed pages keep their cache entry a while, so
//    going back to a page restores instantly without a new request.
import { QueryClient } from '@tanstack/react-query'
// [CHANGED - quota] Persistance du cache dans localStorage : recharger la page
// ne re-consomme PAS de quota tant que les données sont encore "fraîches".
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000,      // [CHANGED - quota] 30 minutes of freshness
      gcTime: 30 * 60 * 1000,         // [CHANGED - quota] keep cache 30 min for persistence
      refetchOnWindowFocus: false,    // [CHANGED - quota] don't refetch on tab focus
      retry: 1,                       // [CHANGED - quota] limit blind retries
    },
  },
});

// Sauvegarde le cache dans localStorage sous la clé 'YOUTUBE_CLONE_CACHE'
const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'YOUTUBE_CLONE_CACHE',
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* [CHANGED - quota] Provider with persisted cache */}
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, maxAge: 30 * 60 * 1000 }}>
      <App />
    </PersistQueryClientProvider>
  </StrictMode>,
)
