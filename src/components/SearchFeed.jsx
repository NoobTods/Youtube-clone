import { Box, Stack, Typography, CircularProgress } from '@mui/material'
import { Videos } from './'

import { fetchFromAPI } from '../utils/fetchFromAPI'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

const SearchFeed = () => {
  const { searchTerm } = useParams();
  
  const { data: videos, isPending, isError } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: () => fetchFromAPI(`search?part=snippet&q=${searchTerm}`),
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
          Could not load videos for "{searchTerm}". Check your quota or API key, then retry.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant='h4' fontWeight="bold" mb={2} sx={{ color: 'white' }}>
        Search Results for: <span style={{ color : '#F31503'}}>{searchTerm}</span>
      </Typography>

      <Videos videos={videos} />
    </>
  )
}

export default SearchFeed