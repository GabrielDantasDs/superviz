import axiosInstance from "@/axiosInstance";
import { Card, CardActivity, List } from "@/interfaces/types";
import axios from "axios";

interface CardActivityPayload {
    source_position: number,
    destination_position: number,
    destination_list_id: number|string|undefined,
    source_list_id: number|string|undefined,
    id_card: number|string|undefined,
    id_user: number|string|undefined,
    id_sprint: number|string|undefined
};

export async function createCardActivity(cardActivity: CardActivityPayload) {
	await axiosInstance
		.post(`http://localhost:8000/card-activities`, cardActivity)
		.then((res) => {
			return res.data;
		});
}
