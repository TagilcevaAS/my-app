import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { Dispatch, SetStateAction } from "react";
import { Timestamp } from 'firebase/firestore';

//тип, который представляет собой функцию для установки состояния (useState), принимающую аргумент типа T
export type TypeSetState<T> = Dispatch<SetStateAction<T>>

//интерфейс, который описывает структуру данных пользователя
export interface IUser { //свойства
    _id: string //идентификатор пользователя
    avatar?: string //ссылка на аватар пользователя
    name: string //имя пользователя
    city?: string //город пользователя
    gender?: string //пол пользователя
    about?: string //описание пользователя
    email?: string //адрес электронной почты
}

//интерфейс, описывающий структуру данных поста
export interface IPost { //свойства
    id: string //идентификатор поста
    author: IUser //автор поста, соответствующий интерфейсу IUser
    createdAt: Timestamp | Date //дата и время создания поста
    content: string //содержание поста
    images?: string[] //массив ссылок на изображения
}

//интерфейс, описывающий структуру данных для элемента меню
export interface IMenuItem { //свойства
    title: string //заголовок пункта меню
    link: string //ссылка на которую ведет пункт меню
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string; } //иконка пункта меню, представленная в данном формате, и имеющая свойство muiName
}

//интерфейс, описывающий структуру данных для пользователя, который будет зарегистрирован в системе
export interface IUserData { //свойства
    email: string //адрес электронной почты пользователя
    password: string //пароль пользователя
    name: string //имя пользователя
}