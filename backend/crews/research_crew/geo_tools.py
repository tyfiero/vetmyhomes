from typing import Any, Dict, List, Optional, Type
from pydantic import BaseModel, Field
from .tool_utils import AsyncBaseTool
from geodeeper_service.geo_service import (
    get_tract_fips_from_address,
    get_long_lat_from_address,
    get_tract_field_names,
    get_geo_data,
)

# -------------------- Tool: Get Tract FIPS from Address --------------------
class GetTractFipsFromAddressInput(BaseModel):
    address: str = Field(..., description="The address to geocode.")

class GetTractFipsFromAddressTool(AsyncBaseTool):
    name: str = "get_tract_fips_from_address"
    description: str = "Get the Census Tract FIPS (GEOID) for a given address. Returns a dict with 'tract_fips' or 'error'."
    args_schema: Type[BaseModel] = GetTractFipsFromAddressInput

    async def run_async_code(self, address: str) -> Dict[str, Any]:
        return await get_tract_fips_from_address(address)

# -------------------- Tool: Get Long/Lat from Address --------------------
class GetLongLatFromAddressInput(BaseModel):
    address: str = Field(..., description="The address to geocode.")

class GetLongLatFromAddressTool(AsyncBaseTool):
    name: str = "get_long_lat_from_address"
    description: str = "Get longitude and latitude for a given address using the US Census Geocoding API. Returns dict with longitude, latitude, and optionally tract_fips."
    args_schema: Type[BaseModel] = GetLongLatFromAddressInput

    async def run_async_code(self, address: str) -> Dict[str, Any]:
        return await get_long_lat_from_address(address)

# -------------------- Tool: Get Tract Field Names --------------------
class GetTractFieldNamesTool(AsyncBaseTool):
    name: str = "get_tract_field_names"
    description: str = "Get the field names and aliases from the NRI data dictionary. Returns a list of dicts with 'field_name' and 'field_alias'."
    args_schema: Type[BaseModel] = BaseModel  # No input required

    async def run_async_code(self) -> List[Dict[str, Any]]:
        return await get_tract_field_names()

# -------------------- Tool: Get Geo Data for Fields and Tract FIPS --------------------
class GetGeoDataInput(BaseModel):
    field_names: List[str] = Field(..., description="List of field names to get data for.")
    tract_fips: str = Field(..., description="The tract FIPS code to get data for.")

class GetGeoDataTool(AsyncBaseTool):
    name: str = "get_geo_data"
    description: str = "Get the data for a given list of field names and tract FIPS. Returns a dict of field names and their corresponding data."
    args_schema: Type[BaseModel] = GetGeoDataInput

    async def run_async_code(self, field_names: List[str], tract_fips: str) -> Dict[str, Any]:
        return await get_geo_data(field_names, tract_fips)

# List of all available geo tools
GEO_TOOLS = [
    GetTractFipsFromAddressTool(),
    GetLongLatFromAddressTool(),
    GetTractFieldNamesTool(),
    GetGeoDataTool(),
]
