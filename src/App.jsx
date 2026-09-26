import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import { Navbar, Sidebar, Feed, SearchFeed, ChannelDetail, VideoDetail, BottomNav } from './components';
import './App.css'

function App() {

  // [CHANGED] Sidebar moved here from Feed.jsx so it is part of the global
  // layout: it now stays visible next to the Navbar on every route, and it no
  // longer disappears while Feed is fetching (the loading spinner used to
  // replace the whole layout). The selected category is also persisted to
  // localStorage so refreshing the page keeps the same category highlighted.
  const [selectedCategory, setSelectedCategory] = useState(
    () => localStorage.getItem('selectedCategory') || 'New'
  );

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    localStorage.setItem('selectedCategory', category);
  };

  return (
    <BrowserRouter>
      <Box sx={{ backgroundColor: '#0f0f0f' }}>
        <Navbar />
        {/* [CHANGED] Same row layout Feed used to render, but at the app level:
            sidebar on the left, routed page on the right. */}
        <Stack sx={{ flexDirection: { xs: "column", md: "row" } }}>
          {/* Sur mobile la sidebar disparaît, remplacée par la BottomNav. */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              height: { md: 'calc(100vh - 56px)' },
              borderRight: '1px solid #3d3d3d',
              px: { md: 2 },
            }}
          >
            <Sidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={handleSelectCategory}
            />
            <Typography className='copyright' variant='body2' sx={{ mt: 1.5, color: '#fff' }}>
              Copyright 2026 Tods
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 2,
              p: { xs: 1.5, md: 2 },
              // Sur desktop la zone de contenu scrolle seule (comme YouTube),
              // sur mobile c'est la page entière qui scrolle.
              overflowY: { md: 'auto' },
              height: { md: 'calc(100vh - 56px)' },
              // Espace pour ne pas finir sous la BottomNav sur mobile.
              pb: { xs: '76px', md: 2 },
            }}
          >
            <Routes>
              <Route path='/' exact element={<Feed selectedCategory={selectedCategory} />} />
              <Route path='/video/:id' exact element={<VideoDetail />} />
              <Route path='/channel/:id' exact element={<ChannelDetail />} />
              <Route path='/search/:searchTerm' exact element={<SearchFeed />} />
            </Routes>
          </Box>
        </Stack>

        <BottomNav
          selectedCategory={selectedCategory}
          setSelectedCategory={handleSelectCategory}
        />
      </Box>
    </BrowserRouter>
  )
}

export default App
