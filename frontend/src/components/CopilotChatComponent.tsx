import { CopilotChat } from "@copilotkit/react-ui";

export function CopilotChatComponent() {
  return (
    <CopilotChat
      className="min-w-1/3 overflow-y-auto"
      labels={{
        title: "Popup Assistant",
        initial: "👋 Hi, there! How can I help you today?",
      }}
    />
  );
} 