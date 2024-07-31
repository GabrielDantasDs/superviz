import ModalParticipant from "@/components/ModalParticipant";
import { Project } from "@/interfaces/types";
import { setMeeting } from "@/redux/meetingSlice";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function CreateMeeting() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [step, setStep] = useState(1);
	const [title, setTitle] = useState<string>("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const meeting = useSelector((state:RootState) => state.meeting)
	const participant = useSelector((state: RootState) => state.participant);
	const dispatch = useDispatch();
	const router = useRouter();

	const [selectedProject, setSelectedProject] = useState<
		number | string | undefined
	>(undefined);

	useEffect(() => {
		fetchData();
	}, []);

	async function fetchData() {
		await axios
			.get("http://localhost:8000/projects", {
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

	const handleJoinMeeting = async () => {
		if (selectedProject !== null) {
			await axios
				.post("http://localhost:8000/meetings", { title: title, id_project: selectedProject })
				.then((res) => {
					dispatch(
						setMeeting({
							id: res.data.id.toString(),
							title: res.data.title,
						})
					);

					if (!participant.id) {
						setIsModalOpen(true);
					} else {
						router.push(`/meeting/${res.data.id}`)
					}
				});
		}
	};

	const handleModalSubmit = async (name: string, email: string) => {
		if (name && email) {
			router.push(`/meeting/${meeting.id}`)
		}
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
							Escolha um Projeto
						</h1>
						<p className="text-lg md:text-xl text-gray-700 mb-8">
							Selecione o projeto que deseja usar na reunião. Você
							pode gerenciar seus projetos e colaborar com sua
							equipe em tempo real.
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
						<button
							onClick={handleNextStep}
							disabled={selectedProject === null}
							className={`mt-8 bg-purple-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 ${
								selectedProject === null
									? "opacity-50 cursor-not-allowed"
									: "hover:bg-purple-700"
							}`}
						>
							Crie uma nova reunião agora
						</button>
					</div>
					<ModalParticipant
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
						onSubmit={handleModalSubmit}
					/>
				</div>
			) : (
				<div className="min-h-screen bg-white flex items-center justify-center p-4">
					<div className="text-center max-w-lg mx-auto">
						<h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-6">
							Escolha um título
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
							onClick={handleJoinMeeting}
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
					<ModalParticipant
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
						onSubmit={handleModalSubmit}
					/>
				</div>
			)}
		</>
	);
}
