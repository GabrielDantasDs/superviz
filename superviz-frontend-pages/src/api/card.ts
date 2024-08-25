import axiosInstance from "@/axiosInstance";

export async function removeCard(id_card: number | string) {
	return await axiosInstance.delete(`http://localhost:8000/cards/${id_card}`).then((res) => {
		if (res.status == 200) return res.data;
	})
}