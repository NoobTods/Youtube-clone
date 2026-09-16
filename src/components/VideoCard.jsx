import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react'
import { Link } from 'react-router-dom';
import { demoChannelTitle, demoChannelUrl, demoVideoTitle, demoVideoUrl } from '../utils/constants';
import { CheckCircle, Style } from '@mui/icons-material';

const VideoCard = ({ video : { id: { videoId }, snippet}}) => {

    return (
        <Card 
            sx={{ 
                width: { md: '320px', xs: '100%' }, 
                boxShadow: 'none', 
                borderRadius: 0,
                height: '300px',
                backgroundColor: '#000'
            }}
        >
            <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
                <CardMedia 
                    image={snippet?.thumbnails?.high?.url} 
                    alt={snippet?.title}
                    sx={{ 
                        width: {md: '320px', xs: '100%'}, 
                        height: 180, 
                        borderRadius: '10px', 
                    }}
                />
            </Link>
            <CardContent sx={{ backgroundColor: '#000', height: '106px'}}>
                <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
                    <Typography variant='subtitle1' fontWeight="bold" color="#fff">
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