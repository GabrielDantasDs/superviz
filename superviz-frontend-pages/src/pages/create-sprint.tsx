import axiosInstance from "@/axiosInstance";
import ModalParticipant from "@/components/ModalParticipant";
import ModalProject from "@/components/ModalProject";
import { Project } from "@/interfaces/types";
import { setParticipant } from "@/redux/participantSlice";
import { setSprint } from "@/redux/sprintSlice";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function CreateSprint() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [step, setStep] = useState(1);
	const [title, setTitle] = useState<string>("");

	const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
	const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

	const sprint = useSelector((state: RootState) => state.sprint);
	const participant = useSelector((state: RootState) => state.participant);
	const dispatch = useDispatch();
	const router = useRouter();
	const user = useSelector((state: RootState) => state.user);

	const [selectedProject, setSelectedProject] = useState<
		number | string | undefined
	>(undefined);

	useEffect(() => {
		fetchData();
	}, []);

	async function fetchData() {
		await axiosInstance
			.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/projects`, {
				headers: { "ngrok-skip-browser-warning": "1" },
			})
			.then((res) => {
				const projects: Project[] = [];

				res.data.map((item: any) => {
					projects.push(item);
				});

				setProjects(projects);
			});
	}

	const handleSelectProject = (id: number | string | undefined) => {
		setSelectedProject(id);
	};

	const handleJoinSprint = async () => {
		if (selectedProject !== null) {
			await axiosInstance
				.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/sprints`, {
					title: title,
					id_project: selectedProject,
				})
				.then((res) => {
					dispatch(
						setSprint({
							id: res.data.id.toString(),
							title: res.data.title,
							id_project: res.data.id_project,
						})
					);

					if (!participant.id) {
						setParticipant({
							id: user.id.toString(),
							isHost: true,
							joined: true,
							name: user.name,
							id_sprint: res.data.id,
						});
					} else {
						router.push(`/sprint/${res.data.id}`);
					}
				});
		}
	};

	const handleParticipantModalSubmit = async (
		name: string,
		email: string
	) => {
		if (name && email) {
			router.push(`/sprint/${sprint.id}`);
		}
	};

	const handleProjectModalSubmit = async (project: Project) => {
		const aux = projects;

		aux.push(project);

		setProjects([...projects]);
	};

	const handleNextStep = () => {
		const next_step = step + 1;

		setStep(next_step);
	};

	const handlePreviousStep = () => {
		const previous_step = step - 1;

		setStep(previous_step);
	};

	return (
		<>
			{step == 1 ? (
				<div className="min-h-screen bg-white flex items-center justify-center p-4">
					<div className="text-center max-w-lg mx-auto">
						<h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-6">
							Choose a project
						</h1>
						<p className="text-lg md:text-xl text-gray-700 mb-8">
							Select the project you want to use in the sprint.
							You can manage your projects and collaborate with
							your team in real time.
						</p>
						<div className="space-y-4">
							{projects.map((project) => (
								<div
									key={project.id}
									onClick={() =>
										handleSelectProject(project.id)
									}
									className={`p-4 rounded-lg cursor-pointer border-2 ${
										selectedProject === project.id
											? "border-purple-700 bg-purple-100"
											: "border-gray-300 bg-white"
									} hover:border-purple-500 transition duration-300`}
								>
									<span className="text-lg md:text-xl text-gray-800">
										{project.name}
									</span>
								</div>
							))}
						</div>
						<div>
							<div className="block">
								<button
									onClick={handleNextStep}
									disabled={selectedProject === null}
									className={`mt-8 bg-purple-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 ${
										selectedProject === null
											? "opacity-50 cursor-not-allowed"
											: "hover:bg-purple-700"
									}`}
								>
									Join
								</button>
							</div>
							<div className="block">
								<button
									onClick={(e) => setIsProjectModalOpen(true)}
									disabled={selectedProject === null}
									className={`mt-8 bg-purple-400 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 ${
										selectedProject === null
											? "opacity-50 cursor-not-allowed"
											: "hover:bg-purple-700"
									}`}
								>
									Create a new project
								</button>
							</div>
						</div>
					</div>
					<ModalProject
						isOpen={isProjectModalOpen}
						onClose={() => setIsProjectModalOpen(false)}
						onSubmit={handleProjectModalSubmit}
					/>
					<ModalParticipant
						isOpen={isParticipantModalOpen}
						onClose={() => setIsParticipantModalOpen(false)}
						onSubmit={handleParticipantModalSubmit}
					/>
				</div>
			) : (
				<div className="min-h-screen bg-white flex items-center justify-center p-4">
					<div className="text-center max-w-lg mx-auto">
						<h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-6">
							Enter a name to sprint
						</h1>
						<div className="mb-12">
							<input
								id="title"
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="w-full p-2 border border-gray-300 rounded text-black"
							/>
						</div>
						<button
							onClick={handleJoinSprint}
							disabled={selectedProject === null || title === ""}
							className={`mt-8 bg-purple-800 text-white font-bold py-2 px-4 mx-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 ${
								selectedProject === null
									? "opacity-50 cursor-not-allowed"
									: "hover:bg-purple-700"
							}`}
						>
							Iniciar
						</button>
						<button
							onClick={handlePreviousStep}
							disabled={selectedProject === null}
							className={`mt-8 bg-purple-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 ${
								selectedProject === null
									? "opacity-50 cursor-not-allowed"
									: "hover:bg-purple-700"
							}`}
						>
							Voltar
						</button>
					</div>
					<ModalProject
						isOpen={isProjectModalOpen}
						onClose={() => setIsProjectModalOpen(false)}
						onSubmit={handleProjectModalSubmit}
					/>
					<ModalParticipant
						isOpen={isParticipantModalOpen}
						onClose={() => setIsParticipantModalOpen(false)}
						onSubmit={handleParticipantModalSubmit}
					/>
				</div>
			)}
		</>
	);
}
