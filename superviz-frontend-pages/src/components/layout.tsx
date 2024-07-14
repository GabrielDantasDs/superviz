import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "../providers";
import { store } from '../redux/store';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers store={store}>{children}</Providers>
			</body>
		</html>
	);
}
