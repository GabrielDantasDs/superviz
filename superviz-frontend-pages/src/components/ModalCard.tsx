import { asignUser } from "@/api/user";
import { Card } from "@/interfaces/types";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

type PropsInterface = {
	isOpen: boolean;
	card: Card;
	handleSaveCallBack: Function;
	onCloseCallBack: Function;
};

export default function ModalCard({
	isOpen,
	card,
	handleSaveCallBack,
	onCloseCallBack,
}: PropsInterface) {
	const [data, setData] = useState(card);
	const users = useSelector((state: RootState) => state.users);

	const onClose = () => {
		onCloseCallBack();
	};

	const handleSave = () => {
		handleSaveCallBack(data);
	};

    const setTask = (value: boolean, index:number) => {
        let tasks = [...data.tasks];

        let task = tasks.find((task, findIndex) => findIndex == index);

        if (task) {
            task.completed = value;
        }

        setData({...data, tasks });
    }

	const asignCard = async (id_user: number|string) => {
		console.log(id_user)
		setData({ ...data, id_user: id_user, user_name: users.find(user => user.id == id_user)?.name});
	}

	if (!isOpen) return null;

	return (
		<div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl text-purple-800 font-bold mb-4">
					{data.title}
				</h2>
				<div className="mb-12">
					<label className="block text-gray-700 mb-2" htmlFor="name">
						Nome
					</label>
					<input
						id="name"
						type="text"
						value={data.title}
						onChange={(e) =>
							setData({ ...data, title: e.target.value })
						}
						className="w-full p-2 border border-gray-300 rounded text-black"
					/>
				</div>
				<div className="mb-12">
					<label className="block text-gray-700 mb-2" htmlFor="email">
						Descrição
					</label>
					<input
						id="content"
						type="text"
						value={data.content}
						onChange={(e) =>
							setData({ ...data, content: e.target.value })
						}
						className="w-full p-2 border border-gray-300 rounded text-black"
					/>
				</div>
				<div className="mb-12">
					<label className="block text-gray-700 mb-2" htmlFor="email">
						User
					</label>
					<select className="w-full p-2 border border-gray-300 rounded text-black" name="user" onChange={(e) => asignCard(e.target.value)}>
						<option value={undefined}></option>
						{users.map((user, index) => <option selected={user.id == data.id_user ? true : false} key={index} value={user.id}>{user.name}</option>)}
					</select>
				</div>

				{/* <div className="mb-12">
					<h2 className="text-lg text-purple-500 font-bold mb-4">
						Tasks
					</h2>
					{data.tasks.map((task, index) => (
						<div className="flex items-center mb-4">
							<input
								id={`task-${index}`}
								type="checkbox"
                                onChange={(e) => setTask(e.target.checked, index)}
								value={task.completed ? 1 : 0}
								className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
							/>
							<label
								htmlFor={`task-${index}`}
								className="ms-2 text-sm text-black font-medium"
							>
								{task.title}
							</label>
						</div>
					))}
				</div> */}
				<div className="flex justify-end space-x-4">
					<button
						onClick={onClose}
						className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
					>
						Cancelar
					</button>
					<button
						onClick={handleSave}
						className="bg-purple-800 text-white font-bold py-2 px-4 rounded"
					>
						Enviar
					</button>
				</div>
			</div>
		</div>
	);
}
