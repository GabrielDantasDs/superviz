"use client";

import React, { useEffect } from "react";
import { List as ListInterface } from "../interfaces/types";
import {
	DragDropContext,
	Draggable,
	Droppable,
	OnDragEndResponder,
} from "@hello-pangea/dnd";
import { useDispatch } from "react-redux";
import { addCardToList } from "@/redux/listsSlice";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Header from "./Header";

import axios from "axios";
import EdiText from "react-editext";
import { renameList } from "@/api/lists";
import dynamic from "next/dynamic";
import { renameList as renameListAction } from "@/redux/listsSlice";

const Card = dynamic(import("@/components/Card"));

interface ListProps {
	data: ListInterface;
	handleDragDrop: OnDragEndResponder;
}

export default function List({ data, handleDragDrop }: ListProps) {
	const dispatch = useDispatch();
	const project = useSelector((state: RootState) => state.project);

	const addCard = async () => {
		await axios
			.post("http://localhost:8000/cards", {
				title: "Novo card",
				position: 0,
				id_list: data.id,
				id_project: project.id,
			})
			.then((res) => {
				let card = {
					id: res.data.id,
					position: res.data.position,
					title: res.data.title,
					id_list: res.data.id_list,
					content: res.data.content,
					tags: [],
					tasks: [],
				};

				dispatch(
					addCardToList({
						id_destination_list: data.id,
						new_card_position: 0,
						card,
					})
				);
			});
	};

	const handleRenameList = (title: string) => {
		const new_title = renameList(data.id, title);
		dispatch(renameListAction({ id_list: data.id, title: title }));
	};

	return (
		<Draggable
			index={data.position}
			draggableId={data.id.toString()}
			key={data.id}
		>
			{(provided, snapshot) => (
				<div
					className="w-300 px-4 mb-8 flex-shrink-0 list"
					ref={provided.innerRef}
					{...provided.draggableProps}
				>
					<div className="bg-white shadow-lg rounded-lg overflow-hidden mb-4" {...provided.dragHandleProps}>
						<div className="px-4 py-2">
							<h2 className="text-xl font-bold text-gray-800">
							<EdiText
							type="text"
							value={data.header.title}
							onSave={handleRenameList}
						/>
							</h2>
						</div>
					</div>
						<Droppable droppableId={data.id.toString()} type="CARD">
							{(provided) => (
								<div
									className="min-height-width"
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									<div className="mb-4">
										<button
											onClick={addCard}
											className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 mx-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
										>
											Novo card
										</button>
									</div>

									{data.cards.map((card, index) => {
										return (
											<Card
												id={card.id}
												id_list={card.id_list}
												key={card.id}
												position={card.position}
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
			)}
		</Draggable>
	);
}
