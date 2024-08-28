"use client";

import { setParticipant } from "@/redux/participantSlice";
import axios from "axios";
import React from "react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axiosInstance from "@/axiosInstance";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (name: string, email: string) => void;
}

export default function ModalParticipant({
	isOpen,
	onClose,
	onSubmit,
}: ModalProps) {
	const dispatch = useDispatch();

	const [name, setName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const sprint = useSelector((state: RootState) => state.sprint);

	const handleSubmit = async () => {
		await axiosInstance
			.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/participants`, {
				name: name,
				email: email,
				id_sprint: sprint.id,
			})
			.then((res) => {
				dispatch(
					setParticipant({
						id: res.data.id.toString(),
						name: res.data.name,
						id_sprint: sprint.id,
						isHost: true,
						joined: false,
					})
				);

				localStorage.setItem("id", res.data.id.toString());
				localStorage.setItem("name", res.data.name);
				localStorage.setItem("email", res.data.email);
			});

		onSubmit(name, email);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl text-purple-800 font-bold mb-4">
					Insira seus dados
				</h2>
				<div className="mb-4">
					<label className="block text-gray-700 mb-2" htmlFor="name">
						Nome
					</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded text-black"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 mb-2" htmlFor="email">
						Email
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded text-black"
					/>
				</div>
				<div className="flex justify-end space-x-4">
					<button
						onClick={onClose}
						className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
					>
						Cancelar
					</button>
					<button
						onClick={handleSubmit}
						className="bg-purple-800 text-white font-bold py-2 px-4 rounded"
					>
						Enviar
					</button>
				</div>
			</div>
		</div>
	);
}
