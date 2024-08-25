import { setCardActivity } from "@/redux/cardActivitySlice";
import { setLists } from "@/redux/listsSlice";
import { RootState } from "@/redux/store";
import { setUpdateCardsActivities } from "@/redux/updateCardsActivitiesSlice";
import { setUpdateList } from "@/redux/updateListSlice";
import { useRealtime } from "@superviz/react-sdk";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function Event() {
	const { subscribe, publish } = useRealtime("MY_CHANNEL");
	const updateList = useSelector((state: RootState) => state.updateList);
	const participant = useSelector((state: RootState) => state.participant);
	const updateCardsActivities = useSelector((state: RootState) => state.updateCardsActivities)
	const lists = useSelector((state: RootState) => state.lists);
	const cards_activities = useSelector((state: RootState) => state.cards_activities);
	const dispatch = useDispatch();

	useEffect(() => {
		subscribe("MyEvent", getData);
	}, []);

	useEffect(() => {
		sendData();
	}, [updateList, updateCardsActivities]);

	const sendData = () => {
		publish("MyEvent", {lists:lists, cards_activities: cards_activities});
	};

	const getData = (data: any) => {
		console.log(data.participantId)
		if (data.participantId !== `participant-${localStorage.getItem("id")}`) {
			console.log(data.data)
			dispatch(setLists(data.data.lists.slice()));
			dispatch(setCardActivity(data.data.cards_activities.slice()));
		}

		dispatch(setUpdateList(false));
		dispatch(setUpdateCardsActivities(false));
	};

	return (
		<></>
	);
}
