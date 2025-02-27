'use client'
import React from 'react'
import { useRouter } from "next/navigation";
import style from './Card.module.css'

export interface CardProps {
    image?: string,
    header: string,
    description?: string,
    width?: number,
    path: string
}

const Card: React.FC<CardProps> = (
    {   image = 'https://placehold.co/100x100@2x.png',
        header,
        description,
        path = '/',
        width=200}) => {

    const router = useRouter();

    function goTo() {
        router.push(path);
    }

    return (
        <div
            style={{ width: `${width}px` }}
            className={style.Container}
            onClick={goTo}>
            <img className={style.Image} src={image} alt={header} />
            <div className='ml-2 mb-5'>
                <h3 className={style.Header}>{header}</h3>
                <p className={style.Description}>{description}</p>
            </div>
        </div>
    )
}

export default Card;