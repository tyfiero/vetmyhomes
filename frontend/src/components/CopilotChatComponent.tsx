import React from "react";
import { CopilotChat } from "@copilotkit/react-ui";
// import type { Message as CopilotMessageType } from "@copilotkit/react-core"; // Attempted this, but still faced linter issues.
import { useEffect, useState } from "react";

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

const CustomActionExecutionMessage: React.FC<CopilotMessageRenderProps> = ({
	message,
}) => {
	console.log(
		"RenderActionExecutionMessage received:",
		JSON.stringify(message, null, 2),
	);

	const [displayInfo, setDisplayInfo] = useState<string | null>(null);

	useEffect(() => {
		// Map agent names to user-friendly display names
		const agentDisplayNames: Record<string, string> = {
			real_estate_agent: "Real Estate Search",
			property_analyzer: "Property Analysis",
		};

		if (isActionExecutionMessage(message)) {
			const statusCode = message.status?.code?.toLowerCase();
			const displayName = agentDisplayNames[message.name] || message.name;
			const query = message.arguments?.query ? `: "${message.arguments.query}"` : "";

			switch (statusCode) {
				case "pending":
					setDisplayInfo(`Searching properties${query}...`);
					break;
				case "success":
					setDisplayInfo(`Found properties matching your criteria`);
					break;
				case "error":
				case "failed":
					setDisplayInfo(`Search failed. Please try again.`);
					break;
				default:
					setDisplayInfo(`Processing your real estate search${query}`);
			}
		} else if (typeof message.content === "string") {
			try {
				const parsedContent = JSON.parse(message.content);
				if (parsedContent.task_name && parsedContent.status) {
					const status = parsedContent.status.toLowerCase();
					
					if (status === "started") {
						setDisplayInfo(`Finding properties that match your criteria...`);
					} else if (status === "completed" || status === "success") {
						setDisplayInfo(`Found properties for you`);
					} else if (status === "analyzing") {
						setDisplayInfo(`Analyzing property matches...`);
					} else {
						setDisplayInfo(`Processing your search...`);
					}
				} else {
					setDisplayInfo(message.content);
				}
			} catch (e) {
				console.log(e);
				setDisplayInfo(message.content);
			}
		} else {
			setDisplayInfo("Finding properties for you...");
		}
	}, [message]);

	if (!displayInfo) {
		return (
			<div className="text-sm text-neutral-600 dark:text-neutral-300 italic my-1 p-3">
				Finding properties for you...
			</div>
		);
	}

	return (
		<div className="text-sm text-neutral-700 dark:text-neutral-200 my-1 p-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-sm">
			{displayInfo}
		</div>
	);
};

export function CopilotChatComponent() {
	return (
		<CopilotChat
			className="min-w-1/3 overflow-y-auto"
			labels={{
				title: "Real Estate Assistant",
				initial: "👋 Hi! I can help you find properties that match your needs. How can I assist you today?",
			}}
			RenderActionExecutionMessage={CustomActionExecutionMessage}
		/>
	);
}
