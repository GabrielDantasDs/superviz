import { Realtime } from "@superviz/react-sdk";
import Event from "./Event";

export default function Wrapper() {
	return (
		<>
			<Realtime />
			<Event />
		</>
	);
}
