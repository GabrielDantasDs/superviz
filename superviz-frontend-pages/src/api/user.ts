import axiosInstance from "@/axiosInstance";
import { Company, User } from "@/interfaces/types";
import axios from "axios";

export async function registerUser(user: User, company: Company, companyCode: string) {
	return await axios
		.post(`http://localhost:8000/users/register`, { user, company, companyCode})
		.then((res) => {
			if (res.status == 200) {
				axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.jwt_token}`;

				return res.data;
			}
		});
}

export async function login(email: string, password: string) {
	return await axios
	.post(`http://localhost:8000/users/login`, { email, password })
	.then((res) => {
		if (res.status == 200) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.jwt_token}`;

			return res.data;
		} else {
			throw new Error('Login failed');
		}
	}).catch(err => {
		throw err;
	})
}

export async function getAllByCompany(id_company: string|number) {
	return await axiosInstance.get(`http://localhost:8000/users/all/${id_company}`).then((res) => {
		if (res.status == 200) {
			return res.data;
		} else {
			throw new Error('Not found');
		}
	}).catch(err => {
		throw err;
	})
}

export async function asignUser(id_card: string|number, id_user: string|number) {
	return await axiosInstance.post(`http://localhost:8000/users/asign`, {id_card, id_user}).then((res) => {
		if (res.status == 200) {
			return res.data;
		} else {
			throw new Error('Not found');
		}
	}).catch(err => {
		throw err;
	})
}