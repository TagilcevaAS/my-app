import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import { Alert, Button, ButtonGroup, Grid, TextField } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuth } from '../../providers/useAuth';
import { useNavigate } from 'react-router-dom';
import { IUserData } from '../../../types';

const Auth: FC = () => {
    // Инициализация переменных и состояний
    const { ga, user } = useAuth()
    const [isRegForm, setIsRegForm] = useState(false) // isRegForm устанавливает состояние формы на регистрацию или аутентификацию
    const [userData, setUserData] = useState<IUserData>({ // userData хранит данные пользователя (email, пароль, имя)
        email: '',
        password: '',
        name: '',
    } as IUserData)
    const [error, setError] = useState('') // Отображение ошибок

    /* Функция handleLogin обрабатывает вход пользователя. Если форма относится к регистрации (isRegForm равно true), то вызываются функции createUserWithEmailAndPassword и updateProfile для создания нового пользователя и обновления его профиля. В противном случае, вызывается функция signInWithEmailAndPassword для входа пользователя. Если происходит ошибка, она сохраняется в состоянии error. После обработки данных формы обнуляются */
    const handleLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isRegForm) {
            try {
                const res = await createUserWithEmailAndPassword(
                    ga,
                    userData.email,
                    userData.password
                )
                await updateProfile(res.user, {
                    displayName: userData.name,
                })
            } catch (error: any) {
                error.message && setError(error.message)
            }
        } else {
            try {
                await signInWithEmailAndPassword(
                    ga,
                    userData.email,
                    userData.password
                )
            } catch (error: any) {
                error.message && setError(error.message)
            }
        }
        setUserData({
            email: '',
            password: '',
            name: '',
        })
    }

    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/') // Переход на главную страницу при наличии авторизованного пользователя
    }, [user])

    /* Рендер происходит следующим образом:
    1. Если есть ошибка (error), отображается сообщение об ошибке.
    2. Далее идет форма с тремя полями ввода: имя, email, пароль.
    3. Кнопки "Auth" и "Register" в ButtonGroup используются для переключения между формой аутентификации и регистрации. */
    return (
        <>
            {error && (
                <Alert severity='error' style={{ marginBottom: 20 }}>
                    {error}
                </Alert>
            )}
            <Grid display='flex' justifyContent='center' alignItems='center'>
                <form onSubmit={handleLogin}>
                    <TextField
                        label='Name'
                        variant='outlined'
                        value={userData.name}
                        onChange={e => setUserData({ ...userData, name: e.target.value })}
                        sx={{ display: 'block', marginBottom: 1 }}
                        required
                    />
                    <TextField
                        type='email'
                        label='Email'
                        variant='outlined'
                        value={userData.email}
                        onChange={e => setUserData({ ...userData, email: e.target.value })}
                        sx={{ display: 'block', marginBottom: 1 }}
                        required
                    />
                    <TextField
                        type='password'
                        label='Password'
                        variant='outlined'
                        value={userData.password}
                        onChange={e => setUserData({ ...userData, password: e.target.value })}
                        sx={{ display: 'block', marginBottom: 2 }}
                        required
                    />
                    <ButtonGroup variant='outlined'>
                        <Button type='submit' onClick={() => setIsRegForm(false)}>Auth</Button>
                        <Button type='submit' onClick={() => setIsRegForm(true)}>Register</Button>
                    </ButtonGroup>
                </form>
            </Grid>
        </>
    )
}

export default Auth