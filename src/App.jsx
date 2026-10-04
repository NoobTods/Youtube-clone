import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import { Navbar, Sidebar, Feed, SearchFeed, ChannelDetail, VideoDetail } from './components';
import './App.css'

function App() {

  const [selectedCategory, setSelectedCategory] = useState(
    () => localStorage.getItem('selectedCategory') || 'New'
  );

  // Sidebar ouvert par défaut sur desktop, fermé sur mobile
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 900);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    localStorage.setItem('selectedCategory', category);
  };

  return (
    <BrowserRouter>
      <Box sx={{ backgroundColor: '#0f0f0f' }}>
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <Stack sx={{ flexDirection: { xs: "column", md: "row" } }}>
          <Sidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={handleSelectCategory}
            open={sidebarOpen}
            onClose={() => { if (window.innerWidth < 900) setSidebarOpen(false); }}
          />
          <Box
            sx={{
              flex: 2,
              p: { xs: 1.5, md: 2 },
              overflowY: { md: 'auto' },
              height: { md: 'calc(100vh - 56px)' },
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
      </Box>
    </BrowserRouter>
  )
}

export default App
