import RootLayout from "@/components/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function App({ Component, pageProps }: AppProps) {
	const [isClient, setIsClient] = useState(false);
	
	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<>
			<Provider store={store}>
				<Component {...pageProps} />
			</Provider>
		</>
	);
}
