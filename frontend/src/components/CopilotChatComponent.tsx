import React from "react";
import { CopilotChat } from "@copilotkit/react-ui";
import { useCoAgentStateRender, useCopilotAction } from "@copilotkit/react-core";

// Main component for the chat interface
export function CopilotChatComponent() {
  // Agent renderers - matching the agent names from CrewAI
  const agentNames = [
    { id: "Real_Estate_Property_Searcher", displayName: "Property Search" },
    { id: "Local_Amenity_Finder", displayName: "Amenity Finder" },
    { id: "property_search", displayName: "Property Search" },
    { id: "lifestyle_filter", displayName: "Lifestyle Filter" },
    { id: "output_agent", displayName: "Output Agent" },
    { id: "Real_Estate_Property_Output_Agent", displayName: "Output Agent" },
    { id: "Real_Estate_Summary_Expert", displayName: "Summary Expert" },
    { id: "summarizer", displayName: "Summary Expert" }
  ];

  // Register all agents to maximize chance of capturing state
  agentNames.forEach(({ id, displayName }) => {
    useCoAgentStateRender({
      name: id,
      render: (props: any) => {
        const { status, state } = props;
        console.log(`${displayName} state update:`, { status, state });
        
        // Display different UI based on state
        if (state) {
          return (
            <div className="text-xs my-1 p-2 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md">
              <div className="font-medium text-blue-700 dark:text-blue-300">{displayName}</div>
              <div className="text-blue-600 dark:text-blue-400">
                {state.message || state.statusMessage || `Status: ${status}`}
                {state.thought && (
                  <div className="mt-1 italic text-xs">{state.thought}</div>
                )}
                {state.tool_name && (
                  <div className="mt-1 text-xs font-mono">Using: {state.tool_name}</div>
                )}
              </div>
            </div>
          );
        }
        return null;
      }
    });
  });

  // Catch all action renderer for any tools used
  useCopilotAction({
    name: "*",
    render: (props: any) => {
      const name = props.args?.name || "Unknown Tool";
      const status = props.status;
      const args = props.args || {};
      
      console.log(`Action update:`, { name, status, args });
      
      return (
        <div className="text-xs my-1 p-2 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md">
          <div className="font-medium text-green-700 dark:text-green-300">Tool: {name}</div>
          <div className="text-green-600 dark:text-green-400">
            Status: {status}
            {Object.keys(args).length > 0 && (
              <div className="mt-1 text-xs font-mono overflow-hidden text-ellipsis">
                {JSON.stringify(args).substring(0, 100)}
                {JSON.stringify(args).length > 100 ? "..." : ""}
              </div>
            )}
          </div>
        </div>
      );
    }
  });

  // Specific tool renderers for CrewAI common tools
  const toolNames = [
    "search_properties_for_sale",
    "get_nearby_places",
    "get_lifestyle_amenities",
    "get_property_details",
    "generate_summary"
  ];

  toolNames.forEach(toolName => {
    useCopilotAction({
      name: toolName,
      render: (props: any) => {
        console.log(`${toolName} action update:`, props);
        
        let statusEmoji = "⏳";
        let statusClass = "bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700";
        
        if (props.status === "executing" || props.status === "inProgress") {
          statusEmoji = "🔄";
        } else if (props.status === "complete") {
          statusEmoji = "✅";
          statusClass = "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700";
        }
        
        return (
          <div className={`text-xs my-1 p-2 ${statusClass} border rounded-md`}>
            <div className="font-medium">{statusEmoji} {toolName.replace(/_/g, " ")}</div>
            <div className="mt-1 text-xs">
              Status: {props.status}
            </div>
          </div>
        );
      }
    });
  });

  return (
    <CopilotChat
      className="min-w-1/3 overflow-y-auto h-full"
      labels={{
        title: "Real Estate Assistant",
        initial: "👋 Hi! I can help you find properties that match your needs. How can I assist you today?",
      }}
    />
  );
}
