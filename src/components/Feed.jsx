// [CHANGED] Removed the old `/* eslint-disable no-unused-vars */`: its cause (the unused
// `const data =` assignment in the effect) is gone now that fetching goes through useQuery.
import { Box, Stack, Typography, CircularProgress } from '@mui/material' // [CHANGED - quota] CircularProgress added for the loading state
import { Sidebar, Videos } from './'

import { fetchFromAPI } from '../utils/fetchFromAPI'
import { useState } from 'react' // [CHANGED] useEffect removed (handled by useQuery); useState kept for the category
import { useQuery } from '@tanstack/react-query' // [CHANGED - quota] replaces manual useEffect + useState

const Feed = () => {

  const [selectedCategory, setSelectedCategory] = useState('New');

  // [CHANGED - quota] fetchFromAPI now goes through React Query (useQuery). What this fixes:
  //  - CACHING: each category's result is cached and shared across mounts. Re-visiting
  //    a category or re-mounting the Feed no longer costs a new API request.
  //  - RACE CONDITION: the old useEffect could let an older response resolve last and
  //    overwrite a newer one (wrong videos shown). React Query keys by `selectedCategory`,
  //    so results can never mix.
  //  - DEDUPLICATION: StrictMode double-mounts in dev only trigger ONE request.
  // The global QueryClient (main.jsx) sets staleTime=10min, retry=1, no refetch on focus:
  // within 10 minutes, a category is fetched from RapidAPI at most once.
  const { data: videos, isPending, isError } = useQuery({
    queryKey: ['search', selectedCategory],
    queryFn: () => fetchFromAPI(`search?part=snippet&q=${selectedCategory}`),
    select: (res) => res.items ?? [], // [CHANGED] normalize once: always an array
  });

  // [CHANGED - quota] loading + error states: the old code rendered an empty grid
  // during fetch and a blank page forever if the request failed.
  if (isPending) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#F31503' }} />
      </Stack>
    );
  }

  if (isError) {
    return (
      <Box p={2} sx={{ height: '90vh', flex: 2 }}>
        <Typography variant='h6' sx={{ color: 'white' }}>
          Could not load videos for "{selectedCategory}". Check your quota or API key, then retry.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack
      sx={{ flexDirection: { sx: "column", md: "row"}}}
    >
      <Box sx={{ height: { sx: "auto", md: "92vh"}, borderRight: "1px solid #3d3d3d", px: { sx: 0, md: 2}}}>
        <Sidebar 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <Typography className='copyright' variant='body2' sx={{ mt: 1.5, color: '#fff' }}>
          Copyright 2026 Tods
        </Typography>
      </Box>
      <Box p={2} sx={{ overflowY: "auto", height: "90vh", flex: 2}}>
        <Typography variant='h4' fontWeight="bold" mb={2} sx={{ color: 'white' }}>
          {selectedCategory} <span style={{ color : '#F31503'}}>Videos</span>
        </Typography>

        <Videos videos={videos} />
      </Box>
    </Stack>
  )
}

export default Feed