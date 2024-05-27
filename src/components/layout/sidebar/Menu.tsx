import { Card, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { menu } from './dataMenu';
import { useNavigate } from "react-router-dom";

const Menu = () => {
    const navigate = useNavigate(); // Хук, который возвращает функцию для навигации между маршрутами приложения
    return (
        <Card // Использование определенного стиля
            variant='outlined'
            sx={{
                padding: 2,
                backgroundColor: '#F5DEB3',
                border: 'none',
                borderRadius: 3,
                marginTop: 2,
                marginBottom: 10,
            }}
        >
            <List>
                {menu.map(item => (
                    <ListItem key={item.link} disablePadding>
                        <ListItemButton onClick={() => navigate(item.link)}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <item.icon />
                            </ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Card>
    );
}

export default Menu;