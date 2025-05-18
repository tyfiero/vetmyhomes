## Project Description

Please describe your project clearly and concisely to help the judges understand its functionality, innovation, real-world impact, and alignment with the hackathon theme. Address how your project meets the criteria: running code, innovation & creativity, real-world impact, and theme alignment.

Additionally, include details about the specific technologies, frameworks, libraries, or other tools you utilized in your project. This information will provide context for your solution and demonstrate its practical application in the realm of AI agents.

---

Vet My Homes is a real estate research agent to help you find hard to find information for properties/homes based on a natural user query. It can take in flexible requests like "Recommend houses in Capitol hill, Seattle, WA" or "Recommend houses near gyms and restaurants in Capitol hill". It can also take in a specific address and do a deep dive analysis of the property including environmental risks, walkability, and more.
Much of the system is agentic can make decisions by itself on what to search for and what to do deep analysis into with flexibility on which data it can choose to explore more.

The project uses CopilotKit and React on the frontend, while using CrewAI, FastAPI powered by OpenAI gpt4.1 or GROQ Gwen3 32B for the backend. 3rd party tools include the RapidAPI Realtor API, US Census Geocoding API, FEMA hazards datasets and risk scoring for Washington, USGS earthquake data, and WalkscoreAPI.

---

## Products & Tools Used Required

CrewAI, CopilotKit, OpenAI

## Team Contributions

Deepansh Gandhi
Deepansh built out several tools to support the CrewAIresearch crew such as walkability scoring,

Foad Green
Foad setup the initial FASTAPI implementation used by the rest of the team as well as worked with Ty to build out the frontend using the CopilotKit framework.

Rolf Skog
Rolf built out a significant amount of the initial CrewAI implementation and crew manager which set the implementation pattern for the rest of the team to use. He also built out the core property search and details tool capabilities as well as a map tool that overlays fault lines and the property location on a map image.

Sam Hessenauer
Sam built out the GEO analysis backend named 'geodeeper' and corresponding CrewAI agent. It takes in an address in Washington and does analysis for environmental risks. The CrewAI agent first does a quick risk score on risks such as earthquake, landslide, flood, wildfire, hurricane. If it sees a bad looking score, it will go figure out what additional deeper data is available for that specificrisk and retrieve and summarize it on demand. The agent decidese if/what to do given the risk scores and self-selects the relevant data to surface to the user and summarize in plain english. Turns out, his house is in a high risk area for earthquakes, merp.

Ty Fiero
Ty setup the Copilot kit frontend project, the main project site, and setup deployment hosting from Railway and ...

## Additional Links

## Social Media Posts
