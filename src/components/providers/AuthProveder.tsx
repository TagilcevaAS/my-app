import { FC, createContext, useState, ReactNode, useEffect, useMemo } from "react";
import { IUser, TypeSetState } from "../../types";
import { Auth, getAuth, onAuthStateChanged } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { doc, setDoc } from 'firebase/firestore';

interface IContext {
    user: IUser | null;
    setUser: TypeSetState<IUser | null>;
    ga: Auth;
    db: Firestore;
    updateUser: (updatedUser: IUser) => void;
}

interface AuthContextProps {
    children: ReactNode;
}

export const AuthContext = createContext<IContext>({} as IContext) // Создается контекст AuthContext с начальным значением {}

export const AuthProvider: FC<AuthContextProps> = ({ children }) => { // Создается компонент AuthProvider, который принимает дочерние элементы (children)
    // Внутри компонента AuthProvider определяются состояния user и setUser с помощью useState, а также инициализируются объекты ga (Auth) и db (Firestore) с помощью функций getAuth() и getFirestore() соответственно
    const [user, setUser] = useState<IUser | null>(null)
    const ga = getAuth()
    const db = getFirestore()

    const updateUser = async (updatedUser: IUser) => { // Обновление состояния user и запись обновленных данных пользователя в Firestore
        setUser(updatedUser);
        try {
            const userDocRef = doc(db, 'users', updatedUser._id);
            await setDoc(userDocRef, updatedUser);
        } catch (error) {
            console.error('Error updating user in Firestore:', error);
        }
    };

    useEffect(() => {
        const unListen = onAuthStateChanged(ga, authUser => { // Обработка изменения состояния аутентификации пользователя
            if (authUser) // Если пользователь вошел в систему, данные пользователя обновляются
                setUser(
                    {
                        _id: authUser.uid,
                        email: authUser.email || '',
                        avatar: '',
                        name: authUser.displayName || '',
                    }
                )
            else setUser(null)
        })
        return () => {
            unListen()
        }
    }, [])

    // Функция useMemo создает объект values, который содержит текущее состояние user, методы setUser и updateUser, а также объекты ga и db
    const values = useMemo(() => ({
        user,
        setUser,
        ga,
        db,
        updateUser,
    }), [user])

    // Возвращается AuthProvider, который оборачивает элементы в AuthContext.Provider и передает объект values через контекст
    // Элементы передаются внутри <AuthContext.Provider>, где их можно использовать для доступа к информации о пользователе и методам обновления данных
    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}