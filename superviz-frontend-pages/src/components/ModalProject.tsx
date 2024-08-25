"use client";

import axios from "axios";
import React from "react";
import { Project } from "@/interfaces/types";
import axiosInstance from "@/axiosInstance";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (project: Project) => void;
}

export default function ModalProject({
	isOpen,
	onClose,
	onSubmit,
}: ModalProps) {
	const [name, setName] = React.useState("");

	const handleSubmit = async () => {
		await axiosInstance 
			.post("http://localhost:8000/projects", {
				name: name,
			}).then(res => 	{
				setName("");
				onSubmit(res.data)
			});

		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl text-purple-800 font-bold mb-4">
					Enter a name to project
				</h2>
				<div className="mb-4">
					<label className="block text-gray-700 mb-2" htmlFor="name">
						Name
					</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
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
