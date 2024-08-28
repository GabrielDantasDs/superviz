import { setCardActivity } from "@/redux/cardActivitySlice";
import { setLists } from "@/redux/listsSlice";
import { RootState } from "@/redux/store";
import { setUpdateCardsActivities } from "@/redux/updateCardsActivitiesSlice";
import { setUpdateList } from "@/redux/updateListSlice";
import { Realtime, useRealtime } from "@superviz/react-sdk";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function Event() {
	const { subscribe, unsubscribe, publish, fetchHistory } = useRealtime();
	const updateList = useSelector((state: RootState) => state.updateList);
	const participant = useSelector((state: RootState) => state.participant);
	const updateCardsActivities = useSelector((state: RootState) => state.updateCardsActivities)
	const lists = useSelector((state: RootState) => state.lists);
	const cards_activities = useSelector((state: RootState) => state.cards_activities);
	const dispatch = useDispatch();

	const getData = (data: any) => {
		if (data.participantId !== `participant-${participant.id}`) {
			dispatch(setLists(data.data.lists.slice()));
			dispatch(setCardActivity(data.data.cards_activities.slice()));
		}

		dispatch(setUpdateList(false));
		dispatch(setUpdateCardsActivities(false));
	};
	
	useEffect(() => {
		subscribe("my.event", getData);
	}, []);

	useEffect(() => {
		sendData();
	}, [updateList, updateCardsActivities]);

	const sendData = () => {
		publish("my.event", {lists:lists, cards_activities: cards_activities});
	};


	return (
		<></>
	);
}
