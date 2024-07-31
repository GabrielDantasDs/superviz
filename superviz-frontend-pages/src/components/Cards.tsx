import React, { useEffect } from "react";

const Cards = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<div
				className="bg-white shadow-lg rounded-lg overflow-hidden mb-4"
			>

                {children}
			</div>

		</>
	);
};

export default Cards;
