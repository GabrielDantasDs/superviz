"use client";

import React, { useEffect, useState } from "react";
import { Card as CardInterface, Tag } from "../interfaces/types";

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

const CardClosed: React.FC<CardInterface> = (data: CardInterface) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const dispatch = useDispatch();
	const users = useSelector((state: RootState) => state.users);

	useEffect(() => {
		setTasks(data.tasks);
	}, [data.tasks]);

	const [_tasks, setTasks] = useState<Task[]>(data.tasks);


	return (
		<>
					<div
						className="bg-white shadow-lg rounded-lg overflow-hidden mb-4"
					>
						<div>
							<div className="px-4 py-2">
								<div className="flex">
									<h2 className="mt-4 text-xl font-bold text-gray-800">
										{data.title}
									</h2>
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
					</div>
		</>
	);
};

export default CardClosed;
