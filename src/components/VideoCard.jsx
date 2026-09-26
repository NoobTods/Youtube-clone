import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react'
import { Link } from 'react-router-dom';
import { demoChannelTitle, demoChannelUrl, demoVideoTitle, demoVideoUrl } from '../utils/constants';
import { CheckCircle } from '@mui/icons-material';

const VideoCard = ({ video : { id: { videoId }, snippet}}) => {

    return (
        <Card 
            sx={{ 
                width: '100%',
                boxShadow: 'none', 
                borderRadius: '12px',
                backgroundColor: '#0f0f0f',
                padding: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                boxSizing: 'border-box',
                '&:hover': {
                    backgroundColor: '#272727',
                },
            }}
        >
            <Box sx={{ overflow: 'hidden', borderRadius: '10px' }}>
                <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
                    <CardMedia 
                        image={snippet?.thumbnails?.high?.url} 
                        alt={snippet?.title}
                        className="video-thumb"
                        sx={{ 
                            width: '100%', 
                            aspectRatio: '16/9',
                            borderRadius: '10px', 
                        }}
                    />
                </Link>
            </Box>
            <CardContent sx={{ backgroundColor: 'transparent', height: 'auto' }}>
                <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
                    <Typography 
                        variant='subtitle1' 
                        fontWeight="bold" 
                        color="#fff" 
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {snippet?.title.slice(0, 60) || demoVideoTitle.slice(0, 60)}
                    </Typography>
                </Link>
                <Link to={snippet?.channelId ? `/channel/${snippet?.channelId}` : demoChannelUrl}>
                    <Typography variant='subtitle2' fontWeight="bold" color="gray">
                        {snippet?.channelTitle || demoChannelTitle}
                        <CheckCircle sx={{ fontSize: 12, color: 'gray', ml: "5px" }} />
                    </Typography>
                </Link>
            </CardContent>
        </Card>
    )
}

export default VideoCard