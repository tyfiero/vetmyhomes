import io
from contextlib import redirect_stdout
from typing import Any, Callable, Dict, List, Optional

from crewai import LLM, Agent, Crew, Process, Task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai.project import CrewBase, agent, crew, task
from crews.research_crew.realtor_tools import REALTOR_TOOLS
from crews.research_crew.types import PropertyList

# Default to gpt-4o for better results
MODEL = "openai/gpt-4o"
# MODEL = "groq/llama3-70b-8192"

llm = LLM(
    model=MODEL,
)


# Custom callback handler for streaming agent state updates
class StreamingCrewHandler:
    """Handler for streaming crew progress to the frontend"""

    def __init__(
        self, stream_callback: Optional[Callable[[Dict[str, Any]], None]] = None
    ):
        self.stream_callback = stream_callback
        self.task_statuses = {}

    def on_agent_start(
        self, agent_name: str, task_name: str, inputs: Dict[str, Any]
    ) -> None:
        """Called when an agent starts working on a task"""
        update = {
            "agent": agent_name,
            "task": task_name,
            "status": "started",
            "inputs": inputs,
        }
        self._send_update(agent_name, update)

    def on_agent_finish(self, agent_name: str, task_name: str, output: Any) -> None:
        """Called when an agent completes a task"""
        update = {
            "agent": agent_name,
            "task": task_name,
            "status": "completed",
            "output": output,
        }
        self._send_update(agent_name, update)

    def on_tool_start(self, agent_name: str, tool_name: str, tool_input: Any) -> None:
        """Called when an agent starts using a tool"""
        update = {
            "agent": agent_name,
            "tool_name": tool_name,
            "status": "tool_start",
            "tool_input": tool_input,
        }
        self._send_update(agent_name, update)

    def on_tool_finish(self, agent_name: str, tool_name: str, tool_output: Any) -> None:
        """Called when a tool completes execution"""
        update = {
            "agent": agent_name,
            "tool_name": tool_name,
            "status": "tool_finish",
            "tool_output": tool_output,
        }
        self._send_update(agent_name, update)

    def on_agent_thinking(self, agent_name: str, thought: str) -> None:
        """Called when an agent is thinking (deliberating)"""
        update = {"agent": agent_name, "status": "thinking", "thought": thought}
        self._send_update(agent_name, update)

    def _send_update(self, agent_name: str, update: Dict[str, Any]) -> None:
        """Send an update to the frontend if callback is provided"""
        if self.stream_callback:
            try:
                self.stream_callback(update)
            except Exception as e:
                print(f"Error sending stream update: {e}")


@CrewBase
class ResearchCrew:
    """Research crew for comprehensive topic analysis and reporting"""

    agents: List[BaseAgent]
    tasks: List[Task]

    @agent
    def property_search(self) -> Agent:
        return Agent(
            config=self.agents_config["property_search"],  # type: ignore[index]
            verbose=True,
            tools=REALTOR_TOOLS,
            chat_llm=MODEL,
        )

    @agent
    def output_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["output_agent"],  # type: ignore[index]
            verbose=True,
            chat_llm=MODEL,  # Explicitly set for consistency
        )

    @agent
    def lifestyle_filter(self) -> Agent:
        return Agent(
            config=self.agents_config["lifestyle_filter"],
            verbose=True,
            tools=REALTOR_TOOLS,
            chat_llm=MODEL,
        )

    @agent
    def summarizer(self) -> Agent:
        return Agent(
            config=self.agents_config["summarizer"],
            chat_llm=MODEL,  # Explicitly set for consistency
        )

    @task
    def property_search_task(self) -> Task:
        return Task(config=self.tasks_config["property_search_task"])  # type: ignore[index]

    @task
    def lifestyle_filter_task(self) -> Task:
        return Task(config=self.tasks_config["lifestyle_filter_task"])

    @task
    def render_report(self) -> Task:
        return Task(config=self.tasks_config["render_report"], output_json=PropertyList)

    @task
    def summarize_properties_task(self) -> Task:
        return Task(config=self.tasks_config["summarize_properties_task"])

    # @task
    # def walkscore_task(self) -> Task:
    #     return Task(config=self.tasks_config["walkscore_task"])

    @crew
    def crew(self) -> Crew:
        """Creates the research crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
            chat_llm=MODEL,
        )


def kickoff_crew(inputs, stream_callback=None):
    """
    Start the CrewAI execution with optional streaming updates

    Args:
        inputs: The inputs for the crew
        stream_callback: Optional callback function that receives crew state updates
            This callback should be connected to the frontend through a WebSocket or SSE
            to enable real-time updates on the CrewAI execution

    Returns:
        A dictionary containing the execution result and logs
    """
    crew_instance = ResearchCrew()
    handler = StreamingCrewHandler(stream_callback) if stream_callback else None

    # Capture standard output for logging
    f = io.StringIO()
    with redirect_stdout(f):
        # Initialize crew
        crew = crew_instance.crew()

        # TODO: When CrewAI supports callbacks, connect the handler here
        # For now, we need to modify CrewAI source to support streaming properly
        # crew.add_callback_handler(handler)

        # Start the crew execution
        result = crew.kickoff(inputs=inputs)

    logs = f.getvalue()

    # If we have a stream callback, send the final result
    if stream_callback:
        try:
            stream_callback(
                {
                    "status": "completed",
                    "result": result,
                }
            )
        except Exception as e:
            print(f"Error sending final result: {e}")

    return {"result": result, "logs": logs}


# Integration notes for frontend:
# 1. The backend should expose an API endpoint that accepts SSE connections
# 2. When a real estate query is received, kickoff_crew should be called with a
#    stream_callback that sends updates to the connected client
# 3. The frontend should use EventSource to connect to the SSE endpoint
# 4. Updates from the stream should be passed to CopilotKit's state management
