import React, { FC, ReactNode } from 'react';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import { Grid } from '@mui/material';
import { useAuth } from '../providers/useAuth';

// Интерфейс LayoutProps определяет свойство children, которое должно быть типа ReactNode и представляет дочерние элементы компонента
interface LayoutProps {
    children: ReactNode;
}

// Функциональный компонент Layout принимает свойства согласно интерфейсу LayoutProps
const Layout: FC<LayoutProps> = ({ children }) => {
    const { user } = useAuth() // С помощью хука извлекается объект user с информацией о текущем пользователе
    return (
        <>
            <Header />
            <Grid container spacing={2} marginX={5} marginTop={2}>
                {user && (
                    <Grid item md={3}>
                        <Sidebar />
                    </Grid>
                )}
                <Grid item md={user ? 8 : 12}>
                    {children}
                </Grid>
            </Grid>
        </>
    )
}

export default Layout