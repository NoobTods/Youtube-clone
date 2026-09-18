import { Paper, IconButton } from '@mui/material'
import { Search } from '@mui/icons-material'

const SearchBar = () => {
  return (
    <Paper
        component="form"
        onSubmit={() => {}}
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
            value=""
            onChange={() => {}}
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