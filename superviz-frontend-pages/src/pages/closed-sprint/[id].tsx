"use client";

import React from "react";
import { useEffect, useState } from "react";
import {
	Card,
	CardActivity,
	List as ListInterface,
} from "../../interfaces/types";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setProject } from "@/redux/projectSlice";
import {
	setLists,
} from "@/redux/listsSlice";
import dynamic from "next/dynamic";
import { Loading } from "@/components/Loading";
import { getClosed } from "@/api/sprint";
import { leftSprint as leftSprintAction } from "@/redux/participantSlice";
import { setCardActivity } from "@/redux/cardActivitySlice";
import { getAllByCompany } from "@/api/user";
import { setUsers } from "@/redux/usersSlice";
import { closeSprint as closeSprintReq } from "@/api/sprint";
import ListClosed from "@/components/ListClosed";

const Sidebar = dynamic(
	() => import("@/components/Sidebar").then((mod) => mod.default),
	{ ssr: false }
);

export default function ClosedSprint() {
	const lists = useSelector((state: RootState) => state.lists);
	const [loading, setLoading] = useState<boolean>(true);
	const router = useRouter();
	const dispatch = useDispatch();
	const project = useSelector((state: RootState) => state.project);
	const sprint = useSelector((state: RootState) => state.sprint);
	const user = useSelector((state: RootState) => state.user);
	const users = useSelector((state: RootState) => state.users);

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
						user: users.find(user => user.id == item.id_user),
						created_at: item.created_at,
					});
				}
			});

			dispatch(setCardActivity(cards_activities_aux));
			dispatch(setLists(lists_aux));
			setLoading(false);
		});
	}, []);

	async function fetchData() {
		const aux = await getClosed(sprint.id);

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

	const leftSprint = () => {
		dispatch(leftSprintAction());
		window.location.href = "/join-sprint";
	};


	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<main
					className="flex overflow-auto min-h-screen flex-col items-center justify-center p-24 bg-gray-100 ml-64"
				>
					<Sidebar />
					<div
						className="container mx-auto px-4 py-8 h-screen"
					>
						<div className="w-full m-auto text-center flex flex-row justify-center">
							<span className="text-5xl font-extrabold text-purple-700">
								{project.name} - {sprint.title}
							</span>
						</div>
						<button
							onClick={leftSprint}
							className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 my-3 px-4 mx-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
						>
							Left
						</button>
						<div className="flex -mx-4 gap-8 h-full">
							{lists.map((list:any) => (
								<ListClosed data={list} key={list.id}/>
							))}
						</div>
					</div>
				</main>
			)}
		</>
	);
}
