import { Box, Stack } from '@mui/material'
import React from 'react'
import { VideoCard, ChannelCard } from './'

const Videos = ({ videos }) => {
  return (
    <Stack 
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        gap={2}
    >
        {videos.map((item, idx) => {
            if (item.id.videoId) {
                return (
                <Box key={idx}>
                    <VideoCard video={item} />
                </Box>
                );
            }

            if (item.id.channelId) {
                return (
                <Box key={idx}>
                    <ChannelCard channelDetail={item} />
                </Box>
                );
            }

            return null; // 🔥 évite les cartes vides
        })}

    </Stack>
  )
}

export default Videos