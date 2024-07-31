import ModalParticipant from "@/components/ModalParticipant";
import { Meeting } from "@/interfaces/types";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function JoinMeeting() {
	const [meetings, setMeetings] = useState<Meeting[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		fetchData();
	}, []);

	async function fetchData() {
		await axios
			.get("http://localhost:8000/meetings", {
				headers: { "ngrok-skip-browser-warning": "1" },
			})
			.then((res) => {
				const meetings: Meeting[] = [];

				res.data.map((item: any) => {
					meetings.push(item);
				});

				setMeetings(meetings);
			});
	}

	const [selectedMeeting, setSelectedMeeting] = useState<
		number | string | undefined
	>();

	const handleSelectMeeting = (id: number | string | undefined) => {
		setSelectedMeeting(id);
	};

	const handleJoinMeeting = () => {
		if (selectedMeeting !== null) {
			if (selectedMeeting !== null) {
				setIsModalOpen(true);
			}
		}
	};

	const handleModalSubmit = (name: string, email: string) => {
		console.log(
			`Joining meeting ID: ${selectedMeeting} with name: ${name} and email: ${email}`
		);
	};

	return (
		<div className="min-h-screen bg-white flex items-center justify-center p-4">
			<div className="text-center max-w-lg mx-auto">
				<h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-6">
					Escolha uma Reunião
				</h1>
				<p className="text-lg md:text-xl text-gray-700 mb-8">
					Selecione uma reunião existente para entrar. Colabore com
					sua equipe e participe das discussões em andamento.
				</p>
				<div className="space-y-4">
					{meetings.map((meeting) => (
						<div
							key={meeting.id}
							onClick={() => handleSelectMeeting(meeting.id)}
							className={`p-4 rounded-lg cursor-pointer border-2 ${
								selectedMeeting === meeting.id
									? "border-purple-700 bg-purple-100"
									: "border-gray-300 bg-white"
							} hover:border-purple-500 transition duration-300`}
						>
							<span className="text-lg md:text-xl text-gray-800">
								{meeting.title}
							</span>
						</div>
					))}
				</div>
				<button
					onClick={handleJoinMeeting}
					disabled={selectedMeeting === null}
					className={`mt-8 bg-purple-800 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 ${
						selectedMeeting === null
							? "opacity-50 cursor-not-allowed"
							: "hover:bg-purple-700"
					}`}
				>
					Entre na reunião agora
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
