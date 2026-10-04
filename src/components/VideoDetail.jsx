import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import ReactPlayer from 'react-player/youtube'
import { Link, useParams } from 'react-router-dom'
import { fetchFromAPI, API_PROVIDER } from '../utils/fetchFromAPI'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle } from '@mui/icons-material'
import Videos from './Videos'

const VideoDetail = () => {
  const { id } = useParams();

  const { data: videoDetail, isPending: isVideoDetailPending, isError: isVideoDetailError } = useQuery({
    queryKey: ['videoDetail', id],
    queryFn: () => fetchFromAPI(`videos?part=snippet,statistics&id=${id}`),
    select: (res) => res.items[0] ?? null,
  });

  const { snippet: { title, channelTitle, channelId } = {}, statistics: { viewCount, likeCount } = {} } = videoDetail || {};

  if (isVideoDetailPending) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#F31503' }} />
      </Stack>
    );
  }

  if (isVideoDetailError) {
    return (
      <Box p={2}>
        <Typography variant='h6' sx={{ color: 'white' }}>
          Could not load video details. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box minHeight="95vh">
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} flexWrap="wrap">
        <Box flex={1} sx={{ minWidth: { md: '400px' } }}>
          <Box sx={{ width: '100%', position: 'sticky', top: '15px'}}>
            <Box sx={{ borderRadius: '10px', overflow: 'hidden', width: '100%', aspectRatio: '16/9' }}>
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${id}`}
                controls
                width="100%"
                height="100%"
                className="react-player"
              />
            </Box>
            <Typography variant='h6' sx={{ color: 'white' }} fontWeight="bold" p={2}>
              {title}
            </Typography>
            <Stack direction="row" justifyContent="space-between" px={2} py={1}>
              <Link to={`/channel/${channelId}`}>
                <Typography variant={{ sm: 'subtitile1', md: 'h6'}} color={'white'} >
                  {channelTitle}
                  <CheckCircle sx={{ fontSize: '12px', color: 'gray', ml: '5px' }} />
                </Typography>
              </Link>
              <Typography variant='body1' sx={{ opacity: 0.7, color: 'white' }}>
                {parseInt(viewCount).toLocaleString()} views • {parseInt(likeCount).toLocaleString()} likes
              </Typography>
            </Stack>
          </Box>
        </Box>
        <Box py={{ md: 1, xs: 2 }} justifyContent="center" alignItems="center" sx={{ width: { xs: '100%', md: '300px' }, flexShrink: 0 }}>
          <RelatedVideos id={id} title={title} />
        </Box>
      </Stack>
    </Box>
  )
}

const RelatedVideos = ({ id, title }) => {
  const { data: videos, isPending, isError } = useQuery({
    queryKey: ['videos', id, API_PROVIDER],
    //L'API officielle ne supporte plus relatedToVideoId : on cherche des vidéos par titre à la place.
    queryFn: () =>
      API_PROVIDER === 'official'
        ? fetchFromAPI(`search?part=snippet&q=${encodeURIComponent(title ?? '')}`)
        : fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`),
    select: (res) => res.items ?? [],
    enabled: !!id && (API_PROVIDER !== 'official' || !!title),
  });

  if (isPending) {
    return (
      <Stack alignItems="center" sx={{ py: 4 }}>
        <CircularProgress sx={{ color: '#F31503' }} />
      </Stack>
    );
  }

  if (isError) {
    return (
      <Typography variant='body2' sx={{ color: 'white', opacity: 0.7 }}>
        Could not load related videos.
      </Typography>
    );
  }

  return <Videos videos={videos} />;
};

export default VideoDetail