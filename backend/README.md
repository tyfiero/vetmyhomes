# VetMy Homes

VetMy Homes is an AI-powered multi-agent system that generates unbiased home reports using public data. It already leverages CrewAI for orchestrating a “team” of specialized agents (Crime Stats, School Ratings, Geology/Hazards, Walkability/Amenities) and a CopilotKit front-end for a chatbot-style UI. 

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






