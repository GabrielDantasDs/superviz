import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Participant } from "./interfaces/types";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

const SuperVizRoomProvider = dynamic(
	() => import("@superviz/react-sdk").then((mod) => mod.SuperVizRoomProvider),
	{
		ssr: false,
	}
);

export function Providers({ children }: any, store:any) {
	const participant = useSelector((state: RootState) => state.participant);

	return (
		<SuperVizRoomProvider
			developerKey={"ascut2pz3ubo52i0liftnt1nh1mchj"}
			group={{
				id: "1",
				name: "grupo",
			}}
			participant={participant}
			onParticipantJoined={(participant) => Swal.fire('Olá', `bem vindo a sala ${participant.name}`, 'success')}
			roomId="1"
		>
			{children}
		</SuperVizRoomProvider>
	);
}
