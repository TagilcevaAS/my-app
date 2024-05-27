import * as Icons from '@mui/icons-material'
import { IMenuItem } from '../../../types'

export const menu: IMenuItem[] = [
    {
        title: 'Профиль',
        link: '/profile',
        icon: Icons.Home
    },
    {
        title: 'Новости',
        link: '/',
        icon: Icons.Article
    },
]