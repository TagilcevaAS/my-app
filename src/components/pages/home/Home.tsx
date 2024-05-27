import AddPost from './AddPost';
import { Box } from '@mui/material';
import Posts from './Posts';

const Home = () => {
    return (
        <Box>
            <AddPost />
            <Posts />
        </Box>
    )
}

export default Home