import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setParticipant } from "../redux/participantSlice";
import Swal from "sweetalert2";
import axios from "axios";

const useFetchParticipant = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		fetchData();
	}, [dispatch]);

	const fetchData = async () => {
		const { value: name } = await Swal.fire({
			title: "Enter your name",
			input: "text",
			inputLabel: "Your name",
			showCancelButton: true,
			inputValidator: (value) => {
				if (!value) {
					return "You need to write something!";
				}
			},
		});

		if (name) {
			axios
				.post("https://632e-2804-d55-48b8-5200-dfcd-929-4ae7-4b45.ngrok-free.app/participants", { name: name })
				.then((res) => {
					dispatch(
						setParticipant({ id: res.data.id.toString(), name: res.data.name })
					);
				});
		}
	};
}

export default useFetchParticipant;
