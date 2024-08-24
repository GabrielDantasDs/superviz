import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useRouter } from "next/navigation";

export default function Index() {
	const participant = useSelector((state: RootState) => state.participant);
	const [isLoading, setIsLoading] = useState(true);

	const router = useRouter();

	const navigateToRegister = () => {
		router.push("/register");
	};

	const navigateToLogin = () => {
		router.push("/login");
	};

	return (
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
					Manage your sprints in real time and keep track of progress
				</p>
				<div className="flex gap-8 m-auto justify-center">
					<button
						onClick={navigateToLogin}
						className="bg-purple-700 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
					>
						Sign in
					</button>
					<button
						onClick={navigateToRegister}
						className="bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
					>
						Sign up
					</button>
				</div>
			</div>
		</div>
	);
}
