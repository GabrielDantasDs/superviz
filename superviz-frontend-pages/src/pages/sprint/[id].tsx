"use client";

import React from "react";
import { useEffect, useState } from "react";
import {
	Card,
	CardActivity,
	List as ListInterface,
} from "../../interfaces/types";
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
import { leftSprint as leftSprintAction } from "@/redux/participantSlice";
import updateListSlice, { setUpdateList } from "@/redux/updateListSlice";
import { addNewActivity, setCardActivity } from "@/redux/cardActivitySlice";
import { createCardActivity } from "@/api/card-activity";
import dayjs from "dayjs";
import axiosInstance from "@/axiosInstance";
import { getAllByCompany } from "@/api/user";
import { setUsers } from "@/redux/usersSlice";
import { setUpdateCardsActivities } from "@/redux/updateCardsActivitiesSlice";
import { closeSprint as closeSprintReq} from "@/api/sprint";

const Providers = dynamic(
	() => import("@/providers").then((mod) => mod.Providers),
	{ ssr: false }
);

const Sidebar = dynamic(
	() => import("@/components/Sidebar").then((mod) => mod.default),
	{ ssr: false }
);

const List = dynamic(() => import("@/components/List"), { ssr: false });

export default function Sprint() {
	const lists = useSelector((state: RootState) => state.lists);
	const [loading, setLoading] = useState<boolean>(true);
	const router = useRouter();
	const dispatch = useDispatch();
	const project = useSelector((state: RootState) => state.project);
	const sprint = useSelector((state: RootState) => state.sprint);
	const participant = useSelector((state: RootState) => state.participant);
	const user = useSelector((state: RootState) => state.user);
	const [originList, setOriginList] = useState<string|number> ();
	const [destinationList, setDestintionList] = useState<string|number> ();

	useEffect(() => {
		fetchData().then((res) => {
			const lists_aux: ListInterface[] = [];
			const cards_activities_aux: CardActivity[] = [];

			res.lists.map((item: any, index: number) => {
				lists_aux.push({
					id: item.id,
					cards: item.cards,
					header: { title: item.title },
					position: item.position,
				});
			});

			res.cards_activities.map((item: any, index: number) => {
				const source_list: ListInterface | undefined = lists_aux.find(
					(list) => list.id == item.source_list_id
				);
				const destination_list: ListInterface | undefined =
					lists_aux.find(
						(list) => list.id == item.destination_list_id
					);
				if (source_list && destination_list) {
					const card: Card | undefined = source_list.cards.find(
						(card) => card.id == item.id_card
					);

					cards_activities_aux.push({
						id: item.id,
						destination_list: destination_list,
						destination_position: item.destination_position,
						source_list: source_list,
						source_position: item.source_position,
						card: card,
						user: user,
						created_at: item.created_at,
					});
				}
			});

			dispatch(setCardActivity(cards_activities_aux));
			dispatch(setLists(lists_aux));
		});
	}, []);

	useEffect(() => {
		if (participant.joined) {
			setLoading(false);
		}
	}, [participant]);

	useEffect(() => {
		if (originList) {
			const list = lists.find(list => list.id == originList);
			if (list)
				reorderCards(list.cards);
		}

		if (destinationList) {
			const list = lists.find(list => list.id == destinationList);
			if (list)
				reorderCards(list.cards);
		}
	}, [lists])

	async function fetchData() {
		const aux = await get(sprint.id_project, sprint.id);

		dispatch(
			setProject({
				id: aux.id,
				name: aux.name,
				lists: aux.lists,
				cards_activities: aux.cards_activities,
			})
		);

		localStorage.setItem("project_id", aux.id.toString());
		localStorage.setItem("project_name", aux.name);
		localStorage.setItem("project_lists", JSON.stringify(aux.lists));

		localStorage.setItem("lists", JSON.stringify(aux.lists));

		const users = await getAllByCompany(user.id_company);

		dispatch(setUsers(users));

		return aux;
	}

	async function addList() {
		await axiosInstance
			.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/lists`, {
				title: "New list",
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
				dispatch(setUpdateList(true));
			});
	}

	const onDragEnd = (result: any) => {
		if (result.type == "CARD") {
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

				console.log(lists)

				const card_activity: CardActivity = {
					destination_list: destinationList,
					destination_position: destination.index,
					source_list: originList,
					source_position: source.index,
					card: movedCard,
					user: user,
					created_at: dayjs().format("YYYY-MM-DD HH:mm"),
				};



				reorderCards(originList.cards);

				if (destinationList) {
					reorderCards(destinationList.cards);
				}

				dispatch(setUpdateList(true));
				dispatch(setUpdateCardsActivities(true));
				createCardActivity({
					destination_list_id: destinationList?.id,
					destination_position: destination.index,
					source_position: source.index,
					source_list_id: originList.id,
					id_card: movedCard?.id,
					id_user: user.id,
					id_sprint: sprint.id
				});

				dispatch(addNewActivity(card_activity));

				setOriginList(originList.id);
				
				if(destinationList)
					setDestintionList(destinationList.id)
			}
		}

		if (result.type == "COLUMN") {
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
			}

			aux = aux.sort(
				(a: ListInterface, b: ListInterface) => a.position - b.position
			);

			reorderLists(aux);

			dispatch(setLists(aux));
			dispatch(setUpdateList(true));
		}
	};


	const leftSprint = () => {
		dispatch(leftSprintAction());
		window.location.href = "/join-sprint";
	};

	const closeSprint = async () => {

		await closeSprintReq(sprint.id).then(res => {
			dispatch(leftSprintAction());
			window.location.href = "/join-sprint";
		})

	}

	return (
		<Providers>
			{loading ? (
				<Loading />
			) : (
				<main
					data-superviz-id="1"
					className="flex overflow-auto min-h-screen flex-col items-center justify-center p-24 bg-gray-100 ml-64"
				>
					<Sidebar />
					<div
						id="canva"
						className="container mx-auto px-4 py-8 h-screen"
					>
						<div className="w-full m-auto text-center flex flex-row justify-center">
							<span className="text-5xl font-extrabold text-purple-700">
								{project.name} - {sprint.title}
							</span>
						</div>
						<button
							onClick={closeSprint}
							className="bg-orange-700 hover:bg-orange-600 text-white font-bold py-3 my-3 px-4 mx-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
						>
							close
						</button>
						<button
							onClick={leftSprint}
							className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 my-3 px-4 mx-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
						>
							Left
						</button>
						<button
							onClick={addList}
							className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 my-3 px-4 mx-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
						>
							New list
						</button>
						<DragDropContext onDragEnd={onDragEnd}>
							<Droppable
								droppableId="main"
								type="COLUMN"
								direction="horizontal"
							>
								{(provided) => (
									<div
										className="flex -mx-4 gap-8 h-full"
										ref={provided.innerRef}
										{...provided.droppableProps}
									>
										{lists.map((list) => (
											<List
												data={list}
												handleDragDrop={onDragEnd}
												key={list.id}
											/>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</DragDropContext>
					</div>
				</main>
			)}
		</Providers>
	);
}
