import { useRealtime } from "@superviz/react-sdk";
import { useEffect } from "react";
import Swal from "sweetalert2";


export default function Event() {
    const { subscribe, publish } = useRealtime();

	useEffect(() => {
	  subscribe("MyEvent", getData);
	}, []);
  
	const sendData = () => {
	  publish("MyEvent", "MyData");
	};
  
	const getData = (e : any) => {
	  Swal.fire('Mensagem', 'Enviando uma mensagem a todos', 'info');
	};

    return(
        <button className="bg-indigo-500 rounded p-2" onClick={sendData}>Send data to everyone in the room</button>
    )
}