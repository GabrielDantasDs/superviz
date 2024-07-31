"use client";

import React, { useEffect, useState } from "react";
import Column from "./Column";
import { List as ListInterface, Tag } from "../interfaces/types";
import { DragDropContext } from "react-beautiful-dnd";

interface Task {
	id: number;
	title: string;
	completed: boolean;
}

interface ListProps {
	lists: ListInterface[];
}

const Lists: React.FC<ListProps> = ({ lists }) => {
	const [data, setData] = useState<ListInterface[]>(lists);

	const onDragEnd = (result: any) => {
		const { destination, source, draggableId } = result;

		if (!destination) {
			return;
		}

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		const aux = [...data];
		const list = aux.find((list) => list.id == source.droppableId);
		const destinationList = aux.find((list) => list.id == destination.droppableId);

		// console.log(list);
		// console.log(source.index);
		// console.log(destination.index);
		// console.log(draggableId);

		if (list && destinationList) {
			let newCards = [...destinationList.cards];
			let replaceWith = newCards.find((card) => card.id == draggableId);

			if (replaceWith) {
				newCards.splice(source.index, 1);
				newCards.splice(destination.index, 0, replaceWith);

				const newList = { 
					...destinationList,
					cards: newCards
				};

				const listIndex = aux.findIndex(list => list.id == destination.droppableId);

				aux[listIndex] = newList;
				
				setData(aux);
			}
		}
	};

	return (
		<div className="container mx-auto px-4 py-8 h-screen">
			<div className="flex -mx-4 gap-y-8 overflow-x-auto overflow-y-auto h-full">
				<DragDropContext onDragEnd={onDragEnd}>
					{data.map((item, index) => (
						<Column
							id_list={item.id}
							key={item.index}
							cards={item.cards}
							header={item.header}
						/>
					))}
				</DragDropContext>
			</div>
		</div>
	);
};

export default Lists;
