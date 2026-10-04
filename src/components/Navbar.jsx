import { Box, Stack } from '@mui/material'
import { Link } from 'react-router-dom'

import { logo } from '../utils/constants.jsx'
import SearchBar from './SearchBar.jsx'
import { MenuOutlined } from '@mui/icons-material'

const Navbar = ({ onToggleSidebar }) => (
  <Stack 
    direction="row" 
    alignItems="center" 
    p={1} 
    sx={{ position: 'sticky', background: '#0f0f0f', top: 0, justifyContent: 'space-between' }}
    zIndex={2000}
  >
    <Box
      display={'flex'}
    >
      <button 
        className='category-btn'
        onClick={onToggleSidebar}
        style={{
          border: 'none',
          background: 'transparent',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          padding: '0',
        }}
      >
        <span 
          style={{ 
            color: 'white',
            verticalAlign: 'middle',
            alignSelf: 'center',
            width: '100%',
          }}
        >
          <MenuOutlined />
        </span>
      </button>
      <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="logo" height={35} />
      </Link>
    </Box>
    <SearchBar />
  </Stack>
)

export default Navbar