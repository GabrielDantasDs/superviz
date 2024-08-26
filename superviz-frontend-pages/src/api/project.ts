import axiosInstance from "@/axiosInstance";
import axios from "axios";

export async function get(id: number|string, id_sprint: number|string) {
	return await axiosInstance
		.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/projects/${id}`, {id_sprint: id_sprint})
		.then((res) => {
			if (res.status == 200) {
				return res.data;
			}
		});
}

export async function getAll() {
	return await axiosInstance
		.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/projects`)
		.then((res) => {
			if (res.status == 200) {
				return res.data;
			}
		});
}
