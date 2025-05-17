# VetMy Homes

VetMy Homes is an AI-powered multi-agent system that generates unbiased home reports using public data. It already leverages CrewAI for orchestrating a "team" of specialized agents (Crime Stats, School Ratings, Geology/Hazards, Walkability/Amenities) and a CopilotKit front-end for a chatbot-style UI. 

## Setup

### Prerequisites
- Python 3.10+ installed
- uv package manager installed (`pip install uv`)

### Environment Setup
1. Create a virtual environment:
```bash
cd backend
uv venv .venv
```

2. Activate the virtual environment:
```bash
source .venv/bin/activate  # On Unix/macOS
# OR
.venv\Scripts\activate  # On Windows
```

3. Install dependencies:
```bash
uv pip install -r requirements.txt
```

4. Environment Variables:
Copy `.env.example` to `.env` and update with your API keys:
```bash
cp .env.example .env
```

### Running the API
Start the API server:
```bash
python main.py
```

The API will be available at http://localhost:8000

API documentation is available at:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

## Features

### Backend

- [ ] CrewAI agents for Crime Stats, School Ratings, Geology/Hazards, Walkability/Amenities

#### Nice to haves:

- [ ] Use Neon DB for storage, and maybe use with pgvector for vector search.
- [ ] Little fine tuned model with OpenPipe for something?



### CREW AI

Im thinking of doing a crewAI workflow, as a toolcall for the primary user facing agent. It takes an address and a user profile as parameters, then:
- We use firecrawl /extract or the zillow API to get all of the information about the property that we can.
- We pass this data to other agents, responsible for:
  - Crime stats
  - School ratings
  - Geology/hazards
  - Walkability/amenities
  - ???
- Each agent is specially designed for the task it is responsible for, it has access to specific tools for API calls. It's whole job is to make a Report from the data it finds\
- At the end of the crewAI workflow, we have a collection of reports from each agent, which we can pass to a report generator Agent that can make a final report.
- This data is then returned back from the toolcall, and we can pass it to the report generator agent.


Notes:
- I wonder if we could get good results from Groq using Deepseek R1, that would make this almost instantaneous.
- Should we store the data in our Neon DB?
- A general deep research agent could be useful, just give it a great system prompt and off it goes to find niche info on the address or neighborhood from the internet. Perplexity has a deep research API, I think xAI Grok might too




### TOOLS

#### Schools
https://www.greatschools.org/gk/about/api-developer-resources/#:~:text=GreatSchools%20www,school%20data%20from%20our%20database
https://catalog.data.gov/dataset/schools-report-card-data-ospi#:~:text=Schools%20Report%20Card%20Data%20,behind%20the%20state%20schools%20dashboard

#### Walk score
https://www.walkscore.com/professional/api.php

#### Crime
https://catalog.data.gov/dataset/uniform-crime-reporting-ucr-program/resource/e6cbb728-b87a-47e9-80c2-9db5265beef5#:~:text=URL%3A%20https%3A%2F%2Fcde.ucr.cjis.gov%2FLATEST%2Fwebapp%2F
https://www.seattle.gov/police/information-and-data/data/public-data-sets#:~:text=911%20Incident%20Response%C2%A0,911%20calls%202001%20to%20present
https://www.crimeometer.com/pricing

#### Geology







# VetMyHomes Backend

## Realtor.com API Integration

This project includes a comprehensive integration with the Realtor.com API via RapidAPI, providing access to property listings, agent details, and more.

### Setup Instructions

1. **Clone the repository**

2. **Set up a virtual environment**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   - Copy the `.env.example` file to `.env`
   - Get your RapidAPI key from [RapidAPI Realtor16](https://rapidapi.com/s.mahmoud97/api/realtor16)
   - Add your RapidAPI key to the `.env` file

5. **Run the application**
   ```bash
   python main.py
   ```

6. **Access the API documentation**
   - Open your browser and go to `http://localhost:8000/docs`

### Available Endpoints

The Realtor API integration provides the following endpoints:

#### For Sale Listings
- `GET /realtor/search/forsale` - Search for properties for sale by location
- `GET /realtor/search/forsale/coordinates` - Search for properties for sale by coordinates

#### For Rent Listings
- `GET /realtor/search/forrent` - Search for rental properties by location

#### For Sold Listings
- `GET /realtor/search/forsold` - Search for sold properties by location

#### Suggestions
- `GET /realtor/suggestion` - Get location suggestions for autocomplete

#### Agent Endpoints
- `GET /realtor/agent/search` - Search for real estate agents
- `GET /realtor/agent/profile` - Get agent profile details
- `GET /realtor/agent/reviews` - Get agent reviews
- `GET /realtor/agent/listings` - Get agent listings

#### Property Endpoints
- `GET /realtor/property/details` - Get property details
- `GET /realtor/property/photos` - Get property photos
- `GET /realtor/property/environment_risk` - Get property environmental risk data
- `GET /realtor/property/similar_homes` - Get similar homes

#### Housing Market
- `GET /realtor/housing_market_details` - Get housing market details

### Example Usage

#### Search for properties in New York
```python
import requests

response = requests.get(
    "http://localhost:8000/realtor/search/forsale",
    params={
        "location": "New York, NY",
        "limit": 10,
        "page": 1
    }
)

properties = response.json()
```

For detailed documentation on all endpoints and parameters, refer to the OpenAPI documentation at `http://localhost:8000/docs`.






