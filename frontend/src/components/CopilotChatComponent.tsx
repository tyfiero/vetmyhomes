import { CopilotChat } from "@copilotkit/react-ui";
// import type { Message as CopilotMessageType } from "@copilotkit/react-core"; // Attempted this, but still faced linter issues.
import { useEffect, useState } from "react";

// Using 'any' for the message type as a temporary workaround for linter issues
// with specific type imports from @copilotkit/react-core.
// The structure of the message object (e.g., message.content) is assumed based on common patterns.
export interface CopilotMessageRenderProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	message: any; // Fallback to any to bypass import/type resolution issues for now
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
		let taskName: string | undefined;
		let currentStatus: string | undefined;
		// Agent name from the message object itself, if available
		// let agentDisplayName: string | undefined;

		if (message && message.type === "ActionExecutionMessage") {
			// Use message.name as the primary identifier for the action/task
			taskName = message.name;
			if (message.status && typeof message.status.code === "string") {
				currentStatus = message.status.code;
			}
			// The `execution_log.json` has a more descriptive agent name,
			// but `message.name` (e.g., "real_estate_agent") is what we get here directly.
			// We could potentially map `message.name` to a more friendly display name if needed.
			// For now, we'll use message.name directly or a generic term.
			// agentDisplayName = message.name; // Or a more generic term like "Agent"
		} else if (message && typeof message.content === "string") {
			// Fallback for older assumption or if content has JSON string with task details
			try {
				const parsedContent = JSON.parse(message.content);
				if (parsedContent.task_name && parsedContent.status) {
					taskName = parsedContent.task_name;
					currentStatus = parsedContent.status;
					// agentDisplayName = parsedContent.agent; // From parsed content
				} else {
					setDisplayInfo(message.content); // Show raw content if not the expected JSON
					return;
				}
			} catch (e) {
				// Content is not JSON or malformed, treat as plain text
				console.log(e);

				setDisplayInfo(message.content);
				return;
			}
		} else {
			// If message structure is not recognized or content is missing
			setDisplayInfo("Processing action...");
			return;
		}

		if (taskName && currentStatus) {
			let text = `Task: ${taskName}`;
			// agentDisplayName is now derived from message.name for ActionExecutionMessage
			// or from parsedContent.agent for the fallback.
			// We'll use taskName as the agent identifier here for simplicity,
			// as per the new understanding of ActionExecutionMessage structure.
			// If you have a separate, more descriptive agent name to show, integrate it here.
			text += ` - Status: ${currentStatus}`;
			if (
				currentStatus.toLowerCase() !== "completed" &&
				currentStatus.toLowerCase() !== "success" && // Added 'success' based on logs
				currentStatus.toLowerCase() !== "error" &&
				currentStatus.toLowerCase() !== "failed"
			) {
				text += "...";
			}
			setDisplayInfo(text);
		} else if (typeof message?.content === "string") {
			// If parsing failed to find specific fields but content exists
			setDisplayInfo(message.content);
		} else if (taskName && !currentStatus) {
			// If we have a task name but no status yet (e.g., initial pending)
			setDisplayInfo(`Task: ${taskName} - Initializing...`);
		}
		// If displayInfo remains null, the render part will show a default message.
	}, [message]);

	if (!displayInfo) {
		return (
			<div className="text-sm text-neutral-600 dark:text-neutral-300 italic my-1 p-3">
				Working on it...
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
				title: "Popup Assistant",
				initial: "👋 Hi, there! How can I help you today?",
			}}
			RenderActionExecutionMessage={CustomActionExecutionMessage}
		/>
	);
}
