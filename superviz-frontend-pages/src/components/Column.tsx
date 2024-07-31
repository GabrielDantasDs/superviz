"use client";

import React, { useEffect, useState } from "react";
import Card from "./Card";
import Header from "./Header";
import { Card as CardInterface, Tag, Task } from "../interfaces/types";
import { Droppable } from "react-beautiful-dnd";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface ColumnProps {
	id_list: number | string,
	cards: { id:number | string, title: string; content: string; tags: Tag[]; tasks: Task[] }[];
	header: { title: string };
}

const Column: React.FC<ColumnProps> = ({ id_list, cards, header }) => {
	const [_cards, setCards] = useState<CardInterface[]>(cards);
	const project = useSelector((state: RootState) => state.project);

	useEffect(() => {
		setCards(cards);
	}, [cards])
	
	const addCard = async () => {
		await axios
		.post("http://localhost:8000/cards", {
			title: "Novo card",
			id_list: id_list,
			id_project: project?.id,
		})
		.then((res) => {
			const aux = _cards;
	
			aux.push({
				id: res.data.id,
				content: "",
				tags: [],
				tasks: [],
				title: res.data.title,
				index: _cards.length + 1
			});
			console.log(aux)
			setCards([...aux]);
		});
	};

	return (
		<div className="w-300 px-4 mb-8 flex-shrink-0">
			<Header title={header.title} />
			<Droppable droppableId={id_list.toString()} type="CARD">
				{(provided) => (
					<div ref={provided.innerRef} {...provided.droppableProps}>
						<div className="mb-4">
							<button
								onClick={addCard}
								className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 mx-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
							>
								Novo card
							</button>
						</div>

						{_cards.map((card, index) => {
							return (
								<Card
									id={card.id}
									key={card.id}
									index={index}
									title={card.title}
									content={card.content}
									tags={card.tags}
									tasks={card.tasks}
								/>
							);
						})}
						
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</div>
	);
};

export default Column;
