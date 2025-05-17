# VetMy Homes

VetMy Homes is an AI-powered multi-agent system that generates unbiased home reports using public data. Think of it as 'the Carfax for your future home'. It already leverages CrewAI for orchestrating a “team” of specialized agents (Crime Stats, School Ratings, Geology/Hazards, Walkability/Amenities) and a CopilotKit front-end for a chatbot-style UI. 



## Setup

```bash
npm install
npm run dev
```


## Features

- [ ] CopilotKit front-end for a chatbot-style UI
- [ ] Simple landing page built with Lovable/Bolt

#### Nice to haves:

- [ ] Super simple onboarding screen. A textarea or two so a user can specify what they are looking for in a home, and whats most important. This profile data is used as context for ALL of the agents.
- [ ] A simple way to specify a budget range.
- [ ] Super simple voice input using groq whisper endpoint. could be a nice touch.
- [ ] Download report as PDF? html to PDF would work fine client side. 
- [ ] Showing the agent's thought process as it runs could be a fun way to show the user what is happening.