import axios from "axios";

export async function get(id: number|string) {
	return await axios
		.get(`http://localhost:8000/projects/${id}`)
		.then((res) => {
			if (res.status == 200) {
				return res.data;
			}
		});
}
