import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import { Navbar, Sidebar, Feed, SearchFeed, ChannelDetail, VideoDetail } from './components';
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
      <Box sx={{ backgroundColor: '#000' }}>
        <Navbar />
        {/* [CHANGED] Same row layout Feed used to render, but at the app level:
            sidebar on the left, routed page on the right. */}
        <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
          <Box sx={{ height: { sx: "auto", md: "92vh" }, borderRight: "1px solid #3d3d3d", px: { sx: 0, md: 2 } }}>
            <Sidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={handleSelectCategory}
            />
            <Typography className='copyright' variant='body2' sx={{ mt: 1.5, color: '#fff' }}>
              Copyright 2026 Tods
            </Typography>
          </Box>
          <Box p={2} sx={{ overflowY: "auto", height: "90vh", flex: 2 }}>
            <Routes>
              <Route path='/' exact element={<Feed selectedCategory={selectedCategory} />} />
              <Route path='/video/:id' exact element={<VideoDetail />} />
              <Route path='/channel/:id' exact element={<ChannelDetail />} />
              <Route path='/search/:searchTerm' exact element={<SearchFeed />} />
            </Routes>
          </Box>
        </Stack>
      </Box>
    </BrowserRouter>
  )
}

export default App
