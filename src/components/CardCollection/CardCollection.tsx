import React from 'react';
import Card, { CardProps } from '../Card/Card';
import style from './CardCollection.module.css'

interface CardCollectionProps {
    collection: CardProps[]; // Исправлено имя свойства на 'collection'
}

const CardCollection: React.FC<CardCollectionProps> = ({ collection }) => {
    return (
        <div className={style.Collection}>
            {collection.map((cardProps, index) => (
                <Card key={index} {...cardProps} /> // Используйте spread оператор для передачи свойств
            ))}
        </div>
    );
}

export default CardCollection;