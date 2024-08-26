import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setParticipant } from "../redux/participantSlice";
import Swal from "sweetalert2";
import axios from "axios";

const useFetchParticipant = () => {
	const dispatch = useDispatch();
	
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
				.post("${process.env.NEXT_PUBLIC_BACKEND_API}/participants", { name: name })
				.then((res) => {
					dispatch(
						setParticipant({ id: res.data.id.toString(), name: res.data.name, isHost: true, joined: false })
					);
				});
		}
	};
}

export default useFetchParticipant;
