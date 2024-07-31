"use client";

import React from "react";
import { useEffect, useState } from "react";
import { List as ListInferface, Project } from "../../interfaces/types";
import axios from "axios";
import List from "@/components/List";
import { Provider } from "react-redux";
import { Providers } from "@/providers";
import {
	Comments,
	MousePointers,
	Realtime,
	WhoIsOnline,
	useCanvasPin,
	useRealtime,
} from "@superviz/react-sdk";
import Event from "@/components/Event";
import Wrapper from "@/components/Wrapper";
import Container from "@/components/Container";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setProject } from "@/redux/projectSlice";

export default function Meeting() {
	const [lists, setLists] = useState<ListInferface[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	// const [project, setProject] = useState<Project>();
	const router = useRouter();
	const dispatch = useDispatch();
	const project = useSelector((state: RootState) => state.project)

	useEffect(() => {
		fetchData();
	}, []);

	async function fetchData() {
		await axios
			.get(`http://localhost:8000/meetings/${router.query.id}`, {
				headers: { "ngrok-skip-browser-warning": "1" },
			})
			.then(async (res) => {
				if (res.status == 200) {
					await axios
						.get(
							`http://localhost:8000/projects/${res.data.id_project}`
						)
						.then((response) => {
							const lists: ListInferface[] = [];

							response.data.lists.map((item: any, index: number) => {
								lists.push({
									id: item.id,
									cards: item.cards,
									header: { title: item.title },
									index: index,
								});
							});

							dispatch(setProject(response.data));
							
							setLists(lists);
							setLoading(false);
						});
				}
			});
	}

	async function addList() {
		await axios
			.post("http://localhost:8000/lists", {
				title: "Nova lista",
				id_project: project?.id,
			})
			.then((res) => {
				const aux = lists;

				aux.push({
					id: res.data.id,
					header: { title: res.data.title },
					index: lists.length + 1,
					cards: [],
				});

				setLists([...aux]);
			});
	}

	return (
		<Providers>
			<main
				data-superviz-id="1"
				className="flex overflow-auto min-h-screen flex-col items-center justify-between p-24 bg-gray-100"
			>
				<Container>
					<button
						onClick={addList}
						className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 mx-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
					>
						Nova lista
					</button>
					<WhoIsOnline position="top-left" />

					<MousePointers elementId="canva" />

					<Wrapper />

					{!loading ? <List lists={lists} /> : null}
				</Container>
			</main>
		</Providers>
	);
}
