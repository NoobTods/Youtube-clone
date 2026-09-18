import { Box, Stack, Typography, CircularProgress } from '@mui/material'
import { Videos } from './'

import { fetchFromAPI } from '../utils/fetchFromAPI'
import { useQuery } from '@tanstack/react-query'

// [CHANGED] The Sidebar and the `selectedCategory` state moved up to App.jsx so
// the sidebar is part of the global layout (always visible, like the Navbar).
// Feed now receives the category as a prop and only fetches + renders videos.
const Feed = ({ selectedCategory }) => {

  const { data: videos, isPending, isError } = useQuery({
    queryKey: ['search', selectedCategory],
    queryFn: () => fetchFromAPI(`search?part=snippet&q=${selectedCategory}`),
    select: (res) => res.items ?? [],
  });

  if (isPending) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#F31503' }} />
      </Stack>
    );
  }

  if (isError) {
    return (
      <Box p={2}>
        <Typography variant='h6' sx={{ color: 'white' }}>
          Could not load videos for "{selectedCategory}". Check your quota or API key, then retry.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant='h4' fontWeight="bold" mb={2} sx={{ color: 'white' }}>
        {selectedCategory} <span style={{ color : '#F31503'}}>Videos</span>
      </Typography>

      <Videos videos={videos} />
    </>
  )
}

export default Feed