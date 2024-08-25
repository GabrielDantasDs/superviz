import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { MousePointers, WhoIsOnline } from "@superviz/react-sdk";
import Wrapper from "./components/Wrapper";
import { useDispatch } from "react-redux";
import { joinSprint, leftSprint } from "./redux/participantSlice";

const SuperVizRoomProvider = dynamic(
	() => import("@superviz/react-sdk").then((mod) => mod.SuperVizRoomProvider),
	{
		ssr: false,
	}
);

export function Providers({ children }: any, store: any) {
	const participant = useSelector((state: RootState) => state.participant);
	const sprint = useSelector((state: RootState) => state.sprint);
	const superviz_key = process.env.NEXT_PUBLIC_SUPERVIZ_KEY ?? "";
	const dispatch = useDispatch();

	const onParticipantLocalJoined = (participant: any) => {
		if (participant.hasOwnProperty("name")) {
			Swal.fire("Sucesso", `Bem vindo ${participant.name}`, "success");
			dispatch(joinSprint());
		}
	};

	const onParticipantLocalLeft = (participant: any) => {
		dispatch(leftSprint());
	};

	return (
		<SuperVizRoomProvider
			developerKey={superviz_key}
			group={{
				id: "1",
				name: "grupo",
			}}
			participant={{...participant, id: `participant-${participant.id}`}}
			onParticipantLocalJoined={onParticipantLocalJoined}
			onParticipantLocalLeft={onParticipantLocalLeft}
			roomId={`sprint-${sprint.id}`}
		>
			<WhoIsOnline position="top-right" />
			<MousePointers elementId="canva" />
			<Wrapper />
			{children}
		</SuperVizRoomProvider>
	);
}
