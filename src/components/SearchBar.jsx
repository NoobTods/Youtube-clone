import { Paper, IconButton } from '@mui/material'
import { Search } from '@mui/icons-material'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (searchTerm) {
            navigate(`/search/${searchTerm}`);

            setSearchTerm('');
        }
    }

    return (
        <Paper
            component="form"
            onSubmit={handleSubmit}
            sx={{
                background: '#0f0f0f',
                borderRadius: 20,
                border: '1px solid #2e2e2e',
                pl: 2,
                boxShadow: 'none',
                mr: { sm: 5 }
            }}
        >
            <input 
                className='search-bar'
                placeholder='Search...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton
                type="submit"
                sx={{ p: '5px', color: 'white' }}
            >
                <Search />
            </IconButton>
        </Paper>
    )
}

export default SearchBar