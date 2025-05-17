from typing import Any, Dict, Optional

import uvicorn
from fastapi import BackgroundTasks, FastAPI
from pydantic import BaseModel, HttpUrl

app = FastAPI(title="VetMyHomes API")


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
    return {"message": "VetMyHomes API is running"}


@app.get("/test-deps")
async def test_dependencies():
    return {
        "fastapi": "installed",
        "uvicorn": "installed",
        "firecrawl": "installed",
        "crewai": "installed",
        "langchain_openai": "installed",
    }


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
