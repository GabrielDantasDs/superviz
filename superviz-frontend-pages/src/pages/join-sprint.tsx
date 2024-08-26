import ModalParticipant from "@/components/ModalParticipant";
import { Sprint } from "@/interfaces/types";
import { RootState } from "@/redux/store";
import { get } from "@/api/project";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setSprint } from "@/redux/sprintSlice";
import { setParticipant } from "@/redux/participantSlice";
import axiosInstance from "@/axiosInstance";

export default function JoinSprint() {
	const [sprints, setSprints] = useState<Sprint[]>([]);
	const [sprintsClosed, setSprintsClosed] = useState<Sprint[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const participant = useSelector((state: RootState) => state.participant);
	const dispatch = useDispatch();
	const router = useRouter();
	const user = useSelector((state: RootState) => state.user);
	const [selectedSprint, setSelectedSprint] = useState<
		number | string | undefined
	>();
	const [selectedClosedSprint, setSelectedClosedSprint] = useState<
	number | string | undefined
>();

	useEffect(() => {
		fetchData();
	}, []);

	async function fetchData() {
		await axiosInstance
			.get("${process.env.NEXT_PUBLIC_BACKEND_API}/sprints", {
				headers: { "ngrok-skip-browser-warning": "1" },
			})
			.then((res) => {
				const sprints: Sprint[] = [];

				res.data.map((item: any) => {
					sprints.push(item);
				});

				setSprints(sprints);
			});

		await axiosInstance
			.get("${process.env.NEXT_PUBLIC_BACKEND_API}/sprints/closed", {
				headers: { "ngrok-skip-browser-warning": "1" },
			})
			.then((res) => {
				const sprints: Sprint[] = [];

				res.data.map((item: any) => {
					sprints.push(item);
				});

				setSprintsClosed(sprints);
			});
	}

	const handleSelectSprint = (id: number | string | undefined) => {
		setSelectedClosedSprint(undefined)
		setSelectedSprint(id);
	};

	const handleSelectClosedSprint = (id: number | string | undefined) => {
		setSelectedSprint(undefined)
		setSelectedClosedSprint(id);
	};

	const handleJoinSprint = async () => {
		if (selectedSprint !== undefined) {
			console.log('teste')
			if (selectedSprint !== undefined) {
				await axiosInstance
					.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/sprints/${selectedSprint}`)
					.then(async (res) => {
						dispatch(
							setSprint({
								id: res.data.id.toString(),
								title: res.data.title,
								id_project: res.data.id_project,
							})
						);

						localStorage.setItem(
							"sprint_id",
							res.data.id.toString()
						);
						localStorage.setItem("sprint_title", res.data.title);

						if (!participant.id) {
							setParticipant({
								id: user.id.toString(),
								isHost: true,
								joined: true,
								name: user.name,
								id_sprint: res.data.id,
							});
							
							router.push(`/sprint/${res.data.id}`);
						} else {
							router.push(`/sprint/${res.data.id}`);
						}
					});
			}
		}

		if (selectedClosedSprint !== undefined) {
			await axiosInstance
			.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/sprints/${selectedClosedSprint}`)
			.then(async (res) => {
				dispatch(
					setSprint({
						id: res.data.id.toString(),
						title: res.data.title,
						id_project: res.data.id_project,
					})
				);

				localStorage.setItem(
					"sprint_id",
					res.data.id.toString()
				);

				localStorage.setItem("sprint_title", res.data.title);
			});

			router.push(`/closed-sprint/${selectedClosedSprint}`);
		}
	};

	const handleModalSubmit = async (name: string, email: string) => {
		if (name && email) {
			router.push(`/sprint/${selectedSprint}`);
		}
	};

	return (
		<div className="min-h-screen bg-white flex items-center justify-center p-4">
			<div className="text-center max-w-lg mx-auto">
				<h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-6">
					Choose a sprint
				</h1>
				<p className="text-lg md:text-xl text-gray-700 mb-8">
					Select an existing sprint to join. Collaborate with your
					team and participate in ongoing discussions.
				</p>
				<div className="space-y-4">
					{sprintsClosed.map((sprint) => (
						<div
							key={sprint.id}
							onClick={() => handleSelectClosedSprint(sprint.id)}
							className={`p-4 rounded-lg cursor-pointer border-2 bg-red-200 ${
								selectedClosedSprint === sprint.id
									? "border-purple-700 bg-purple-100"
									: "border-gray-300 bg-white"
							} hover:border-purple-500 transition duration-300`}
						>
							<span className="text-lg md:text-xl text-gray-800">
								{sprint.title}
							</span>
						</div>
					))}
					{sprints.map((sprint) => (
						<div
							key={sprint.id}
							onClick={() => handleSelectSprint(sprint.id)}
							className={`p-4 rounded-lg cursor-pointer border-2 ${
								selectedSprint === sprint.id
									? "border-purple-700 bg-purple-100"
									: "border-gray-300 bg-white"
							} hover:border-purple-500 transition duration-300`}
						>
							<span className="text-lg md:text-xl text-gray-800">
								{sprint.title}
							</span>
						</div>
					))}
				</div>
				<button
					onClick={handleJoinSprint}
					disabled={selectedSprint === null}
					className={`mt-8 bg-purple-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 ${
						selectedSprint === null
							? "opacity-50 cursor-not-allowed"
							: "hover:bg-purple-700"
					}`}
				>
					Join
				</button>
			</div>
			<ModalParticipant
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleModalSubmit}
			/>
		</div>
	);
}
