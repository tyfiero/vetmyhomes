"use client";

import React from "react";
import type { ReactNode } from "react";
import { useCoAgent, useCoAgentStateRender } from "@copilotkit/react-core";
import { useEffect, useState } from "react";
import { CopilotChatComponent } from "@/components/CopilotChatComponent";
import PropertyCard from "../../components/PropertyCard";

// Define the detailed structure of a property
type PropertyDetail = {
	address: string;
	price: number;
	bedrooms: number;
	bathrooms: number;
	sqft: number;
	agent: string;
	agent_phone: string;
	agent_email: string;
	environmental_risk: string;
	photos: string[];
};

// State of the agent, make sure this aligns with your agent's state.
type AgentState = {
	properties: PropertyDetail[];
	outputs?: string;
};

// Create a more user-friendly state renderer component
const RealEstateStateRenderer = ({
	state,
	status,
}: { state: AgentState | null; status: string }) => {
	if (!state) return null;

	// Get property count from outputs if properties array is empty
	const getPropertyCount = () => {
		if (state.properties && state.properties.length > 0) {
			return state.properties.length;
		}

		// Try to extract property count from outputs if it contains JSON
		if (state.outputs?.includes('"properties":')) {
			const match = state.outputs.match(/"properties":\s*\[\s*({[^}]+})/);
			if (match) return "found properties";
		}

		return null;
	};

	// Show different messages based on status
	const getStatusMessage = () => {
		if (status === "pending") return "Searching for properties...";
		if (status === "success") {
			const count = getPropertyCount();
			return count
				? `Found ${count}`
				: "Found properties matching your criteria";
		}
		if (status === "error") return "Error finding properties";
		return "Processing your request...";
	};

	return (
		<div className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-3">
			<p className="text-sm font-medium">{getStatusMessage()}</p>
			{state.outputs && !getPropertyCount() && (
				<p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
					Search complete
				</p>
			)}
		</div>
	);
};

export default function CopilotKitPage() {
	const [themeColor] = useState("#a4c1ff");

	// Register the state renderer
	useCoAgentStateRender({
		name: "real_estate_agent",
		render: ({ state, status }) => (
			<RealEstateStateRenderer state={state} status={status} />
		),
	});

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
		<main className="h-full w-full flex" suppressHydrationWarning>
			<CopilotChatComponent />
			<MainContent themeColor={themeColor} />
		</main>
	);
}

function MainContent({ themeColor }: { themeColor: string }): ReactNode {
	// 🪁 Shared State: https://docs.copilotkit.ai/coagents/shared-state
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { state, setState } = useCoAgent<AgentState>({
		name: "real_estate_agent",
		initialState: {
			properties: [],
			outputs: "",
		},
	});

	// Extract properties from outputs if needed
	useEffect(() => {
		console.log("Current agent state:", state);

		// If state.outputs contains a string and properties array is potentially empty or needs update
		if (
			state?.outputs &&
			typeof state.outputs === "string" &&
			state.outputs.trim() !== ""
		) {
			console.log("Attempting to parse state.outputs:", state.outputs);
			try {
				const correctedOutput = state.outputs.replace(/'/g, '"');
				console.log("Corrected state.outputs for parsing:", correctedOutput);
				const parsedData = JSON.parse(correctedOutput);

				if (parsedData?.properties && Array.isArray(parsedData.properties)) {
					// TODO: Add more robust validation for each property object if necessary
					const newProperties: PropertyDetail[] = parsedData.properties;

					// Only update if the parsed properties are different from current ones
					// This is a shallow comparison, for deep comparison, a utility function would be needed
					// or compare based on a specific aspect like number of properties.
					if (
						JSON.stringify(newProperties) !== JSON.stringify(state.properties)
					) {
						setState((prev) => ({
							...prev,
							properties: newProperties,
							// outputs: "", // Clear outputs after successful parsing to prevent re-processing
						}));
					}
				} else {
					// console.log("Parsed data does not contain 'properties' array:", parsedData);
				}
			} catch (e) {
				console.error("Failed to parse properties from state.outputs JSON:", e);
				// Potentially set an error state or clear properties if parsing fails
				// setState(prev => ({ ...prev, properties: [] }));
			}
		}
	}, [state, setState]); // Dependency on state (which includes outputs) and setState

	// 🪁 Frontend Actions: https://docs.copilotkit.ai/coagents/frontend-actions

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
			className="w-full flex items-start flex-col transition-colors duration-300 h-full px-4 overflow-y-auto"
		>
			<div className=" l max-w-2xl w-full py-4">
				{/* <h1 className="text-4xl font-bold text-white mb-2 text-center">
					Real Estate Agent
				</h1> */}
				{/* <hr className="border-white/20 my-6" /> */}
				{state?.properties && state.properties.length > 0 && (
					<div className="mb-6 p-4 bg-white/30 rounded-lg shadow">
						<h2 className="text-xl font-semibold text-white mb-2">
							Found a few properties
						</h2>
						<ul className="text-white/90 ml-4 list-disc">
							{state.properties.map((property, index) => (
								// <li
								// 	key={property.address || `property-${index}`}
								// 	className="mb-1"
								// >
								// 	{property.address}
								// </li>
								<PropertyCard
									key={property.address || `property-${index}`}
									property={property}
								/>
							))}
						</ul>
					</div>
				)}
				{/* {state?.outputs ? (
					<div className="text-white">{renderReport(state.outputs)}</div>
				) : (
					<p className="text-white/70 text-center">
						No report generated yet. Interact with the assistant to generate
						one.
					</p>
				)} */}
			</div>
		</div>
	);
}
