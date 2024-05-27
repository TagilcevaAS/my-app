import React, { FC, useState, useRef, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../providers/useAuth';
import { Box, TextField, Button, Select, MenuItem, SelectChangeEvent } from '@mui/material';


interface ProfileData { // Интерфейс ProfileData, который представляет данные профиля пользователя (имя, описание, email, пол, город, аватар)
    name: string;
    about?: string;
    email?: string;
    gender?: string;
    city?: string;
    avatar?: string;
}
enum Gender {
    Male = 'male',
    Female = 'female',
}

const AddPost: FC = () => {
    const { user, db } = useAuth(); // С помощью хука useAuth получаем данные о пользователе и базу данных
    const [profileData, setProfileData] = useState<ProfileData>({ // Хук используется для хранения состояния profileData, инициализируем его пустым объектом
        name: '',
        about: '',
        email: '',
        gender: '',
        city: '',
    });
    
    useEffect(() => { // Загрузка данных пользователя из базы данных при монтировании компонента
        const fetchUserData = async () => {
            if (user) {
                const userDocRef = doc(db, 'users', user._id);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data() as ProfileData;
                    setProfileData(userData);
                }
            }
        };
        fetchUserData();
    }, [user, db]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Обработка изменения в полях ввода и обновляет соответствующие поля в profileData
        const { name, value } = e.target;
        setProfileData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveProfile = async () => { // Сохраняет обновленные данные профиля пользователя в базе данных
        if (user) {
            const userDocRef = doc(db, 'users', user._id);
            const { name, email, about, city, gender } = profileData;
            try {
                await updateDoc(userDocRef, {
                    name,
                    email,
                    about,
                    city,
                    gender,
                });
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        }
    };

    const handleGenderChange = (e: SelectChangeEvent<string>) => { // Обрабатывает изменение пола пользователя и обновляет данные в profileData
        if (user) {
            setProfileData({
                ...profileData,
                gender: e.target.value as Gender,
            });
        }
    };
    const inputRef = useRef<HTMLInputElement>(null); // Получение ссылки на элемент input

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: '20px',
                }}
            >
                <TextField
                    label="Имя"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Электронная почта"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                />
                <TextField
                    label="О себе"
                    name="about"
                    value={profileData.about}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                />
                <TextField
                    label="Город"
                    name="city"
                    value={profileData.city}
                    onChange={handleInputChange}
                />
                <Select
                    label="Пол"
                    name="gender"
                    value={profileData.gender}
                    onChange={handleGenderChange}
                >
                    <MenuItem value="Мужской">Мужской</MenuItem>
                    <MenuItem value="Женский">Женский</MenuItem>
                </Select>
                <Button variant="contained" onClick={handleSaveProfile}>
                    Сохранить
                </Button>
            </Box>
        </>
    );
};

export default AddPost;