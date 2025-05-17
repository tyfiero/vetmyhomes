# NRI Risk Lookup App

## Overview

This Python-based application allows users to input a U.S. address and receive a structured, human-readable risk report based on FEMA's National Risk Index (NRI) data. The app uses a FastAPI backend and integrates CrewAI agents and flows to manage geolocation, data lookup, and narrative generation.

## Key Features

- Address geocoding to latitude/longitude
- Census Tract identification
- Local CSV lookup from preloaded NRI data (tract-level, Washington)
- Risk report generation with subjective summaries per risk category
- CrewAI agents orchestrate flows (geocode -> lookup -> summarize)
- FastAPI endpoint to accept address input and return structured report

---

## Components

### 1. Geocoding Agent

**Purpose:** Convert input address to latitude and longitude using a geocoding API (e.g., OpenCage, Google Maps).

**Inputs:** Address string
**Outputs:** Latitude, Longitude

### 2. Tract Identification Agent

**Purpose:** Convert lat/lng to Census Tract FIPS using U.S. Census Geocoder API or shapefile method.

**Inputs:** Latitude, Longitude
**Outputs:** Tract FIPS Code

### 3. Risk Data Lookup Agent

**Purpose:** Query local CSV (`NRI_Table_CensusTracts_Washington.csv`) using Tract FIPS.

**Inputs:** Tract FIPS
**Outputs:** Row data with full risk metrics

### 4. Subjective Summary Agent

**Purpose:** Use LLM to generate user-friendly explanations for key risk scores.

**Inputs:** Raw NRI data row (JSON or dict)
**Outputs:** Summarized text per risk category (e.g., Earthquake Risk: "Moderate risk due to proximity to active fault lines in urban area")

### 5. FastAPI Server

**Purpose:** Provide a RESTful interface for submitting addresses and returning structured risk assessments.

**Endpoint:**

```http
POST /analyze
{
  "address": "1605 Boylston Ave, Seattle, WA"
}
```

**Response:**

```json
{
  "address": "1605 Boylston Ave, Seattle, WA",
  "tract_fips": "53033004400",
  "location": {
    "lat": 47.615785,
    "lng": -122.323664
  },
  "scores": {
    "earthquake_risk": "MODERATE",
    "flood_risk": "LOW",
    "wildfire_risk": "RELATIVELY_LOW"
  },
  "summary": {
    "earthquake": "This area has a moderate earthquake risk due to nearby seismic activity zones, though building resilience helps mitigate impact.",
    "flood": "Flooding is unlikely in this tract given its elevation and distance from major waterways.",
    "wildfire": "Urban setting and low vegetation density reduce the wildfire hazard in this neighborhood."
  }
}
```

### Score Enum

Use an enum to normalize risk score labels in the API:

```python
from enum import Enum

class RiskLevel(str, Enum):
    VERY_LOW = "VERY_LOW"
    RELATIVELY_LOW = "RELATIVELY_LOW"
    MODERATE = "MODERATE"
    RELATIVELY_MODERATE = "RELATIVELY_MODERATE"
    HIGH = "HIGH"
    VERY_HIGH = "VERY_HIGH"
```

---

## Setup

### Requirements

- Python 3.10+
- FastAPI
- pandas
- CrewAI
- requests or httpx

### Optional (for spatial logic)

- `geopandas`
- `turfpy` or shapely for bounding box filtering
