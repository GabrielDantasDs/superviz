import axiosInstance from "@/axiosInstance";
import axios from "axios";

async function get(id: number) {
    return await axiosInstance
        .get(`http://localhost:8000/sprints/${id}`, {
            headers: { "ngrok-skip-browser-warning": "1" },
        })
        .then(async (res) => {
            if (res.status == 200) {
                return res.data;
            }
        });
}