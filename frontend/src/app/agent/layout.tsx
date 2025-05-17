"use client";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-full w-full" suppressHydrationWarning>
			<CopilotKit
				agent="sample_agent" // lock the agent to the sample_agent since we only have one agent
				runtimeUrl="/api/copilotkit"
				showDevConsole={false}
			>
				{children}
			</CopilotKit>
		</div>
	);
}
