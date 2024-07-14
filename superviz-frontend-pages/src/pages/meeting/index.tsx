"use client";

import React from "react";
import { useEffect, useState } from "react";
import { List as ListInferface } from "../../interfaces/types";
import axios from "axios";
import List from "@/components/List";
import { Provider } from "react-redux";
import { Providers } from "@/providers";

export default function Meeting() {
	const [lists, setLists] = useState<ListInferface[]>([]);

	useEffect(() => {
		fetchData();
	}, []);

	async function fetchData() {
		await axios.get("http://localhost:8000/projects/1").then((res) => {
			const list: ListInferface[] = [];

			list.push({
				header: { title: "Backlog" },
				cards: res.data.backlog,
			});
			list.push({
				header: { title: "In Progress" },
				cards: res.data.in_progress,
			});
			list.push({ header: { title: "Done" }, cards: res.data.done });
			list.push({
				header: { title: "Deployed" },
				cards: res.data.deployed,
			});

			setLists(list);
		});
	}

	return (
		<Providers>
			<main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-100">
				<div className="container mx-auto px-4 py-8">
					<List lists={lists} />
				</div>
			</main>
		</Providers>
	);
}
