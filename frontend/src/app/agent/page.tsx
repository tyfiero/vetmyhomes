"use client";

import React from "react";
// import type { ReactNode } from "react";
// import { useCoAgent, useCoAgentStateRender } from "@copilotkit/react-core";
// import { useState } from "react";
import { CopilotChatComponent } from "@/components/CopilotChatComponent";
// import PropertyCard from "../../components/PropertyCard";
// import { PROPERTIES, type AgentState, type PropertyDetail } from "../../types";

// Define the detailed structure of a property
// type PropertyDetail = {
// \taddress: string;
// \tprice: number;
// \tbedrooms: number;
// \tbathrooms: number;
// \tsqft: number;
// \tagent: string;
// \tagent_phone: string;
// \tagent_email: string;
// \tenvironmental_risk: string;
// \tphotos: string[];
// };

// State of the agent, make sure this aligns with your agent\'s state.
// type AgentState = {
// \tproperties: PropertyDetail[];
// \toutputs?: string;
// };

// Create a more user-friendly state renderer component
// const RealEstateStateRenderer = ({
// \tstate,
// \tstatus,
// }: { state: AgentState | null; status: string }) => {
// \t// if (!state) return null;
// \tconsole.log("state", state);
// \tconsole.log("status", status);

// \t// // Get property count from outputs if properties array is empty
// \t// const getPropertyCount = () => {
// \t// \tif (state.properties && state.properties.length > 0) {
// \t// \t\treturn state.properties.length;
// \t// \t}\n\n// \t// \t// Try to extract property count from outputs if it contains JSON
// \t// \tif (state.outputs?.includes(\'\\"properties\\":\')) {
// \t// \t\tconst match = state.outputs.match(/\\"properties\\":\\s*\\[\\s*({[^}]+})/);\n// \t// \t\tif (match) return "found properties";
// \t// \t}\n\n// \t// \treturn null;\n// \t// };\n\n// \t// // Show different messages based on status
// \t// const getStatusMessage = () => {
// \t// \tif (status === "pending") return "Searching for properties...";
// \t// \tif (status === "success") {
// \t// \t\tconst count = getPropertyCount();
// \t// \t\treturn count
// \t// \t\t\t? `Found ${count}`
// \t// \t\t\t: "Found properties matching your criteria";
// \t// \t}\n// \t// \tif (status === "error") return "Error finding properties";
// \t// \treturn "Processing your request...";
// \t// };\n\n// \treturn (\n// \t\t<div className="w-full bg-red-500">\n// \t\t\tadsfasdf
// \t\t\t{PROPERTIES && PROPERTIES.properties.length > 0 && (
// \t\t\t\t// {state?.properties && state.properties.length > 0 && (\n// \t\t\t\t<div className="mb-6 p-4 bg-white/30 rounded-lg shadow">\n// \t\t\t\t\t<h2 className="text-xl font-semibold text-white mb-2">\n// \t\t\t\t\t\tFound a few properties:\n// \t\t\t\t\t</h2>\n// \t\t\t\t\t<ul className="text-white/90 ml-4 list-disc">\n// \t\t\t\t\t\t{PROPERTIES.properties.map((property, index) => (\n// \t\t\t\t\t\t\t<PropertyCard
// \t\t\t\t\t\t\t\tkey={property.address || `property-${index}`}
// \t\t\t\t\t\t\t\tproperty={property}
// \t\t\t\t\t\t\t/>\n// \t\t\t\t\t\t))}\n// \t\t\t\t\t</ul>\n// \t\t\t\t</div>\n// \t\t\t)}\n// \t\t</div>\n// \t);\n// };

export default function CopilotKitPage() {
	// const [themeColor] = useState("#a4c1ff");

	// Register the state renderer
	// useCoAgentStateRender({
	// 	name: "real_estate_agent",
	// 	render: ({ state, status }) => (
	// 		<RealEstateStateRenderer state={state} status={status} />
	// 	),
	// });

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
			{/* <MainContent themeColor={themeColor} /> */}
		</main>
	);
}

// function MainContent({ themeColor }: { themeColor: string }): ReactNode {
// 	// 🪁 Shared State: https://docs.copilotkit.ai/coagents/shared-state
// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 	const { state, setState } = useCoAgent<AgentState>({
// 		name: "real_estate_agent",
// 		initialState: {
// 			properties: [],
// 			outputs: "",
// 		},
// 	});

