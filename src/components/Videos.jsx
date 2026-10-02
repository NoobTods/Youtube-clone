import { Box, Stack } from '@mui/material'
import { VideoCard, ChannelCard } from './'

const Videos = ({ videos }) => {
  return (
    <Stack 
        display="grid"
        gridTemplateColumns={{
            xs: '1fr',
            sm: 'repeat(auto-fill, minmax(260px, 1fr))',
        }}
        gap={2}
    >
        {videos.map((item, idx) => {
            if (item.id.videoId) {
                return <VideoCard key={idx} video={item} />;
            }

            if (item.id.channelId) {
                return (
                    <ChannelCard key={idx} channelDetail={item} />
                );
            }

            return null;
        })}

    </Stack>
  )
}

export default Videos