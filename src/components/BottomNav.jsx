import React from 'react'
import { Box } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'

const items = [
    { name: 'New', label: 'Home', icon: HomeIcon },
    { name: 'Music', label: 'Music', icon: MusicNoteIcon },
    { name: 'Gaming', label: 'Gaming', icon: SportsEsportsIcon },
    { name: 'Sport', label: 'Sport', icon: FitnessCenterIcon },
];

const BottomNav = ({ selectedCategory, setSelectedCategory }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/';

    const handleClick = (name) => {
        setSelectedCategory(name);
        if (!isHome) navigate('/');
    };

    return (
        <Box
            sx={{
                display: { xs: 'flex', md: 'none' },
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1200,
                backgroundColor: '#0f0f0f',
                borderTop: '1px solid #3d3d3d',
                justifyContent: 'space-around',
                padding: '6px 0 env(safe-area-inset-bottom)',
            }}
        >
            {items.map((item) => {
                const { name, label } = item;
                const Icon = item.icon?.default || item.icon;
                const isActive = isHome && selectedCategory === name;

                return (
                    <Box
                        key={name}
                        component="button"
                        onClick={() => handleClick(name)}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px',
                            background: 'none',
                            border: 'none',
                            padding: '4px 14px',
                            cursor: 'pointer',
                            color: isActive ? '#fff' : '#aaaaaa',
                        }}
                    >
                        <Icon />
                        <Box sx={{ fontSize: '10px' }}>{label}</Box>
                    </Box>
                );
            })}
        </Box>
    )
}

export default BottomNav
