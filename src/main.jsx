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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,      // [CHANGED - quota] 10 minutes of freshness
      refetchOnWindowFocus: false,    // [CHANGED - quota] don't refetch on tab focus
      retry: 1,                       // [CHANGED - quota] limit blind retries
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* [CHANGED - quota] Provider makes the cache available to every useQuery call */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
