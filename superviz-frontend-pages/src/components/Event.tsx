import { setLists } from "@/redux/listsSlice";
import { RootState } from "@/redux/store";
import { setUpdateList } from "@/redux/updateListSlice";
import { useRealtime } from "@superviz/react-sdk";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function Event() {
	const { subscribe, publish } = useRealtime("MY_CHANNEL");
	const updateList = useSelector((state: RootState) => state.updateList);
	const lists = useSelector((state: RootState) => state.lists);
	const dispatch = useDispatch();

	useEffect(() => {
		subscribe("MyEvent", getData);
	}, []);

	useEffect(() => {
		sendData();
	}, [updateList]);

	const sendData = () => {
		publish("MyEvent", lists);
	};

	const getData = (data: any) => {
		if (data.participantId !== localStorage.getItem("id")) {
			dispatch(setLists(data.data));
		}

		dispatch(setUpdateList(false));
	};

	return (
		<></>
	);
}
