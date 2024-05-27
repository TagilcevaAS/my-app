import { Alert, Box, TextField } from '@mui/material';
import React, { FC, KeyboardEvent, useState } from 'react';
import { useAuth } from '../../providers/useAuth';
import { addDoc, collection } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

const AddPost: FC = () => {
    // Используются хуки состояния useState для хранения значения содержимого поста (content) и для отслеживания ошибок (error). Через хук useAuth извлекаются данные о пользователе (user) и базе данных (db)
    const [content, setContent] = useState('');
    const { user, db } = useAuth();
    const [error, setError] = useState('');

    // Функция асинхронно обрабатывает событие нажатия клавиши Enter на поле ввода. Если нажата клавиша Enter и пользователь авторизован, то создается новый документ в коллекции "posts" с информацией об авторе, содержимом поста и временем создания.
    const addPostHandler = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && user) {
            try {
                await addDoc(collection(db, 'posts'), {
                    author: user,
                    content,
                    createdAt: Timestamp.now()
                });
            } catch (error: any) { // Если при добавлении поста возникает ошибка, то ошибка сохраняется в состоянии error
                setError(error);
            }
            setContent(''); //При успешном добавлении поста состояние content обновляется, очищая поле ввода
        }
    };

    return (
        <>
            {error && ( // Вывод предупреждения об ошибке при наличии ошибки
                <Alert severity='error' style={{ marginBottom: 20 }}>
                    {error}
                </Alert>
            )}
            <Box> 
                // Поле ввода текста (TextField) для создания нового поста с возможностью ввода, кнопкой "Enter" для отправки формы, обработчиком onChange для обновления состояния content и значением content, чтобы отображать введенное пользователем содержимое
                <TextField
                    label='Написать статью'
                    variant='outlined'
                    InputProps={{
                        sx: { borderRadius: '25px', bgcolor: '#F5DEB3' }
                    }}
                    sx={{
                        width: '100%'
                    }}
                    onKeyPress={addPostHandler}
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                />
            </Box>
        </>
    );
};

export default AddPost;