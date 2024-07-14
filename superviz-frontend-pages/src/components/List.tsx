"use client"

import React from 'react';
import Column from './Column';
import { Tag } from '../interfaces/types';

interface Task {
    id: number;
    title: string;
    completed: boolean;
}

interface ListProps {
    lists: { cards: { title: string; content: string; tags: Tag[], tasks: Task[] }[], header: { title: string }}[];
}

const List: React.FC<ListProps> = ({ lists }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap -mx-4 gap-y-8">
                {lists.map((list, index) => (
                    <Column key={index} cards={list.cards} header={list.header}/>
                ))}
            </div>
        </div>
    );
};

export default List;
