import React, { FC, useEffect, useState } from 'react';
import { IPost, IUser } from '../../../types';
import { Avatar, Box, IconButton, ImageList, ImageListItem, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../providers/useAuth';
import { collection, onSnapshot, updateDoc } from 'firebase/firestore';
import Card from '../../ui/Card';
import { Timestamp } from 'firebase/firestore';
import CancelIcon from '@mui/icons-material/Cancel';
import { doc, deleteDoc } from 'firebase/firestore';
import EditIcon from '@mui/icons-material/Edit';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    Button
} from '@mui/material';

const Posts: FC = () => {
    /* Определены следующие состояния с помощью хука useState:
    1. posts: массив объектов типа IPost, инициализированный пустым массивом.
    2. editedContent: строка, инициализированная пустой строкой.
    3. isEditing: объект с двумя полями postId (строка или null) и content (строка), инициализированный с postId равным null и content равным пустой строке.
    4. openDialog: булево значение, инициализированное как false. */
    const { db } = useAuth();
    const [posts, setPosts] = useState<IPost[]>([]);
    const [editedContent, setEditedContent] = useState('');
    const [isEditing, setIsEditing] = useState<{ postId: string | null, content: string }>({ postId: null, content: '' });
    const [openDialog, setOpenDialog] = useState(false);

    const updatePostContent = async (postId: string, newContent: string) => { // Асинхронная функция для обновления контента поста. Принимает postId и newContent, пытается обновить содержимое поста в базе данных, ловит ошибки, если они возникают
        try {
            await updateDoc(doc(db, 'posts', postId), {
                content: newContent
            });
        } catch (error) {
            console.error('Error updating post content:', error);
        }
    };

    const handleEditClick = (postId: string, content: string) => { // Функция для установки isEditing и открытия диалогового окна для редактирования контента поста. Принимает postId и content, устанавливает isEditing и открывает диалоговое окно
        setIsEditing({ postId, content });
        setOpenDialog(true);
    };

    const handleEditSave = async () => { // Асинхронная функция для сохранения изменений после редактирования. Если isEditing.postId существует, вызывает updatePostContent и сбрасывает isEditing после сохранения. Закрывает диалоговое окно
        if (isEditing.postId) {
            await updatePostContent(isEditing.postId, isEditing.content);
            setIsEditing({ postId: null, content: '' });
        }
        setOpenDialog(false);
    };

    const handleEditCancel = () => { // Функция для отмены редактирования. Сбрасывает значения isEditing и закрывает диалоговое окно
        setIsEditing({ postId: null, content: '' });
        setOpenDialog(false);
    };

    const deletePost = async (postId: string) => { // Асинхронная функция для удаления поста. Пытается удалить пост из базы данных, затем обновляет состояние posts, удаляя удаленный пост из массива
        try {
            await deleteDoc(doc(db, 'posts', postId));
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const editPost = async (postId: string) => { // Асинхронная функция для редактирования поста. Принимает postId, пытается обновить содержимое поста в базе данных, ловит ошибки, если они возникают
        try {
            await updateDoc(doc(db, 'posts', postId), {
                content: editedContent
            });
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    useEffect(() => { // Хук, который подписывается на изменения в коллекции posts в базе данных db. При изменениях обновляет локальное состояние posts с данными из базы данных
        const unsub = onSnapshot(collection(db, 'posts'), (snapshot) => {
            const postData: IPost[] = [];
            snapshot.forEach((doc) => {
                postData.push({
                    id: doc.id,
                    ...doc.data() as Omit<IPost, 'id'>
                });
            });
            setPosts(postData);
        });
        return () => {
            unsub();
        };
    }, [db]);

    return (
        <>
            {posts.map((post, index) => (
                <Card key={`Post-${index}`}>
                    <Box sx={{ position: 'relative' }}>
                        <Link
                            to={`/${post.id}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                color: 'black',
                                marginBottom: 12
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    marginRight: 2,
                                    width: 50,
                                    height: 50
                                }}
                            >
                                {post.author && post.author.avatar && (
                                    <Avatar
                                        src={post.author.avatar}
                                        alt=''
                                        sx={{ width: 46, height: 46, borderRadius: '50%' }}
                                    />
                                )}
                            </Box>
                            <div>
                                <div style={{ fontSize: 14 }}>
                                    {post.author && post.author.name ? post.author.name : 'Unknown'}
                                </div>
                                <div style={{ fontSize: 12, opacity: 0.6 }}>
                                    {post.createdAt instanceof Timestamp ? (
                                        new Intl.DateTimeFormat('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric'
                                        }).format(post.createdAt.toDate())
                                    ) : (
                                        'No date'
                                    )}
                                </div>
                            </div>
                        </Link>
                        <Typography
                            sx={{
                                width: 850,
                                wordWrap: 'break-word'
                            }}
                        >
                            {post.content}
                        </Typography>
                        {post?.images?.length && (
                            <ImageList variant='masonry' cols={4} gap={4}>
                                {post.images.map((image, idx) => (
                                    <ImageListItem key={idx}>
                                        <img
                                            src={image}
                                            alt=''
                                            loading='lazy'
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                            <IconButton onClick={() => handleEditClick(post.id, post.content)} sx={{ position: 'absolute', top: 8, left: 780 }}>
                                <EditIcon />
                            </IconButton>
                            <Dialog open={openDialog} onClose={handleEditCancel}>
                                <DialogTitle>Изменить</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Введите изменения:
                                    </DialogContentText>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="content"
                                        label="Content"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                        value={isEditing.content}
                                        onChange={(e) => setIsEditing({ ...isEditing, content: e.target.value })}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleEditCancel}>Отменить</Button>
                                    <Button onClick={handleEditSave}>Сохранить</Button>
                                </DialogActions>
                            </Dialog>
                            <IconButton
                                onClick={() => deletePost(post.id)}
                                sx={{ position: 'absolute', top: 8, right: 8 }}
                            >
                                <CancelIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Card >
            ))}
        </>
    );
};

export default Posts;