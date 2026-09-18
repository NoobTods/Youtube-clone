import { Stack } from '@mui/material'
import { categories } from '../utils/constants.jsx'


const Sidebar = ({ selectedCategory, setSelectedCategory}) => (
    <Stack
        direction="row"
        sx={{ 
            overflowY: "auto",
            height: { sx: "auto", md: "95%" },
            width: { md: "180px"},
            flexDirection: { md: "column" }
        }}
    >
        {categories.map((category) => {
            const Icon = category.icon?.default || category.icon;

            return (
                <button 
                    className='category-btn' 
                    style={{
                        background: category.name === selectedCategory && '#2e2e2e',
                        color: 'white'
                        
                    }}
                    onClick={() => setSelectedCategory(category.name)}
                    key={category.name}
                >
                    <span style={{ color: 'white', marginRight: '15px'}}><Icon /></span>
                    <span style={{ opacity: category.name === selectedCategory ? '1' : '0.8'}}>{category.name}</span>
                </button>
            );
        })}
    </Stack>
)

export default Sidebar