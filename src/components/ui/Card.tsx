import { Box } from "@mui/material"
import { FC, ReactNode } from "react";

// Определяется интерфейс CardProps, который указывает, что у компонента Card должно быть свойство children типа ReactNode
interface CardProps {
    children: ReactNode;
}

// Создается функциональный компонент Card с использованием типа FC<CardProps> для указания типа свойств
// Принимает дочерние элементы и отображает их внутри компонента Box со стилизацией, указанной в объекте sx
// Этот объект содержит определение границы, скругления углов, внутренний отступ и отступ сверху для компонента Box
const Card: FC<CardProps> = ({ children }) => {
    return (
        <Box
            sx={{
                border: '1px solid #F5DEB3',
                borderRadius: '10px',
                padding: 2,
                marginTop: 4,
            }}
        >
            {children}
        </Box>
    )
}

export default Card