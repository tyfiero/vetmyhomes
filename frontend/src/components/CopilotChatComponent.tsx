import { CopilotChat } from "@copilotkit/react-ui";
// import type { Message as CopilotMessageType } from "@copilotkit/react-core"; // Attempted this, but still faced linter issues.
import React, { useEffect, useState } from "react";

// Using 'any' for the message type as a temporary workaround for linter issues
// with specific type imports from @copilotkit/react-core.
// The structure of the message object (e.g., message.content) is assumed based on common patterns.
export interface CopilotMessageRenderProps {
  message: any; // Fallback to any to bypass import/type resolution issues for now
}

const CustomActionExecutionMessage: React.FC<CopilotMessageRenderProps> = ({ message }) => {
  console.log("RenderActionExecutionMessage received:", JSON.stringify(message, null, 2));

  const [displayInfo, setDisplayInfo] = useState<string | null>(null);

  useEffect(() => {
    // Early return if message is not valid
    if (!message) {
      setDisplayInfo("Processing your request...");
      return;
    }

    // Handle ActionExecutionMessage type
    if (message.type === "ActionExecutionMessage") {
      const { name, status, arguments: args } = message;
      
      // Get status code
      const statusCode = status?.code?.toLowerCase();
      
      // Map agent names to user-friendly display names
      const agentDisplayNames: Record<string, string> = {
        "real_estate_agent": "Real Estate Search"
      };
      
      // Get display name or use the original name
      const displayName = agentDisplayNames[name] || name;
      
      // Format the query if it exists
      const query = args?.query ? `: "${args.query}"` : "";
      
      // Build status text based on status code
      if (statusCode === "pending") {
        setDisplayInfo(`Searching properties${query}...`);
      } else if (statusCode === "success") {
        setDisplayInfo(`Found properties matching your criteria`);
      } else if (statusCode === "error" || statusCode === "failed") {
        setDisplayInfo(`Search failed. Please try again.`);
      } else {
        setDisplayInfo(`Processing your real estate search${query}`);
      }
      return;
    }
    
    // Handle plain text content
    if (typeof message.content === 'string') {
      try {
        // Try to parse as JSON first
        const parsedContent = JSON.parse(message.content);
        if (parsedContent.task_name && parsedContent.status) {
          const status = parsedContent.status.toLowerCase();
          const taskName = parsedContent.task_name;
          
          if (status === "started") {
            setDisplayInfo(`Finding properties that match your criteria...`);
          } else if (status === "completed" || status === "success") {
            setDisplayInfo(`Found properties for you`);
          } else {
            setDisplayInfo(`Processing your search...`);
          }
        } else {
          setDisplayInfo(message.content);
        }
      } catch (e) {
        // Not JSON, just use the content
        setDisplayInfo(message.content);
      }
      return;
    }
    
    // Default fallback
    setDisplayInfo("Processing your request...");
  }, [message]);

  if (!displayInfo) {
    return <div className="text-sm text-neutral-600 dark:text-neutral-300 italic my-1 p-3">Finding properties for you...</div>;
  }

  return (
    <div className="text-sm text-neutral-700 dark:text-neutral-200 my-1 p-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-sm">
      {displayInfo}
    </div>
  );
};

// Create a component to render the agent's state
const CustomAgentStateMessage: React.FC<CopilotMessageRenderProps> = ({ message }) => {
  // Early return if no message or state
  if (!message || !message.state) {
    return null;
  }

  // Extract properties from state or outputs
  const getPropertyInfo = () => {
    const state = message.state;
    
    // Check if properties array exists and has items
    if (state.properties && state.properties.length > 0) {
      return {
        count: state.properties.length,
        status: "found"
      };
    }
    
    // If no properties but outputs has JSON-like content
    if (state.outputs && state.outputs.includes('"properties":')) {
      // Try to extract property count from the JSON structure
      const match = state.outputs.match(/"properties":\s*\[\s*({[^}]+})/g);
      if (match) {
        // Count how many properties by counting address patterns
        const addressMatches = state.outputs.match(/"address":/g);
        const count = addressMatches ? addressMatches.length : "multiple";
        return {
          count,
          status: "processed"
        };
      }
    }
    
    return {
      count: 0,
      status: message.state.status || "searching"
    };
  };

  // Get property information
  const propInfo = getPropertyInfo();
  
  // Get appropriate message based on state
  const getStateMessage = () => {
    const status = (message.state.status || "").toLowerCase();
    
    if (propInfo.count > 0) {
      return `Found ${propInfo.count} properties matching your criteria`;
    } else if (status === "searching" || status === "pending") {
      return "Searching for properties in North Seattle...";
    } else if (status === "analyzing") {
      return "Analyzing property matches...";
    } else if (status === "error") {
      return "Error finding properties. Please try again.";
    } else if (propInfo.status === "processed") {
      return `Found ${propInfo.count} properties matching your criteria`;
    } else if (status === "completed" || status === "success") {
      return "Search complete!";
    }
    
    return "Processing your real estate request...";
  };

  return (
    <div className="text-sm text-neutral-700 dark:text-neutral-200 my-1 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm">
      <p className="font-medium">{getStateMessage()}</p>
      {propInfo.count > 0 && (
        <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
          Price range: up to $1.5 million
        </p>
      )}
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
      RenderAgentStateMessage={CustomAgentStateMessage}
    />
  );
} 