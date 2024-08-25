import { registerUser } from "@/api/user";
import { User, Company } from "@/interfaces/types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser as setUserAction } from "@/redux/userSlice";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

export default function Register() {
	const [user, setUser] = useState<User>({
		name: "",
		email: "",
		password: "",
	});
	const [company, setCompany] = useState<Company>({ name: "" });
	const [companyCode, setCompanyCode] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const router = useRouter();

	const register = async () => {
		setLoading(true);

		if (user && (company || companyCode)) {
			await registerUser(user, company, companyCode).then((res) => {

				dispatch(setUserAction({id: res.id, email: res.email, name: res.name, id_company: res.id_company}));

				localStorage.setItem("token", res.jwt_token);
				localStorage.setItem("user", JSON.stringify({ id: res.id, name: res.name, email: res.email, id_company: res.id_company}));

				router.push("/home");
			});
		} else {
			Swal.fire("Ops", "Enter company name or code", "error");
			return;
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
					Create a company or join in one using a code
				</h2>
				<div className="mb-12">
					<label className="block text-gray-700 mb-2" htmlFor="name">
						Name
					</label>
					<input
						id="company-name"
						type="text"
						value={company.name}
						disabled={companyCode != ""}
						onChange={(e) =>
							setCompany({ ...company, name: e.target.value })
						}
						className="w-full p-2 border border-gray-300 rounded text-black"
					/>
				</div>
				<div className="mb-12">
					<label className="block text-gray-700 mb-2" htmlFor="email">
						Code
					</label>
					<input
						id="company-code"
						type="text"
						value={companyCode}
						disabled={company.name != ""}
						onChange={(e) => setCompanyCode(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded text-black"
					/>
				</div>
				<h2 className="text-2xl text-purple-800 font-bold mb-4">
					Create a user
				</h2>
				<div className="mb-12">
					<label className="block text-gray-700 mb-2" htmlFor="name">
						Name *
					</label>
					<input
						id="name"
						type="text"
						value={user.name}
						onChange={(e) =>
							setUser({ ...user, name: e.target.value })
						}
						className="w-full p-2 border border-gray-300 rounded text-black"
					/>
				</div>
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

				<div className="flex justify-end space-x-4">
					<button
						onClick={register}
						className="bg-purple-800 text-white font-bold py-2 px-4 rounded"
                        disabled={loading}
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
}
