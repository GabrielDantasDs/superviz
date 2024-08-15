import axios from "axios";

async function get(id: number) {
    return await axios
        .get(`http://localhost:8000/meetings/${id}`, {
            headers: { "ngrok-skip-browser-warning": "1" },
        })
        .then(async (res) => {
            if (res.status == 200) {
                return res.data;
            }
        });
}