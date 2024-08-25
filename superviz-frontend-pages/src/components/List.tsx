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
import { addCardToList, removeList } from "@/redux/listsSlice";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Header from "./Header";

import axios from "axios";
import EdiText from "react-editext";
import { renameList } from "@/api/lists";
import dynamic from "next/dynamic";
import { renameList as renameListAction } from "@/redux/listsSlice";
import { setUpdateList } from "@/redux/updateListSlice";
import { removeList as removeListReq } from "@/api/lists";
import axiosInstance from "@/axiosInstance";

const Card = dynamic(import("@/components/Card"));

interface ListProps {
	data: ListInterface;
	handleDragDrop: OnDragEndResponder;
}

export default function List({ data, handleDragDrop }: ListProps) {
	const dispatch = useDispatch();
	const project = useSelector((state: RootState) => state.project);

	const addCard = async () => {
		await axiosInstance
			.post("http://localhost:8000/cards", {
				title: "New card",
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

				dispatch(setUpdateList(true));
			});
	};

	const handleRenameList = (title: string) => {
		const new_title = renameList(data.id, title);
		dispatch(renameListAction({ id_list: data.id, title: title }));
		dispatch(setUpdateList(true));
	};

	const handleRemoveList = async () => {
		await removeListReq(data.id).then((res) => {
			dispatch(removeList(data.id));
			dispatch(setUpdateList(true));
		});
	};

	return (
		<Draggable
			index={data.position}
			draggableId={data.id.toString()}
			key={data.id}
		>
			{(provided, snapshot) => (
				<div
					className="w-96 p-4 mb-8 flex-shrink-0 bg-slate-200 .list"
					ref={provided.innerRef}
					{...provided.draggableProps}
				>
					<div
						className="bg-white shadow-lg rounded-lg overflow-hidden mb-4"
						{...provided.dragHandleProps}
					>
						<div className="px-4 py-2 flex">
							<h2 className="text-xl font-bold text-gray-800">
								<EdiText
									type="text"
									value={data.header.title}
									onSave={handleRenameList}
								/>
							</h2>
							<button
								onClick={handleRemoveList}
								className="bg-red-700 hover:bg-red-600 text-white font-bold py-4 px-4 mx-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="size-5"
								>
									<path
										fillRule="evenodd"
										d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
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
										New card
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
											id_user={card.id_user}
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
