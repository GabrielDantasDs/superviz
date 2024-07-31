import React, { useEffect } from "react";
import { Comments, useCanvasPin, useHTMLPin } from "@superviz/react-sdk";

const Container = ({ children }: { children: React.ReactNode }) => {
	const containerId = "comments-test";

	const { pin } = useHTMLPin({ containerId: containerId });

	return (
		<>
			<div id="comments-test" className="container mx-auto px-4 py-8">
				{children}
			</div>
            <Comments
					pin={pin}
					buttonLocation="top-right"
					position="left"
				/>
		</>
	);
};

export default Container;
