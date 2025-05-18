from typing import Any, Dict, Optional

import uvicorn
from copilotkit import CopilotKitRemoteEndpoint
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Keep the other imports for AgenticChatFlow if we want to use it later
from copilotkit.crewai import CrewAIAgent

# Import CopilotKit FastAPI integration
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from crews.research_crew.crew_manager import ResearchCrew, kickoff_crew
from fastapi import BackgroundTasks, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from realtor_router import router as realtor_router
from crewai import Agent,LLM,Task,Crew
import json
import os


crew_has_run = False
CHAT_CONTEXT_PATH = "output/chat_context.txt"

app = FastAPI(
    title="VetMyHomes API",
    description="API for VetMyHomes, providing real estate data using Realtor.com API",
    version="0.1.0",
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_property_conversation_agent():
    return Agent(
        role="Real Estate Chat Agent",
        goal="Answer follow-up questions about property listings, lifestyle preferences, and search results.",
        backstory="""
            You are a smart, friendly assistant helping the user decide on a home. 
            You already know their preferences, the listings shown, and lifestyle data.
            Your job is to respond to follow-up questions like:
            - Which home is closest to a gym?
            - Which one has the best walkability?
            - Are any of these good for remote work?
            You provide clear, conversational answers grounded in the data provided.
        """,
        llm=LLM(model="openai/gpt-4.1")
    )

# Include routers
app.include_router(realtor_router)

def dynamic_agent(user_input: str):
    if not os.path.exists(CHAT_CONTEXT_PATH) or os.stat(CHAT_CONTEXT_PATH).st_size == 0:
        # First interaction: run full crew
        full_response = kickoff_crew({"query": user_input})

        with open(CHAT_CONTEXT_PATH, "w") as f:
            f.write(f"User Query: {user_input}\n\n")
            f.write(f"{full_response}")

        return full_response
    else:
        with open(CHAT_CONTEXT_PATH, "r") as f:
            context = f.read()

        prompt = f"""
{context}

User follow-up: {user_input}
"""

        chat_agent = get_property_conversation_agent()

        followup_task = Task(
            description="Answer user's follow-up question using the data provided below.\n" + prompt,
            expected_output="A helpful, clear response to the user's question based on listings and lifestyle data.",
            agent=chat_agent
        )

        chat_crew = Crew(
            agents=[chat_agent],
            tasks=[followup_task],
            verbose=True
        )

        return chat_crew.kickoff()




class SimpleAgentWrapper:
    def run(self, input: str):
        return dynamic_agent(input)


sdk = CopilotKitRemoteEndpoint(
    agents=[
        CrewAIAgent(
            name="real_estate_agent",
            description="Real estate assistant",
            crew=SimpleAgentWrapper(),
        )
    ]
)

add_fastapi_endpoint(app, sdk, "/copilotkit")


class PropertyUrlRequest(BaseModel):
    url: HttpUrl
    options: Optional[Dict[str, Any]] = None


class PropertyDataRequest(BaseModel):
    address: str
    price: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    square_feet: Optional[int] = None
    year_built: Optional[int] = None
    lot_size: Optional[float] = None
    property_type: Optional[str] = None
    additional_data: Optional[Dict[str, Any]] = None


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "VetMyHomes API is running"}


@app.get("/test-deps")
async def test_dependencies():
    return {
        "fastapi": "installed",
        "uvicorn": "installed",
        "firecrawl": "installed",
        "crewai": "installed",
        "langchain_openai": "installed",
    }


@app.post("/crew")
async def crew():
    return kickoff_crew(
        {
            "query": "Recommend houses near gyms and restaraunts in Capitol hill"
        }
    )
    # return kickoff_crew(
    #     {
    #     "address": "1119 8th Avenue Seattle WA 98101",
    #     "latitude": 47.6085,
    #     "longitude": -122.3295,
    # }
    # )


@app.post("/extract-property")
async def extract_property(
    request: PropertyUrlRequest, background_tasks: BackgroundTasks
):
    """
    Extract property information using firecrawl

    Takes a URL to a property listing and extracts structured data from it
    """
    # This would be implemented with actual firecrawl calls
    return {
        "status": "Property extraction initiated",
        "url": request.url,
        "options": request.options,
    }


@app.post("/analyze-property")
async def analyze_property(
    request: PropertyDataRequest, background_tasks: BackgroundTasks
):
    """
    Analyze property with CrewAI agents

    Takes property data and performs comprehensive analysis using specialized agents
    """
    # This would be implemented with actual CrewAI setup
    return {"status": "Analysis initiated", "property": request.model_dump()}

@app.post("/test-chat")
def test_chat(input: Dict[str, str]):
    return {"reply": dynamic_agent(input["message"])}

@app.post("/reset-context")
def reset_context():
    if os.path.exists(CHAT_CONTEXT_PATH):
        with open(CHAT_CONTEXT_PATH, "w") as f:
            f.truncate(0)
    return {"status": "reset"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)