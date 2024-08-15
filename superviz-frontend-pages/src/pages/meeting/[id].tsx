"use client";

import React from "react";
import { useEffect, useState } from "react";
import { List as ListInterface } from "../../interfaces/types";
import axios from "axios";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setProject } from "@/redux/projectSlice";
import {
	addCardToList,
	addNewList,
	removeCardFromList,
	setLists,
} from "@/redux/listsSlice";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import dynamic from "next/dynamic";
import { Loading } from "@/components/Loading";
import { get } from "@/api/project";
import { reorderCards, reorderLists } from "@/api/lists";

const Providers = dynamic(
	() => import("@/providers").then((mod) => mod.Providers),
	{ ssr: false }
);

const List = dynamic(() => import("@/components/List"), { ssr: false });

export default function Meeting() {
	const lists = useSelector((state: RootState) => state.lists);
	const [loading, setLoading] = useState<boolean>(true);
	const router = useRouter();
	const dispatch = useDispatch();
	const project = useSelector((state: RootState) => state.project);
	const meeting = useSelector((state: RootState) => state.meeting);

	useEffect(() => {
		fetchData().then((res) => {
			const lists_aux: ListInterface[] = [];
			console.log(res);

			res.lists.map((item: any, index: number) => {
				lists_aux.push({
					id: item.id,
					cards: item.cards,
					header: { title: item.title },
					position: item.position,
				});
			});

			dispatch(setLists(lists_aux));
			setLoading(false);
		});
	}, []);

	async function fetchData() {
		const aux = await get(meeting.id_project);

		dispatch(
			setProject({
				id: aux.id,
				name: aux.name,
				lists: aux.lists,
			})
		);

		localStorage.setItem("project_id", aux.id.toString());
		localStorage.setItem("project_name", aux.name);
		localStorage.setItem("project_lists", JSON.stringify(aux.lists));

		localStorage.setItem("lists", JSON.stringify(aux.lists));

		return aux;
	}

	async function addList() {
		await axios
			.post("http://localhost:8000/lists", {
				title: "Nova lista",
				position: lists.length > 0 ? lists.length : 0,
				id_project: project?.id,
			})
			.then((res) => {
				let list = {
					id: res.data.id,
					header: { title: res.data.title },
					position: res.data.position,
					cards: [],
				};

				dispatch(addNewList(list));
			});
	}

	const onDragEnd = (result: any) => {
		if (result.type == "CARD") {
			const { destination, source, draggableId } = result;

			if (!destination) {
				console.log("teste");
				return;
			}

			if (
				destination.droppableId === source.droppableId &&
				destination.index === source.index
			) {
				return;
			}

			const originList = lists.find(
				(list) => list.id == source.droppableId
			);
			const destinationList = lists.find(
				(list) => list.id == destination.droppableId
			);

			if (originList) {
				const movedCard = originList.cards.find(
					(card) => card.position == source.index
				);

				if (movedCard)
					dispatch(
						removeCardFromList({
							id_origin_list: source.droppableId,
							card: movedCard,
						})
					);

				if (destinationList) {
					if (movedCard)
						dispatch(
							addCardToList({
								id_destination_list: destination.droppableId,
								new_card_position: destination.index,
								card: movedCard,
							})
						);
				}

				reorderCards(originList.cards);
			}
		}

		if (result.type == "COLUMN") {
			const { destination, source, draggableId } = result;

			if (!destination) {
				console.log("teste");
				return;
			}

			if (
				destination.droppableId === source.droppableId &&
				destination.index === source.index
			) {
				return;
			}

			let aux = JSON.parse(JSON.stringify(lists));

			let list = aux.find(
				(list: ListInterface) => list.position == source.index
			);

			if (list) {
				if (destination.index > source.index) {
					aux = aux.map((item: ListInterface) => {
						if (
							item.position <= destination.index &&
							item.position > source.index &&
							item.position > 0
						) {
							return { ...item, position: item.position - 1 };
						}

						return item;
					});
					console.log(aux);
				}

				if (destination.index < source.index) {
					aux = aux.map((item: ListInterface) => {
						if (
							item.position >= destination.index &&
							item.position < source.index &&
							item.position < aux.length - 1
						) {
							return { ...item, position: item.position + 1 };
						}

						return item;
					});
				}

				list = { ...list, position: destination.index };

				let index = aux.findIndex(
					(item: ListInterface) => item.id == list.id
				);

				aux[index] = list;

				console.log(list)
			}

			aux = aux.sort((a:ListInterface,b:ListInterface) => a.position - b.position );

			console.log(aux)
			reorderLists(aux);

			dispatch(setLists(aux));
		}
	};

	return (
		<>
			{loading ? null : (
				<Providers>
					<main
						data-superviz-id="1"
						className="flex overflow-auto min-h-screen flex-col items-center justify-between p-24 bg-gray-100"
					>
						<div className="container mx-auto px-4 py-8 h-screen">
							<button
								onClick={addList}
								className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 my-3 px-4 mx-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
							>
								Nova lista
							</button>
							<DragDropContext onDragEnd={onDragEnd}>
								<Droppable
									droppableId="main"
									type="COLUMN"
									direction="horizontal"
								>
									{(provided) => (
										<div
											className="flex -mx-4 gap-y-8 h-full"
											ref={provided.innerRef}
											{...provided.droppableProps}
										>
											{lists.map((list) => (
												<List
													data={list}
													handleDragDrop={onDragEnd}
												/>
											))}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</DragDropContext>
						</div>
					</main>
				</Providers>
			)}
		</>
	);
}
