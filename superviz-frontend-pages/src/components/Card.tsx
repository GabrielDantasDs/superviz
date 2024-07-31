"use client";

import React, { useEffect, useState } from "react";
import { Card as CardInterface, Tag } from "../interfaces/types";
import { Comments, useHTMLPin } from "@superviz/react-sdk";
import Cards from "./Cards";
import { Draggable } from "react-beautiful-dnd";

interface Task {
	id: number;
	title: string;
	completed: boolean;
}

interface CardProps {
	id: number | string;
	index: number;
	title: string;
	content: string;
	tags: Tag[];
	tasks: Task[];
}

const Card: React.FC<CardProps> = ({
	id,
	index,
	title,
	content,
	tags,
	tasks,
}) => {
	const [card, setCard] = useState<CardInterface>({
		id,
		index,
		title,
		content,
		tags,
		tasks,
	});

	useEffect(() => {
		console.log(id, index)
		setCard({ id, title, content, tags, tasks });
	}, [id]);

	const [_tasks, setTasks] = useState<Task[]>(tasks);

	function handleTaskChange(taskIndex: number, completed: boolean) {
		let tasks = _tasks;
		let task = tasks.find((task, index) => index == taskIndex);

		if (task) {
			task.completed = completed;
		}

		setTasks([...tasks]);
	}

	useEffect(() => {
		setCard({ ...card, tasks: _tasks });
	}, [_tasks]);

	return (
		<Draggable draggableId={id.toString()} index={index}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className="bg-white shadow-lg rounded-lg overflow-hidden mb-4"
				>
					<div className="px-4 py-2">
						<h2 className="text-xl font-bold text-gray-800">
							{title}
						</h2>
						<p className="text-gray-600 mt-2">{content}</p>
					</div>

					<div className="px-4 py-3 bg-gray-100">
						{card.tags.map((tag, index) => (
							<span
								key={index}
								className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
							>
								{tag.title}
							</span>
						))}
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
	);
};

export default Card;
