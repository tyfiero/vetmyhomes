import React from "react";
import { CopilotChat } from "@copilotkit/react-ui";
// import type { Message as CopilotMessageType } from "@copilotkit/react-core"; // Attempted this, but still faced linter issues.
import { useEffect, useState } from "react";
import { useCoAgentStateRender, useCopilotAction } from "@copilotkit/react-core";

// Define a more specific type for the message object
interface ActionExecutionStatus {
	code?: string;
	status?: "inProgress" | "complete" | "error";
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

// Type guard function to check if a message is an ActionExecutionMessage
function isActionExecutionMessage(
	message: CopilotMessage,
): message is ActionExecutionMessage {
	return message.type === "ActionExecutionMessage";
}

// A union type for all possible message types
type CopilotMessage = ActionExecutionMessage | BaseMessage;

// Using 'any' for the message type as a temporary workaround for linter issues
// with specific type imports from @copilotkit/react-core.
// The structure of the message object (e.g., message.content) is assumed based on common patterns.
export interface CopilotMessageRenderProps {
	message: CopilotMessage;
}

// Status display component with progress bar
const StatusDisplay = ({ state }: { state: any }) => {
    const getStatusColor = () => {
        switch (state.status?.state) {
            case "initialized":
                return "bg-blue-500";
            case "searching":
                return "bg-yellow-500";
            case "analyzing":
                return "bg-purple-500";
            case "formatting":
                return "bg-indigo-500";
            case "complete":
                return "bg-green-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-200">
                    {state.status?.message || "Processing..."}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {state.status?.progress}%
                </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                    className={`${getStatusColor()} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${state.status?.progress || 0}%` }}
                />
            </div>
            {state.status?.current_task && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Current task: {state.status.current_task}
                </div>
            )}
        </div>
    );
};

// Action display component
const ActionDisplay = ({ name, status, args }: { name: string; status: string; args: any }) => {
    return (
        <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800 mb-2 border border-gray-200 dark:border-gray-700">
            <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                    {name}
                </div>
                {args?.query && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        {args.query}
                    </div>
                )}
            </div>
            <div className={`px-2 py-1 text-xs rounded-full ${
                status === "complete" ? "bg-green-100 text-green-800" :
                status === "inProgress" ? "bg-yellow-100 text-yellow-800" :
                "bg-gray-100 text-gray-800"
            }`}>
                {status}
            </div>
        </div>
    );
};

// State display component
const StateDisplay = ({ state }: { state: any }) => {
    return (
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 mb-2">
            <div className="font-medium">Current State</div>
            <div className="text-sm">
                {state.status?.state && (
                    <div>Status: {state.status.state}</div>
                )}
                {state.status?.message && (
                    <div>Message: {state.status.message}</div>
                )}
            </div>
        </div>
    );
};

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
    // Handle tool calls
    useCopilotAction({
        name: "*",
        render: ({args, name, status}: any) => {
            console.log("Action received:", args, name, status);
            return <ActionDisplay name={name} status={status} args={args} />;
        }
    });

    // Handle state updates
    useCoAgentStateRender({
        name: "real_estate_agent",
        render: (state) => {
            console.log("State received:", state);
            return <StatusDisplay state={state} />;
        }
    });

	return (
		<CopilotChat
			className="min-w-1/3 overflow-y-auto"
			labels={{
				title: "Real Estate Assistant",
				initial: "👋 Hi! I can help you find properties that match your needs. How can I assist you today?",
			}}
			// RenderActionExecutionMessage={CustomActionExecutionMessage}
		/>
	);
}
