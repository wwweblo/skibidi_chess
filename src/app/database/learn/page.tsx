import React from 'react'
import { CardProps } from '@/components/Card/Card';
import CardCollection from '@/components/CardCollection/CardCollection'

const LearnPage = () => {

    const Cards: CardProps[] = [
        {image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYx5IT0jbepzxU4fB_ruAHsucVmFTqqyNwng&s', header: 'Card 1', path:'/'},
        {header: 'Card 2', description:'lorem ',path:'/'},
        {header: 'Card 3', path:'/'}
    ];

  return (
    <>
        <h2>LearnPage</h2>
        <CardCollection collection={Cards}/>
    </>
  );
}

export default LearnPage