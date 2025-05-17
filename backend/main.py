import uvicorn
from fastapi import BackgroundTasks, FastAPI

app = FastAPI(title="VetMyHomes API")


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
async def extract_property(url: str, background_tasks: BackgroundTasks):
    """
    Extract property information using firecrawl
    """
    # This would be implemented with actual firecrawl calls
    return {"status": "Property extraction initiated", "url": url}


@app.post("/analyze-property")
async def analyze_property(property_data: dict, background_tasks: BackgroundTasks):
    """
    Analyze property with CrewAI agents
    """
    # This would be implemented with actual CrewAI setup
    return {"status": "Analysis initiated", "property": property_data}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
