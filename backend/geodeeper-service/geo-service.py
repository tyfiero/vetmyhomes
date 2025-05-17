# A simple set of async functions to get the geo data for a given address, refactored for CrewAI tool usage
from typing import Dict, Any, List
import requests
import pandas as pd

import httpx
import numpy as np
from utils import parse_us_address

ADDRESS = "1605 Boylston Ave, Seattle, WA 98122"
GEO_API_URL = "https://geocoding.geo.census.gov/geocoder/geographies/address"
LONG_LAT_API_URL = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress"

# TODO: Have the CSV get loaded on app run into memory to be referenced in the main.py
# Load CSV data for service use - temporary
tract_data = pd.read_csv("NRI_Table_CensusTracts_Washington.csv")
tract_data_columns = pd.read_csv("NRIDataDictionary.csv")

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
        # print('data', data)
        match = data["result"]["addressMatches"][0]
        geoid = match["geographies"]["Census Block Groups"][0]["GEOID"]
        tract_fips = geoid[:11]  # First 11 digits are the full tract FIPS
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
    
    params = {
        "address": address,
        "benchmark": "2020",
        "format": "json"
    }
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(LONG_LAT_API_URL, params=params)
            response.raise_for_status()
            data = response.json()
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

# Function to get the field names and aliases from the NRI data dictionary
async def get_tract_field_names() -> list[dict]:
    """
    Async tool to get the field names and aliases from the NRI data dictionary.
    Returns:
        list[dict]: List of {"field_name": ..., "field_alias": ...}
    """
    try:
        data_dict = pd.read_csv("NRIDataDictionary.csv")
        return [
            {"field_name": row["Field Name"], "field_alias": row["Field Alias"]}
            for _, row in data_dict.iterrows()
        ]
    except Exception as e:
        return []


# Function to take in an arbitrary field name(s) and return the data for that field with the corresponding tract fips
async def get_tract_data(field_names: list[str], tract_fips: str) -> dict:
    """
    Async tool to get the data for a given field name(s) and tract FIPS.
    Args:
        field_names (list[str]): List of field names to get data for.
        tract_fips (str): The tract FIPS code to get data for.
    Returns:
        dict: Dictionary of field names and their corresponding data.
    """
    try:
        # Ensure both are strings and match format
        tract_fips = str(tract_fips)
        tract_data['TRACTFIPS'] = tract_data['TRACTFIPS'].astype(str)
        filtered_data = tract_data[tract_data['TRACTFIPS'] == tract_fips]
        
        if filtered_data.empty:
            return {"error": f"Tract FIPS {tract_fips} not found in NRI data"}
        
        results = {}
        for field_name in field_names:
            if field_name in filtered_data.columns:
                results[field_name] = filtered_data[field_name].values[0]
            else:
                results[field_name] = None
        return results
    except Exception as e:
        return {"error": str(e)}


# Remove after moving into a tool
import asyncio

if __name__ == "__main__":

    tract_fips = asyncio.run(get_tract_fips_from_address(ADDRESS))['tract_fips']
    field_names = asyncio.run(get_tract_field_names())
    single_result = asyncio.run(get_tract_data(['TSUN_ALRP'], tract_fips))
    multiple_results = asyncio.run(get_tract_data(['TSUN_ALRP', 'TRND_HLRA'], tract_fips))
    print('single_result', single_result)
    print('multiple_results', multiple_results)
