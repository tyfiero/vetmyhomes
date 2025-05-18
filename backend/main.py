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
import os
from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi import APIRouter
from pydantic import BaseModel, HttpUrl
from realtor_router import router as realtor_router

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

# Create maps router
maps_router = APIRouter(prefix="/maps", tags=["maps"])


@maps_router.get("/{filename}")
async def get_map(filename: str):
    """Serve map images from the maps directory"""
    # Define the maps directory path
    maps_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "maps")

    # Create the maps directory if it doesn't exist
    os.makedirs(maps_dir, exist_ok=True)

    # Build the full path to the requested file
    file_path = os.path.join(maps_dir, filename)

    # Check if the file exists
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="Map not found")

    # Return the file as a response
    return FileResponse(file_path)


# Include routers
app.include_router(realtor_router)
app.include_router(maps_router)
sdk = CopilotKitRemoteEndpoint(
    agents=[
        CrewAIAgent(
            name="real_estate_agent",
            description="An example agent to use as a starting point for your own agent.",
            # flow=AgenticChatFlow(),
            crew=ResearchCrew(),
        )
    ],
)
add_fastapi_endpoint(app, sdk, "/copilotkit_remote")


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


@app.api_route(["GET", "POST"], "/info")
async def info():
    """Get API information"""
    return JSONResponse({
        "name": "VetMyHomes API",
        "version": "0.1.0",
        "description": "API for analyzing real estate properties and environmental risks",
        "endpoints": {
            "/": "Health check endpoint",
            "/info": "Get API information",
            "/test-deps": "Test dependencies status",
            "/crew": "Run property analysis crew",
            "/extract-property": "Extract property data from URL",
            "/analyze-property": "Analyze property data",
            "/maps/{filename}": "Get property map images"
        }
    })


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
            # "query": "Recommend houses in Capitol hill, Seattle, WA"
            "query": "3627 Stone Way N, Seattle, WA 98103"
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


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
