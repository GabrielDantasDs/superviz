"use client";

import React, { useEffect, useState } from "react";
import { Card as CardInterface, Tag } from "../interfaces/types";
import { FormElements } from "@superviz/react-sdk";
import Cards from "./Cards";
import { Draggable } from "@hello-pangea/dnd";
import ModalCard from "./ModalCard";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUpdateList } from "@/redux/updateListSlice";
import {
	removeCardFromList,
	updateCard as updateCardAction,
} from "@/redux/listsSlice";
import axiosInstance from "@/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { asignUser } from "@/api/user";
import Swal from "sweetalert2";
import { createCardActivity } from "@/api/card-activity";
import { removeCard as removeCardReq } from "@/api/card";

interface Task {
	id: number;
	title: string;
	completed: boolean;
}

const Card: React.FC<CardInterface> = (data: CardInterface) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const dispatch = useDispatch();
	const users = useSelector((state: RootState) => state.users);

	useEffect(() => {
		setTasks(data.tasks);
	}, [data.tasks]);

	const [_tasks, setTasks] = useState<Task[]>(data.tasks);

	const handleTaskChange = async (taskIndex: number, completed: boolean) => {
		let tasks = _tasks;
		let task = tasks.find((task, index) => index == taskIndex);

		if (task) {
			task.completed = completed;
			setTasks([...tasks]);

			await axiosInstance
				.put(`http://localhost:8000/tasks/${task.id}`, completed, {
					headers: { "ngrok-skip-browser-warning": "1" },
				})
				.then((res) => {});
		}
	};

	// useEffect(() => {
	// 	setCard({ ...card, tasks: _tasks });
	// }, [_tasks]);

	const onCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleSaveModal = (data: CardInterface) => {
		updateCard(data);
		onCloseModal();
	};

	const updateCard = async (data: CardInterface) => {
		await axiosInstance
			.put(`http://localhost:8000/cards/${data.id}`, data, {
				headers: { "ngrok-skip-browser-warning": "1" },
			})
			.then((res) => {
				dispatch(updateCardAction({ card: res.data }));
			});

		dispatch(setUpdateList(true));
	};

	const handleRemoveCard = async () => {
		await removeCardReq(data.id).then((res) => {
			dispatch(
				removeCardFromList({ card: data, id_origin_list: data.id_list })
			);
			dispatch(setUpdateList(true));
		});
	};

	return (
		<>
			{data.tasks.length > 0 ? (
				<FormElements
					fields={data.tasks.map((task) => `task-${task.id}`)}
				/>
			) : null}

			<Draggable
				draggableId={`card-${data.id.toString()}`}
				index={data.position}
				key={data.id}
			>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						className="bg-white shadow-lg rounded-lg overflow-hidden mb-4"
					>
						<div>
							<div className="px-4 py-2">
								<div className="flex">
									<h2 className="mt-4 text-xl font-bold text-gray-800">
										{data.title}
									</h2>
									<button
										onClick={handleRemoveCard}
										className="bg-red-700 hover:bg-red-600 text-white font-bold py-4 px-4 mx-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											className="size-5"
										>
											<path
												fillRule="evenodd"
												d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
												clipRule="evenodd"
											/>
										</svg>
									</button>
									<button className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 px-4 mx-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105" onClick={(e) => setIsModalOpen(true)}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="size-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
											/>
										</svg>
									</button>
								</div>

								<p className="text-gray-600 mt-2">
									{data.content}
								</p>
								<p className="text-gray-600 mt-2">
									{data.id_user
										? users.find(
												(user) =>
													user.id == data.id_user
										  )?.name
										: ""}
								</p>
							</div>

							<div className="px-4 py-3 bg-gray-100">
								{data.tags.map((tag, index) => (
									<span
										key={index}
										className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
									>
										{tag.title}
									</span>
								))}
							</div>
						</div>

						{/* <div className="px-4 py-2">
							<h3 className="text-lg font-semibold text-gray-800 mb-2">
								Tasks
							</h3>
							<ul>
								{_tasks.map((task, index) => (
									<li
										key={index}
										className="flex items-center mb-2"
									>
										<input
											type="checkbox"
											id={`task-${data.id}`}
											checked={task.completed}
											onChange={() =>
												handleTaskChange(
													index,
													!task.completed
												)
											}
											className="mr-2"
										/>
										<span
											className={
												task.completed
													? "line-through text-gray-500"
													: "text-gray-800"
											}
										>
											{task.title}
										</span>
									</li>
								))}
							</ul>
						</div> */}
					</div>
				)}
			</Draggable>
			<ModalCard
				isOpen={isModalOpen}
				card={data}
				onCloseCallBack={onCloseModal}
				handleSaveCallBack={handleSaveModal}
			/>
		</>
	);
};

export default Card;
