import React, { FC, useState } from 'react';
import { Search } from '@mui/icons-material'
import styles from './Header.module.css'
import logoImg from './logo.webp'

const Header: FC = () => {
    // Определено состояние isSearchActive с помощью хука useState, инициализированное значением false
    const [isSearchActive, setIsSearchActive] = useState(false)
    return ( // Взвращается JSX-разметка, содержащая следующие элементы:
        <header className={styles.header}>
            <div className={styles['image-wrapper']}>
                <img src={logoImg} alt='' />
            </div>
            <div className={styles.wrapper}>
                {!isSearchActive && <Search />}
                <input
                    type="text"
                    placeholder='Поиск'
                    onClick={() => setIsSearchActive(true)}
                />
            </div>
        </header>
    )
}

export default Header //Компонент экспортируется по умолчанию для использования в других частях приложения