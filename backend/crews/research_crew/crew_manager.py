from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List, Optional
from pydantic import BaseModel, Field
from crews.research_crew.realtor_tools import REALTOR_TOOLS
from crews.research_crew.geo_tools import GEO_TOOLS
from crews.research_crew.types import PropertyList
from crews.research_crew.types import EnvironmentalRisks
from crews.research_crew.map_tools import MAP_TOOLS

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
            # verbose=True,
            tools=REALTOR_TOOLS,
            # llm=llm,
            chat_llm=MODEL,
        )

    @agent
    def geodeeper_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["geodeeper_agent"],  # type: ignore[index]
            verbose=True,
            tools=GEO_TOOLS + MAP_TOOLS,
            multimodal=True,
        )

    @agent
    def output_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["output_agent"],  # type: ignore[index]
            # verbose=True,
        )

    @agent
    def summarizer(self) -> Agent:
        return Agent(config=self.agents_config["summarizer"])

    @task
    def property_search_task(self) -> Task:
        return Task(config=self.tasks_config["property_search_task"])  # type: ignore[index]

    @task
    def geo_analysis(self) -> Task:
        return Task(config=self.tasks_config["geo_analysis"], output_json=EnvironmentalRisks)  # type: ignore[index]

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
            # llm=llm,
            chat_llm=MODEL,
        )


def kickoff_crew(inputs):
    crew = ResearchCrew()
    return crew.crew().kickoff(inputs=inputs)
