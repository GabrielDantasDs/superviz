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
import { updateCard as updateCardAction } from "@/redux/listsSlice";
import axiosInstance from "@/axiosInstance";

interface Task {
	id: number;
	title: string;
	completed: boolean;
}


const Card: React.FC<CardInterface> = (data: CardInterface) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const dispatch = useDispatch();

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
				.then((res) => {
					
				});
			
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
				dispatch(updateCardAction({ card: res.data }))

			});
			dispatch(setUpdateList(true))
	};

	return (
		<>
			{data.tasks.length > 0 ? (
				<FormElements
					fields={data.tasks.map((task) => `task-${task.id}`)}
				/>
			) : null}

			<Draggable draggableId={`card-${data.id.toString()}`} index={data.position} key={data.id}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						className="bg-white shadow-lg rounded-lg overflow-hidden mb-4"
					>
						<div onClick={() => setIsModalOpen(true)}>
							<div className="px-4 py-2">
								<h2 className="text-xl font-bold text-gray-800">
									{data.title}
								</h2>
								<p className="text-gray-600 mt-2">
									{data.content}
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

						{/* Lista de Tarefas */}
						<div className="px-4 py-2">
							<h3 className="text-lg font-semibold text-gray-800 mb-2">
								Tarefas
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
						</div>
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
