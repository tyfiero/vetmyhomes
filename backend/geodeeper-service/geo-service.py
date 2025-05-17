# A simple set of async functions to get the geo data for a given address, refactored for CrewAI tool usage
from typing import Dict, Any
import requests
import pandas as pd
import httpx
import numpy as np
from utils import parse_us_address

ADDRESS = "1605 Boylston Ave, Seattle, WA 98122"
GEO_API_URL = "https://geocoding.geo.census.gov/geocoder/geographies/address"

# TODO: Have the CSV get loaded on app run into memory to be referenced in the main.py
# Load CSV data for service use - temporary
tract_data = pd.read_csv("NRI_Table_CensusTracts_Washington.csv")

# Consolidated function to get tract FIPS from address
async def get_tract_fips_from_address(address: str) -> dict:
    """
    Async tool to get the Census Tract FIPS (GEOID) for a given address.
    Args:
        address (str): The address to geocode.
    Returns:
        dict: {"tract_fips": str} or {"error": str}
    """
    street, city, state = parse_us_address(address)
    params = {
        "street": street,
        "city": city,
        "state": state,
        "benchmark": "Public_AR_Current",
        "vintage": "Current_Current",
        "layers": "10",
        "format": "json"
    }
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(GEO_API_URL, params=params)
            response.raise_for_status()
            data = response.json()
        match = data["result"]["addressMatches"][0]
        tract_fips = match["geographies"]["Census Block Groups"][0]["TRACT"]
        return {"tract_fips": tract_fips}
    except (IndexError, KeyError):
        return {"error": "Could not extract tract FIPS from address, merp merp"}
    except Exception as e:
        return {"error": str(e)}


# Get a long/lat for a given address using Census Geocoder
async def get_long_lat_from_address(address: str) -> Dict[str, Any]:
    """
    Async tool to get longitude and latitude for a given address using the US Census Geocoding API.
    Args:
        address (str): The address to geocode.
    Returns:
        dict: {"longitude": float, "latitude": float, "tract_fips": str} or {"error": str}
    """
    url = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress"
    params = {
        "address": address,
        "benchmark": "2020",
        "format": "json"
    }
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
        print("Census API response:", data)  # Debug print
        match = data["result"]["addressMatches"][0]
        coords = match["coordinates"]
        lat, lng = coords["y"], coords["x"]
        tract_fips = None
        if "geographies" in match and "Census Tracts" in match["geographies"]:
            tract_fips = match["geographies"]["Census Tracts"][0].get("GEOID")
        result = {"longitude": lng, "latitude": lat}
        if tract_fips:
            result["tract_fips"] = tract_fips
        return result
    except (IndexError, KeyError):
        return {"error": f"Could not resolve address: {address}"}
    except Exception as e:
        return {"error": str(e)}
    


# Get an overview of risks for a given tract from the local data
async def get_tract_risks(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Async tool to get an overview of risks for a given tract.
    Args:
        params (dict): {"tract": str}  # tract FIPS code
    Returns:
        dict: {"risks": dict} or {"error": str}
    """
    tract = params.get("tract", "")
    try:
        row = tract_data[tract_data["TRACTFIPS"].astype(str) == str(tract)]
        if row.empty:
            return {"error": f"Tract {tract} not found in NRI data"}
        # You can return all columns, or just a subset related to risk
        # Example: return all columns as a dict
        risks = row.iloc[0].to_dict()
        return {"risks": risks}
    except Exception as e:
        return {"error": str(e)}

# Get a detailed risk profile for a given tract from the local data
# TODO: Implement this
async def get_tract_risk_details(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Async tool to get a detailed risk profile for a given tract.
    Args:
        params (dict): {"tract": str}
    Returns:
        dict: {"risk_details": dict}
    """
    tract = params.get("tract", "")
    # TODO: Use the local data to get the risks
    return {"risk_details": {}}



# Remove after moving into a tool
import asyncio

if __name__ == "__main__":

    tract_fips = asyncio.run(get_tract_fips_from_address(ADDRESS))
    risks = asyncio.run(get_tract_risks({"tract": tract_fips["tract_fips"]}))
    print(risks)

    # print(tract_data.columns)