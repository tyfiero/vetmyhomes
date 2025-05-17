"use client";

import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { useState } from "react";

export default function CopilotKitPage() {
	const [themeColor, setThemeColor] = useState("#a4c1ff");

	// 🪁 Frontend Actions: https://docs.copilotkit.ai/guides/frontend-actions
	// useCopilotAction({
	// 	name: "setThemeColor",
	// 	parameters: [
	// 		{
	// 			name: "themeColor",
	// 			description: "The theme color to set. Make sure to pick nice colors.",
	// 			required: true,
	// 		},
	// 	],
	// 	handler({ themeColor }) {
	// 		setThemeColor(themeColor);
	// 	},
	// });

	return (
		<main className="h-screen w-full flex" suppressHydrationWarning>
			<CopilotChat
				suppressHydrationWarning
				className="min-w-1/3"
				labels={{
					title: "Popup Assistant",
					initial: "👋 Hi, there! How can I help you today?",
				}}
			/>
			<MainContent themeColor={themeColor} />
		</main>
	);
}

// State of the agent, make sure this aligns with your agent's state.
type AgentState = {
	properties: string[];
};

function MainContent({ themeColor }: { themeColor: string }) {
	// 🪁 Shared State: https://docs.copilotkit.ai/coagents/shared-state
	const { state, setState } = useCoAgent<AgentState>({
		name: "real_estate_agent",
		initialState: {
			properties: [],
		},
	});

	// 🪁 Frontend Actions: https://docs.copilotkit.ai/coagents/frontend-actions
	useCopilotAction({
		name: "addProperty",
		parameters: [
			{
				name: "property",
				description: "The property to add. Make it witty, short and concise.",
				required: true,
			},
		],
		handler: ({ property }) => {
			setState({
				...state,
				properties: [...state.properties, property],
			});
		},
	});

	//🪁 Generative UI: https://docs.copilotkit.ai/coagents/generative-ui
	// useCopilotAction({
	// 	name: "getWeather",
	// 	description: "Get the weather for a given location.",
	// 	available: "disabled",
	// 	parameters: [{ name: "location", type: "string", required: true }],
	// 	render: ({ args }) => {
	// 		return <WeatherCard location={args.location} themeColor={themeColor} />;
	// 	},
	// });

	return (
		<div
			style={{ backgroundColor: themeColor }}
			className="w-full flex justify-center items-center flex-col transition-colors duration-300 h-full px-4"
		>
			<div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-2xl w-full">
				<h1 className="text-4xl font-bold text-white mb-2 text-center">
					Real Estate Agent
				</h1>
				<hr className="border-white/20 my-6" />
			</div>
		</div>
	);
}
