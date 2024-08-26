import React, { useEffect } from "react";
const Container = ({ children }: { children: React.ReactNode }) => {

	return (
		<>
			<div id="comments-test" className="container mx-auto px-4 py-8">
				{children}
			</div>
		</>
	);
};

export default Container;
