import axiosInstance from "@/axiosInstance";
import axios from "axios";

async function get(id: number) {
    return await axiosInstance
        .get(`${process.env.NEXT_PUBLIC_BACKEND_API}/sprints/${id}`, {
            headers: { "ngrok-skip-browser-warning": "1" },
        })
        .then(async (res) => {
            if (res.status == 200) {
                return res.data;
            }
        });
}

export async function closeSprint(id: number|string) {
    return await axiosInstance
    .patch(`${process.env.NEXT_PUBLIC_BACKEND_API}/sprints/close/${id}`, {
        headers: { "ngrok-skip-browser-warning": "1" },
    })
    .then(async (res) => {
        if (res.status == 200) {
            return res.data;
        }
    });
}

export async function getClosed(id:number|string) {
    return await axiosInstance
    .get(`${process.env.NEXT_PUBLIC_BACKEND_API}/sprints/closed/${id}`, {
        headers: { "ngrok-skip-browser-warning": "1" },
    })
    .then(async (res) => {
        if (res.status == 200) {
            return res.data;
        }
    });
}