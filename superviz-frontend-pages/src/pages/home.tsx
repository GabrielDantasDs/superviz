"use client"

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useRouter } from "next/navigation";
// import Navbar from "@/components/Navbar";
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false })

export default function Home() {
	const participant = useSelector((state: RootState) => state.participant);
	const [isLoading, setIsLoading] = useState(true);

	const router = useRouter();

	const navigateToCreateSprint = () => {
		router.push("/create-sprint");
	};

	const navigateToJoinSprint = () => {
		router.push("/join-sprint");
	};

	return (
		<div>
			<Navbar />
			<div
				className="min-h-screen flex items-center justify-center bg-cover bg-center"
				style={{
					backgroundImage: `linear-gradient(rgba(8, 90, 213, 0.7), rgba(128, 90, 213, 0.7)), url('./background.jpg')`,
				}}
			>
				<div className="text-center text-white">
					<h1 className="text-4xl md:text-6xl font-bold mb-4">
						Welcome to sprint tracker
					</h1>
					<p className="text-lg md:text-xl mb-8">
						Start a new sprint or join an existing one
					</p>
					<button
						onClick={navigateToJoinSprint}
						className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 mx-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
					>
						Join a sprint now
					</button>
					<button
						onClick={navigateToCreateSprint}
						className="bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
					>
						Create your sprint
					</button>
				</div>
			</div>s
		</div>
	);
}
