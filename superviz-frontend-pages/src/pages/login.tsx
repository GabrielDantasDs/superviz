
import { login as loginReq } from "@/api/user";
import { User, Company } from "@/interfaces/types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser as setUserAction } from "@/redux/userSlice";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { setParticipant } from "@/redux/participantSlice";

export default function Login() {
	const [user, setUser] = useState<User>({
		name: "",
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const router = useRouter();

	const login = async () => {
		setLoading(true);

		if (user && user.password!) {
			await loginReq(user.email, user.password).then((res) => {
				dispatch(setUserAction({id: res.id, email: res.email, name: res.name, id_company: res.id_company}));
				dispatch(setParticipant({id: res.id, name: res.name, joined: true, isHost:true }));

				localStorage.setItem("token", res.jwt_token);
				localStorage.setItem("user", JSON.stringify({ id: res.id, name: res.name, email: res.email, id_company: res.id_company}));

                router.push("/home");
			}).catch(err => {
                Swal.fire('Ops', 'Invalid credentials', 'error');
                return;
            })
		}
		setLoading(false);
	};

	return (
		<div
			className="min-h-screen flex items-center justify-center bg-cover bg-center"
			style={{
				backgroundImage: `linear-gradient(rgba(8, 90, 213, 0.7), rgba(128, 90, 213, 0.7)), url('./background.jpg')`,
			}}
		>
			<div className="bg-white p-6 rounded-lg shadow-lg max-w-96">
				<h2 className="text-2xl text-purple-800 font-bold mb-4">
					Sign in
				</h2>
				<div className="mb-12">
					<label className="block text-gray-700 mb-2" htmlFor="email">
						Email *
					</label>
					<input
						id="email"
						type="email"
						value={user.email}
						onChange={(e) =>
							setUser({ ...user, email: e.target.value })
						}
						className="w-full p-2 border border-gray-300 rounded text-black"
					/>
				</div>
				<div className="mb-12">
					<label className="block text-gray-700 mb-2" htmlFor="email">
						Password *
					</label>
					<input
						id="password"
						type="password"
						value={user.password}
						onChange={(e) =>
							setUser({ ...user, password: e.target.value })
						}
						className="w-full p-2 border border-gray-300 rounded text-black"
					/>
				</div>

				<div className="flex justify-center space-x-4">
					<button
						onClick={login}
						className="bg-purple-800 text-white font-bold py-2 px-4 rounded"
                        disabled={loading}
					>
						Sign in
					</button>
				</div>
			</div>
		</div>
	);
}
