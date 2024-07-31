import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

const SuperVizRoomProvider = dynamic(
	() => import("@superviz/react-sdk").then((mod) => mod.SuperVizRoomProvider),
	{
		ssr: false,
	}
);

export function Providers({ children }: any, store: any) {
	const participant = useSelector((state: RootState) => state.participant);
	const meeting = useSelector((state: RootState) => state.meeting);

	const onParticipantJoined = (participant: any) => {
		if (participant.hasOwnProperty("name")) {
			Swal.fire("Sucesso", `Bem vindo ${participant.name}`, "success");
		}
	};

	return (
		<SuperVizRoomProvider
			developerKey={"ascut2pz3ubo52i0liftnt1nh1mchj"}
			group={{
				id: "1",
				name: "grupo",
			}}
			participant={participant}
			onParticipantJoined={onParticipantJoined}
			roomId={meeting.id}
		>
			{children}
		</SuperVizRoomProvider>
	);
}
