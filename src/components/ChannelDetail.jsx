import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Box, CircularProgress, Stack } from "@mui/material";
import { ChannelCard, Videos } from "./";
import LazySection from "./LazySection";

const ChannelDetail = () => {
  const { id } = useParams();

  const { data: channelDetail, isLoading: isChannelLoading } = useQuery({
    queryKey: ['channel', id],
    queryFn: () => fetchFromAPI(`channels?part=snippet&id=${id}`).then((data) => data?.items[0]),
    enabled: !!id,
  });

  if (isChannelLoading) {
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
        {/* [CHANGED - quota] Les vidéos de la chaîne ne sont demandées que
            lorsque l'utilisateur scrolle jusqu'à cette section */}
        <LazySection>
          <ChannelVideos id={id} />
        </LazySection>
      </Box>
    </Box>
  )
}

// [CHANGED - quota] Composant séparé : sa query ne s'exécute que lorsqu'il est
// monté (c.-à-d. quand LazySection le rend visible).
const ChannelVideos = ({ id }) => {
  const { data: videos, isLoading, isError } = useQuery({
    queryKey: ['channelVideos', id],
    queryFn: () => fetchFromAPI(`search?channelId=${id}&part=snippet&order=date`).then((data) => data?.items),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Stack alignItems="center" sx={{ py: 4 }}>
        <CircularProgress sx={{ color: '#F31503' }} />
      </Stack>
    );
  }

  if (isError) {
    return (
      <p style={{ color: 'white', opacity: 0.7 }}>Could not load channel videos.</p>
    );
  }

  return <Videos videos={videos} />;
};

export default ChannelDetail