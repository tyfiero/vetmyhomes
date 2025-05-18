"use client";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-full w-full" suppressHydrationWarning>
			<CopilotKit
				agent="real_estate_agent" // lock the agent to the sample_agent since we only have one agent
				publicApiKey="ck_pub_a6a2225e8f158a06eb6d210ede15c8d8"
				// runtimeUrl="/api/copilotkit"
				showDevConsole={false}
			>
				{children}
			</CopilotKit>
		</div>
	);
}
