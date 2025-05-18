import React from "react";
import { CopilotChat } from "@copilotkit/react-ui";
// import type { Message as CopilotMessageType } from "@copilotkit/react-core"; // Attempted this, but still faced linter issues.
import {
	useCoAgentStateRender,
	useCopilotAction,
} from "@copilotkit/react-core";
import { PROPERTIES } from "@/types";
import PropertyCard from "./PropertyCard";

// Define a more specific type for the message object
interface ActionExecutionStatus {
	code?: string;
	// Potentially other status fields
}

interface BaseMessage {
	content?: string;
	type?: string;
	id?: string;
	role?: "user" | "assistant" | "system" | "function" | "action"; // Expanded roles
}

interface ActionExecutionMessage extends BaseMessage {
	type: "ActionExecutionMessage";
	name: string;
	status: ActionExecutionStatus;
	arguments?: {
		query?: string;
		[key: string]: unknown;
	};
}

// A union type for all possible message types
type CopilotMessage = ActionExecutionMessage | BaseMessage;

// Using 'any' for the message type as a temporary workaround for linter issues
// with specific type imports from @copilotkit/react-core.
// The structure of the message object (e.g., message.content) is assumed based on common patterns.
export interface CopilotMessageRenderProps {
	message: CopilotMessage;
}

// const CustomActionExecutionMessage: React.FC<CopilotMessageRenderProps> = ({
// 	message,
// }) => {
// 	console.log(
// 		"RenderActionExecutionMessage received:",
// 		JSON.stringify(message, null, 2),
// 	);

// 	const [displayInfo, setDisplayInfo] = useState<string | null>(null);

//     useCopilotAction({
//         name: "*",
//         render: ({args, name, status}: any) => {
//             console.log("Action received:", args, name, status);
//             return <div className="bg-blue-500">Action received: {name}</div>;
//         }
//     })

// 	// useEffect(() => {
// 	// 	// Map agent names to user-friendly display names
// 	// 	const agentDisplayNames: Record<string, string> = {
// 	// 		real_estate_agent: "Real Estate Search",
// 	// 		property_analyzer: "Property Analysis",
// 	// 	};

// 	// 	if (isActionExecutionMessage(message)) {
// 	// 		const statusCode = message.status?.code?.toLowerCase();
// 	// 		const displayName = agentDisplayNames[message.name] || message.name;
// 	// 		const query = message.arguments?.query ? `: "${message.arguments.query}"` : "";

// 	// 		switch (statusCode) {
// 	// 			case "pending":
// 	// 				setDisplayInfo(`Searching properties${query}...`);
// 	// 				break;
// 	// 			case "success":
// 	// 				setDisplayInfo(`Found properties matching your criteria`);
// 	// 				break;
// 	// 			case "error":
// 	// 			case "failed":
// 	// 				setDisplayInfo(`Search failed. Please try again.`);
// 	// 				break;
// 	// 			default:
// 	// 				setDisplayInfo(`Processing your real estate search${query}`);
// 	// 		}
// 	// 	} else if (typeof message.content === "string") {
// 	// 		try {
// 	// 			const parsedContent = JSON.parse(message.content);
// 	// 			if (parsedContent.task_name && parsedContent.status) {
// 	// 				const status = parsedContent.status.toLowerCase();

// 	// 				if (status === "started") {
// 	// 					setDisplayInfo(`Finding properties that match your criteria...`);
// 	// 				} else if (status === "completed" || status === "success") {
// 	// 					setDisplayInfo(`Found properties for you`);
// 	// 				} else if (status === "analyzing") {
// 	// 					setDisplayInfo(`Analyzing property matches...`);
// 	// 				} else {
// 	// 					setDisplayInfo(`Processing your search...`);
// 	// 				}
// 	// 			} else {
// 	// 				setDisplayInfo(message.content);
// 	// 			}
// 	// 		} catch (e) {
// 	// 			console.log(e);
// 	// 			setDisplayInfo(message.content);
// 	// 		}
// 	// 	} else {
// 	// 		setDisplayInfo("Finding properties for you...");
// 	// 	}
// 	// }, [message]);

//     useCoAgentStateRender({
//         name: "real_estate_agent",
//         render: (state) => {
//             console.log("State received:", state);
//             return <div className="bg-green-500">State received: {JSON.stringify(state)}</div>;
//         }
//     })

// 	if (!displayInfo) {
// 		return (
// 			<div className="text-sm text-neutral-600 dark:text-neutral-300 italic my-1 p-3">
// 				Finding properties for you...
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className="text-sm text-neutral-700 dark:text-neutral-200 my-1 p-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-sm">
// 			{displayInfo}
// 		</div>
// 	);
// };

export function CopilotChatComponent() {
	useCopilotAction({
		name: "*",
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		render: ({ args, name, status }: any) => {
			console.log("Action received:", args, name, status);
			return (
				<div className="bg-sky-400/30 w-fit px-3 py-1 rounded-lg shadow-md">
					{name === "real_estate_agent" && (
						<div className="text-sm text-sky-700 flex items-center gap-2">
							<svg
								className="animate-spin h-4 w-4 text-sky-700"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<title>Loading indicator</title>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Searching for properties...
						</div>
					)}
				</div>
			);
		},
	});

	useCoAgentStateRender({
		name: "real_estate_agent",
		render: (state) => {
			console.log("State received:", state);
			return (
				<div className="w-full ">
					{/* State received: {JSON.stringify(state)}
					 */}
					{PROPERTIES && PROPERTIES.properties.length > 0 && (
						// {state?.properties && state.properties.length > 0 && (
						<div className="mb-6 p-4 bg-white/30 rounded-lg shadow w-full">
							<h2 className="text-xl font-semibold text-sky-700 mb-2">
								Found a few properties:
							</h2>
							<ul className="flex flex-wrap gap-4">
								{PROPERTIES.properties.map((property, index) => (
									<PropertyCard
										key={property.address || `property-${index}`}
										property={property}
									/>
								))}
							</ul>
						</div>
					)}
				</div>
			);
		},
	});

	return (
		<CopilotChat
			className="min-w-1/3 overflow-y-auto w-full"
			labels={{
				title: "Real Estate Assistant",
				initial:
					"👋 Hi! I can help you find properties that match your needs. How can I assist you today?",
			}}
			// RenderActionExecutionMessage={CustomActionExecutionMessage}
		/>
	);
}
