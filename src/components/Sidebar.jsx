import { Box, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { categories } from '../utils/constants.jsx'


const Sidebar = ({ selectedCategory, setSelectedCategory, open, onClose }) => {
    const navigate = useNavigate();

    const handleClick = (name) => {
        setSelectedCategory(name);
        navigate('/');
        if (onClose) onClose(); // ferme le drawer en mobile
    };

    return (
    <>
        {/* Overlay sombre en mobile quand le drawer est ouvert */}
        <Box
            onClick={onClose}
            sx={{
                display: { xs: open ? 'block' : 'none', md: 'none' },
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1100,
            }}
        />
        <Stack
            direction="column"
            className={`sidebar${open ? '' : ' collapsed'}`}
            sx={{
                position: { xs: 'fixed', md: 'static' },
                top: { xs: '56px', md: 'auto' },
                left: 0,
                zIndex: 1150,
                backgroundColor: '#0f0f0f',
                overflowY: 'auto',
                height: { xs: 'calc(100vh - 56px)', md: 'calc(100vh - 56px)' },
                width: { xs: '240px', md: open ? '180px' : '72px' },
                borderRight: '1px solid #3d3d3d',
                px: { xs: 2, md: open ? 2 : 1 },
                transition: 'transform 0.3s ease, width 0.3s ease',
                transform: { xs: open ? 'translateX(0)' : 'translateX(-100%)', md: 'none' },
            }}
        >
            {categories.map((category) => {
                const Icon = category.icon?.default || category.icon;

                return (
                    <button
                        className='category-btn'
                        style={{
                            background: category.name === selectedCategory && '#2e2e2e',
                            color: 'white',
                        }}
                        onClick={() => handleClick(category.name)}
                        key={category.name}
                    >
                        <span
                            style={{ color: 'white' }}
                            className='category-icon'
                        >
                            <Icon />
                        </span>
                        <span
                            className='category-text'
                            style={{ opacity: category.name === selectedCategory ? '1' : '0.8' }}
                        >
                            {category.name}
                        </span>
                    </button>
                );
            })}
        </Stack>
    </>
    );
}

export default Sidebar
