import axiosInstance from "@/axiosInstance";
import axios from "axios";

export async function get(id: number|string) {
	return await axiosInstance
		.get(`http://localhost:8000/projects/${id}`)
		.then((res) => {
			if (res.status == 200) {
				return res.data;
			}
		});
}

export async function getAll() {
	return await axiosInstance
		.get(`http://localhost:8000/projects/`)
		.then((res) => {
			if (res.status == 200) {
				return res.data;
			}
		});
}
