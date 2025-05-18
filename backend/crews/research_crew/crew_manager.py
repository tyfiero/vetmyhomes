from typing import List

from copilotkit.crewai import (
    copilotkit_emit_message,
    copilotkit_emit_tool_call,
    copilotkit_predict_state,
)
from crewai import LLM, Agent, Crew, Process, Task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai.project import CrewBase, agent, crew, task
from crews.research_crew.realtor_tools import REALTOR_TOOLS
from crews.research_crew.types import PropertyList

MODEL = "openai/gpt-4.1"
# MODEL = "groq/llama3-70b-8192"

llm = LLM(
    model=MODEL,
)


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
            # llm=llm,
            chat_llm=MODEL,
        )

    @agent
    def output_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["output_agent"],  # type: ignore[index]
            verbose=True,
        )

    @agent
    def summarizer(self) -> Agent:
        return Agent(config=self.agents_config["summarizer"])

    @task
    def property_search_task(self) -> Task:
        return Task(config=self.tasks_config["property_search_task"])  # type: ignore[index]

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
        crew = Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
            # llm=llm,
            chat_llm=MODEL,
        )

        # Emit initial state
        copilotkit_predict_state(
            {
                "status": {
                    "state": "initialized",
                    "message": "Research crew initialized and ready",
                }
            }
        )

        return crew


async def kickoff_crew(inputs):
    crew = ResearchCrew()

    # Initial state
    await copilotkit_predict_state(
        {
            "status": {
                "state": "initialized",
                "message": "Starting property search...",
                "progress": 0,
            }
        }
    )

    # Emit starting message
    await copilotkit_emit_message(
        "👋 Hi! I'm starting to search for properties matching your criteria..."
    )

    # Property search phase
    await copilotkit_predict_state(
        {
            "status": {
                "state": "searching",
                "message": "Searching for properties...",
                "progress": 25,
                "current_task": "property_search",
            }
        }
    )
    await copilotkit_emit_tool_call(
        name="property_search", args={"query": inputs.get("query", "")}
    )
    await copilotkit_emit_message("🔍 Searching available listings in your area...")

    # Analysis phase
    await copilotkit_predict_state(
        {
            "status": {
                "state": "analyzing",
                "message": "Analyzing property matches...",
                "progress": 50,
                "current_task": "analysis",
            }
        }
    )
    await copilotkit_emit_message(
        "📊 Analyzing property matches and gathering additional details..."
    )

    # Run the crew
    result = crew.crew().kickoff(inputs=inputs)

    # Format results phase
    await copilotkit_predict_state(
        {
            "status": {
                "state": "formatting",
                "message": "Preparing your results...",
                "progress": 75,
                "current_task": "formatting",
            }
        }
    )
    await copilotkit_emit_message(
        "📝 Preparing a detailed summary of the best matches..."
    )

    # Complete
    await copilotkit_predict_state(
        {
            "status": {
                "state": "complete",
                "message": "Search complete!",
                "progress": 100,
                "current_task": "complete",
            }
        }
    )
    await copilotkit_emit_message(
        "✨ All done! Here are the properties I found that match your criteria."
    )

    return result
