import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Box, CircularProgress, Stack } from "@mui/material";
import { ChannelCard, Videos } from "./";

const ChannelDetail = () => {
  const { id } = useParams();

  const { data: channelDetail, isLoading: isChannelLoading } = useQuery({
    queryKey: ['channel', id],
    queryFn: () => fetchFromAPI(`channels?part=snippet&id=${id}`).then((data) => data?.items[0]),
    enabled: !!id,
  });

  const { data: videos, isLoading: isVideosLoading } = useQuery({
    queryKey: ['channelVideos', id],
    queryFn: () => fetchFromAPI(`search?channelId=${id}&part=snippet&order=date`).then((data) => data?.items),
    enabled: !!id,
  });

  if (isChannelLoading || isVideosLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#F31503' }} />
      </Stack>
    );
  }

  return (
    <Box minHeight="95vh">
      <Box>
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(0,238,247,1) 0%, rgba(206,3,184,1) 100%, rgba(0,212,255,1) 100%)',
            zIndex: 10,
            height: '300px',
          }}
        />
        <ChannelCard channelDetail={channelDetail} marginTop="-110px"/>
      </Box>
      <Box display="flex" p={2}>
        <Box sx={{ mr: { sm: '100px' } }} />
        <Videos videos={videos} />
      </Box>
    </Box>
  )
}

export default ChannelDetail