import React, { FC, useEffect, useState } from 'react';
import { IPost, IUser } from '../../../types';
import { Avatar, Alert, Box, IconButton, ImageList, ImageListItem, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../providers/useAuth';
import { collection, onSnapshot, doc, getDoc, query, where, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import Card from '../../ui/Card';
import { Timestamp } from 'firebase/firestore';
import CancelIcon from '@mui/icons-material/Cancel';
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

interface PostsProps {
    tagFilter: string;
    setTagFilter: React.Dispatch<React.SetStateAction<string>>;
}

const Posts: FC<PostsProps> = ({ tagFilter, setTagFilter }) => {
    /* Определены следующие состояния с помощью хука useState:
    1. posts: массив объектов типа IPost, инициализированный пустым массивом.
    2. editedContent: строка, инициализированная пустой строкой.
    3. isEditing: объект с двумя полями postId (строка или null) и content (строка), инициализированный с postId равным null и content равным пустой строке.
    4. openDialog: булево значение, инициализированное как false. */
    const { db } = useAuth();
    const [error, setError] = useState('') // Отображение ошибок
    const { user, ga } = useAuth() // Для получения данных о текущем пользователе
    const [posts, setPosts] = useState<IPost[]>([]);
    const [editedContent, setEditedContent] = useState('');
    const [isEditing, setIsEditing] = useState<{ postId: string | null, content: string }>({ postId: null, content: '' });
    const [openDialog, setOpenDialog] = useState(false);
    // Асинхронная функция для обновления контента поста. Принимает postId и newContent, пытается обновить содержимое поста в базе данных, ловит ошибки, если они возникают
    const updatePostContent = async (postId: string, newContent: string) => {
        try {
            await updateDoc(doc(db, 'posts', postId), {
                content: newContent
            });
        } catch (error) {
            console.error('Error updating post content:', error);
        }
    };
    // Функция для установки isEditing и открытия диалогового окна для редактирования контента поста. Принимает postId и content, устанавливает isEditing и открывает диалоговое окно
    const handleEditClick = (postId: string, content: string, userId?: string) => {
        if (userId && userId !== user?._id) {
            setError('Нельзя редактировать статью другого пользователя');
            return;
        }
        setIsEditing({ postId, content });
        setOpenDialog(true);
    };
    // Асинхронная функция для сохранения изменений после редактирования. Если isEditing.postId существует, вызывает updatePostContent и сбрасывает isEditing после сохранения. Закрывает диалоговое окно
    const handleEditSave = async () => {
        if (isEditing.postId) {
            await updatePostContent(isEditing.postId, isEditing.content);
            setIsEditing({ postId: null, content: '' });
        }
        setOpenDialog(false);
    };
    // Функция для отмены редактирования. Сбрасывает значения isEditing и закрывает диалоговое окно
    const handleEditCancel = () => {
        setIsEditing({ postId: null, content: '' });
        setOpenDialog(false);
    };
    // Асинхронная функция для удаления поста. Пытается удалить пост из базы данных, затем обновляет состояние posts, удаляя удаленный пост из массива
    const deletePost = async (postId: string, userId: string) => {
        if (userId !== user?._id) {
            setError('Нельзя удалять статью другого пользователя');
            return;
        }
        try {
            await deleteDoc(doc(db, 'posts', postId));
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };
    // Асинхронная функция для редактирования поста. Принимает postId, пытается обновить содержимое поста в базе данных, ловит ошибки, если они возникают
    const editPost = async (postId: string, userId: string) => {
        if (userId !== user?._id) {
            console.log('You are not authorized to edit this post.');
            return;
        }
        try {
            await updateDoc(doc(db, 'posts', postId), {
                content: editedContent
            });
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };
    // Хук, который подписывается на изменения в коллекции posts в базе данных db. При изменениях обновляет локальное состояние posts с данными из базы данных
    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'posts'), (snapshot) => {
            const postData: IPost[] = [];
            snapshot.forEach((doc) => {
                const post = {
                    id: doc.id,
                    ...doc.data() as Omit<IPost, 'id'>
                };
                if (tagFilter === '' || post.tags.includes(tagFilter)) {
                    postData.push(post);
                }
            });
            setPosts(postData);
        });
        return () => {
            unsub();
        };
    }, [db, tagFilter]);

    return (
        <>
            {error && (
                <Alert severity='error' style={{ marginBottom: 20 }}>
                    {error}
                </Alert>
            )}
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
                            <p>{post.content}</p>
                            <div>
                                {post.tags.map((tag, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'inline-block',
                                            border: '1px solid black',
                                            borderRadius: '20px',
                                            padding: '5px 10px',
                                            margin: '5px'
                                        }}
                                    >
                                        {tag}
                                    </Box>
                                ))}
                            </div>
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
                            <IconButton onClick={() => handleEditClick(post.id, post.content, post.author._id)} sx={{ position: 'absolute', top: 8, left: 780 }}>
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
                                onClick={() => deletePost(post.id, post.author._id)} // Pass the postId and userId
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