// 	// Extract properties from outputs if needed
// 	// useEffect(() => {
// 	// 	console.log("Current agent state:", state);

// 	// 	// If state.outputs contains a string and properties array is potentially empty or needs update
// 	// 	if (
// 	// 		state?.outputs &&
// 	// 		typeof state.outputs === "string" &&
// 	// 		state.outputs.trim() !== ""
// 	// 	) {
// 	// 		console.log("Attempting to parse state.outputs:", state.outputs);
// 	// 		try {
// 	// 			const correctedOutput = state.outputs.replace(/'/g, '"');
// 	// 			console.log("Corrected state.outputs for parsing:", correctedOutput);
// 	// 			const parsedData = JSON.parse(correctedOutput);

// 	// 			if (parsedData?.properties && Array.isArray(parsedData.properties)) {
// 	// 				// TODO: Add more robust validation for each property object if necessary
// 	// 				const newProperties: PropertyDetail[] = parsedData.properties;

// 	// 				// Only update if the parsed properties are different from current ones
// 	// 				// This is a shallow comparison, for deep comparison, a utility function would be needed
// 	// 				// or compare based on a specific aspect like number of properties.
// 	// 				if (
// 	// 					JSON.stringify(newProperties) !== JSON.stringify(state.properties)
// 	// 				) {
// 	// 					setState((prev) => ({
// 	// 						...prev,
// 	// 						properties: newProperties,
// 	// 						// outputs: "", // Clear outputs after successful parsing to prevent re-processing
// 	// 					}));
// 	// 				}
// 	// 			} else {
// 	// 				// console.log("Parsed data does not contain 'properties' array:", parsedData);
// 	// 			}
// 	// 		} catch (e) {
// 	// 			console.error("Failed to parse properties from state.outputs JSON:", e);
// 	// 			// Potentially set an error state or clear properties if parsing fails
// 	// 			// setState(prev => ({ ...prev, properties: [] }));
// 	// 		}
// 	// 	}
// 	// }, [state, setState]); // Dependency on state (which includes outputs) and setState

// 	// 🪁 Frontend Actions: https://docs.copilotkit.ai/coagents/frontend-actions

// 	//🪁 Generative UI: https://docs.copilotkit.ai/coagents/generative-ui
// 	// useCopilotAction({
// 	// 	name: "getWeather",
// 	// 	description: "Get the weather for a given location.",
// 	// 	available: "disabled",
// 	// 	parameters: [{ name: "location", type: "string", required: true }],
// 	// 	render: ({ args }) => {
// 	// 		return <WeatherCard location={args.location} themeColor={themeColor} />;
// 	// 	},
// 	// });

// 	return (
// 		<div
// 			style={{ backgroundColor: themeColor }}
// 			className="w-full flex items-start flex-col transition-colors duration-300 h-full px-4 overflow-y-auto"
// 		>
// 			<div className=" l max-w-2xl w-full py-4">
// 				{/* <h1 className="text-4xl font-bold text-white mb-2 text-center">
// 					Real Estate Agent
// 				</h1> */}
// 				{/* <hr className="border-white/20 my-6" /> */}
// 				{state?.properties && state.properties.length > 0 && (
// 					<div className="mb-6 p-4 bg-white/30 rounded-lg shadow">
// 						<h2 className="text-xl font-semibold text-white mb-2">
// 							Found a few properties:
// 						</h2>
// 						<ul className="text-white/90 ml-4 list-disc">
// 							{PROPERTIES.properties.map((property, index) => (
// 								// {state.properties.map((property, index) => (
// 								// <li
// 								// 	key={property.address || `property-${index}`}
// 								// 	className="mb-1"
// 								// >
// 								// 	{property.address}
// 								// </li>
// 								<PropertyCard
// 									key={property.address || `property-${index}`}
// 									property={property}
// 								/>
// 							))}
// 						</ul>
// 					</div>
// 				)}
// 				{/* {state?.outputs ? (
// 					<div className="text-white">{renderReport(state.outputs)}</div>
// 				) : (
// 					<p className="text-white/70 text-center">
// 						No report generated yet. Interact with the assistant to generate
// 						one.
// 					</p>
// 				)} */}
// 			</div>
// 		</div>
// 	);
// }
