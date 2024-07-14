"use client"

import React from 'react';
import Card from './Card';
import Header from './Header';
import { Tag, Task } from '../interfaces/types';

interface ColumnProps {
    cards: { title: string; content: string; tags: Tag[], tasks: Task[]}[];
    header: { title: string }
}

const Column: React.FC<ColumnProps> = ({ cards, header }) => {
    return (
        <div className="w-full md:w-1/4 px-4 mb-8">
            <Header title={header.title}/>
            {cards.map((card, index) => (
                <Card
                    key={index}
                    title={card.title}
                    content={card.content}
                    tags={card.tags}
                    tasks={card.tasks}
                />
            ))}
        </div>
    );
};

export default Column;
