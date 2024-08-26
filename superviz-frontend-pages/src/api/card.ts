import axiosInstance from "@/axiosInstance";

export async function removeCard(id_card: number | string) {
	return await axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACKEND_API}/cards/${id_card}`).then((res) => {
		if (res.status == 200) return res.data;
	})
}