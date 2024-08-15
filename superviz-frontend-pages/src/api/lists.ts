import { Card, List } from "@/interfaces/types";
import axios from "axios";

export async function renameList(id_list: number | string, title: string) {
	await axios
		.patch(`http://localhost:8000/lists/rename/${id_list}`, {
			title: title,
			id_list: id_list,
		})
		.then((res) => {
			return res.data.title;
		});
}

export async function reorderLists(lists: List[]) {
	await axios
		.patch(`http://localhost:8000/lists/reorder`, lists)
		.then((res) => {
			res.data;
		});
}

export async function reorderCards(cards: Card[]) {
    await axios
    .patch(`http://localhost:8000/cards/reorder`, cards)
    .then((res) => {
        res.data;
    });
}
