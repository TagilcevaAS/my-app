import { useContext } from "react"
import { AuthContext } from "./AuthProveder"

// Создается пользовательский хук useAuth, который использует useContext для получения значения из контекста AuthContext
export const useAuth = () => {
    // useAuth возвращает значение, полученное из AuthContext, которое может быть использовано в компоненте, использующем этот хук для доступа к данным, хранящимся в контексте
    const value = useContext(AuthContext)
    return value
}