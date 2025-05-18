"use client";

import type { ReactNode } from "react";
import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { useEffect, useState } from "react";

export default function CopilotKitPage() {
	const [themeColor] = useState("#a4c1ff");

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
	outputs?: string;
};

function MainContent({ themeColor }: { themeColor: string }): ReactNode {
	// 🪁 Shared State: https://docs.copilotkit.ai/coagents/shared-state
	const { state, setState } = useCoAgent<AgentState>({
		name: "real_estate_agent",
		initialState: {
			properties: [],
			outputs: "",
		},
	});
	useEffect(() => {
		console.log(state);
	}, [state]);
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
			setState((prevState) => ({
				...prevState,
				properties: [...(prevState?.properties || []), property],
			}));
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

	const renderReport = (reportString: string) => {
		if (!reportString) {
			return null;
		}
		const sections = reportString.split("\n---\n");
		return sections.map((section, sectionIndex) => {
			const lines = section.trim().split("\n");
			const title = lines[0] || `Section ${sectionIndex + 1}`;
			const content = lines.slice(1);
			return (
				<div
					key={`section-${sectionIndex}-${title}`}
					className="mb-6 p-4 bg-white/30 rounded-lg shadow"
				>
					<h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
					{content.map((line, lineIndex) => {
						const lineKey = `section-${sectionIndex}-line-${lineIndex}-${line.substring(0, 10)}`;
						if (line.startsWith("- ")) {
							return (
								<li key={lineKey} className="text-white/90 ml-4 list-disc">
									{line.substring(2)}
								</li>
							);
						}
						if (/^\d+\.\s/.test(line)) {
							return (
								<li key={lineKey} className="text-white/90 ml-4 list-decimal">
									{line.substring(line.indexOf(" ") + 1)}
								</li>
							);
						}
						return (
							<p key={lineKey} className="text-white/90 mb-1">
								{line}
							</p>
						);
					})}
				</div>
			);
		});
	};

	return (
		<div
			style={{ backgroundColor: themeColor }}
			className="w-full flex justify-center items-start pt-8 flex-col transition-colors duration-300 h-full px-4 overflow-y-auto"
		>
			<div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-2xl w-full my-8">
				<h1 className="text-4xl font-bold text-white mb-2 text-center">
					Real Estate Agent
				</h1>
				<hr className="border-white/20 my-6" />
				{state?.outputs ? (
					<div className="text-white">{renderReport(state.outputs)}</div>
				) : (
					<p className="text-white/70 text-center">
						No report generated yet. Interact with the assistant to generate
						one.
					</p>
				)}
			</div>
		</div>
	);
}
