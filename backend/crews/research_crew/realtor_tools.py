from enum import Enum
from typing import Any, Dict, Optional, Type

import httpx
from config import settings
from pydantic import BaseModel, Field
from .tool_utils import AsyncBaseTool

# Base URL for RapidAPI Realtor API
BASE_URL = "https://realtor16.p.rapidapi.com"

# Helper function to make authenticated requests to RapidAPI
async def call_rapid_api(endpoint: str, params: Dict[str, Any] = None):
    """Make an authenticated request to RapidAPI."""
    url = f"{BASE_URL}{endpoint}"
    headers = {
        "X-RapidAPI-Key": settings.RAPIDAPI_KEY,
        "X-RapidAPI-Host": settings.RAPIDAPI_HOST,
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, params=params)

        if response.status_code != 200:
            raise Exception(f"RapidAPI error: {response.text}")

        return response.json()


# Enum for sorting options
class SortOption(str, Enum):
    RELEVANT = "relevant"
    NEWEST = "newest"
    PRICE_HIGH_TO_LOW = "price_high_to_low"
    PRICE_LOW_TO_HIGH = "price_low_to_high"
    SQFT_HIGH_TO_LOW = "sqft_high_to_low"
    SQFT_LOW_TO_HIGH = "sqft_low_to_high"


# Enum for listing types
class ListingType(str, Enum):
    ALL = "all"
    FORSALE = "forsale"
    FORRENT = "forrent"
    SOLD = "sold"


# Enum for property status
class PropertyStatus(str, Enum):
    FOR_SALE = "for_sale"
    FOR_RENT = "for_rent"
    SOLD = "sold"


# -------------------- For Sale Listings Tools --------------------


class SearchForSaleInput(BaseModel):
    """Input schema for searching properties for sale."""

    location: str = Field(..., description="Location for searching properties")
    page: int = Field(1, description="Page number for pagination")
    sort: SortOption = Field(
        SortOption.RELEVANT, description="Sorting option for the results"
    )
    limit: int = Field(
        50, ge=1, le=200, description="Limit the number of listings (max: 200)"
    )
    search_radius: int = Field(
        0, ge=0, le=50, description="Radius in kilometers (max: 50)"
    )


class SearchForSaleTool(AsyncBaseTool):
    name: str = "search_properties_for_sale"
    description: str = (
        "Search for properties that are for sale based on location. Sort options: relevant, newest, price_high_to_low, price_low_to_high, sqft_high_to_low, sqft_low_to_high"
    )
    args_schema: Type[BaseModel] = SearchForSaleInput

    async def run_async_code(
        self,
        location: str,
        page: int = 1,
        sort: SortOption = SortOption.RELEVANT,
        limit: int = 50,
        search_radius: int = 0,
    ) -> Dict[str, Any]:
        """Search for properties for sale based on location."""
        params = {
            "location": location,
            "page": page,
            "sort": sort,
            "limit": limit,
            "search_radius": search_radius,
        }

        return await call_rapid_api("/search/forsale", params)


class SearchForSaleCoordinatesInput(BaseModel):
    """Input schema for searching properties for sale by coordinates."""

    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    radius: int = Field(10, ge=1, le=50, description="Radius in kilometers (max: 50)")
    page: int = Field(1, description="Page number for pagination")
    sort: SortOption = Field(
        SortOption.RELEVANT, description="Sorting option for the results"
    )
    limit: int = Field(
        50, ge=1, le=200, description="Limit the number of listings (max: 200)"
    )
    polygon: Optional[str] = Field(None, description="Polygon coordinates for the area")


class SearchForSaleCoordinatesTool(AsyncBaseTool):
    name: str = "search_properties_for_sale_by_coordinates"
    description: str = "Search for properties for sale based on geographic coordinates"
    args_schema: Type[BaseModel] = SearchForSaleCoordinatesInput

    async def run_async_code(
        self,
        latitude: float,
        longitude: float,
        radius: int = 10,
        page: int = 1,
        sort: SortOption = SortOption.RELEVANT,
        limit: int = 50,
        polygon: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Search for properties for sale based on coordinates."""
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "radius": radius,
            "page": page,
            "sort": sort,
            "limit": limit,
        }

        if polygon:
            params["polygon"] = polygon

        return await call_rapid_api("/search/forsale/coordinates", params)


# -------------------- For Rent Listings Tools --------------------


class SearchForRentInput(BaseModel):
    """Input schema for searching rental properties."""

    location: str = Field(..., description="Location for searching rental properties")
    page: int = Field(1, description="Page number for pagination")
    sort: SortOption = Field(
        SortOption.RELEVANT, description="Sorting option for the results"
    )
    limit: int = Field(
        50, ge=1, le=200, description="Limit the number of listings (max: 200)"
    )
    search_radius: int = Field(
        0, ge=0, le=50, description="Radius in kilometers (max: 50)"
    )


class SearchForRentTool(AsyncBaseTool):
    name: str = "search_properties_for_rent"
    description: str = "Search for properties that are for rent based on location"
    args_schema: Type[BaseModel] = SearchForRentInput

    async def run_async_code(
        self,
        location: str,
        page: int = 1,
        sort: SortOption = SortOption.RELEVANT,
        limit: int = 50,
        search_radius: int = 0,
    ) -> Dict[str, Any]:
        """Search for properties for rent based on location."""
        params = {
            "location": location,
            "page": page,
            "sort": sort,
            "limit": limit,
            "search_radius": search_radius,
        }

        return await call_rapid_api("/search/forrent", params)


class SearchForRentCoordinatesInput(BaseModel):
    """Input schema for searching rental properties by coordinates."""

    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    radius: int = Field(10, ge=1, le=50, description="Radius in kilometers (max: 50)")
    page: int = Field(1, description="Page number for pagination")
    sort: SortOption = Field(
        SortOption.RELEVANT, description="Sorting option for the results"
    )
    limit: int = Field(
        50, ge=1, le=200, description="Limit the number of listings (max: 200)"
    )
    polygon: Optional[str] = Field(None, description="Polygon coordinates for the area")


class SearchForRentCoordinatesTool(AsyncBaseTool):
    name: str = "search_properties_for_rent_by_coordinates"
    description: str = "Search for rental properties based on geographic coordinates"
    args_schema: Type[BaseModel] = SearchForRentCoordinatesInput

    async def run_async_code(
        self,
        latitude: float,
        longitude: float,
        radius: int = 10,
        page: int = 1,
        sort: SortOption = SortOption.RELEVANT,
        limit: int = 50,
        polygon: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Search for rental properties based on coordinates."""
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "radius": radius,
            "page": page,
            "sort": sort,
            "limit": limit,
        }

        if polygon:
            params["polygon"] = polygon

        return await call_rapid_api("/search/forrent/coordinates", params)


# -------------------- For Sold Listings Tools --------------------


class SearchForSoldInput(BaseModel):
    """Input schema for searching sold properties."""

    location: str = Field(..., description="Location for searching sold properties")
    page: int = Field(1, description="Page number for pagination")
    sort: SortOption = Field(
        SortOption.RELEVANT, description="Sorting option for the results"
    )
    limit: int = Field(
        50, ge=1, le=200, description="Limit the number of listings (max: 200)"
    )
    search_radius: int = Field(
        0, ge=0, le=50, description="Radius in kilometers (max: 50)"
    )


class SearchForSoldTool(AsyncBaseTool):
    name: str = "search_properties_sold"
    description: str = "Search for properties that have been sold based on location"
    args_schema: Type[BaseModel] = SearchForSoldInput

    async def run_async_code(
        self,
        location: str,
        page: int = 1,
        sort: SortOption = SortOption.RELEVANT,
        limit: int = 50,
        search_radius: int = 0,
    ) -> Dict[str, Any]:
        """Search for sold properties based on location."""
        params = {
            "location": location,
            "page": page,
            "sort": sort,
            "limit": limit,
            "search_radius": search_radius,
        }

        return await call_rapid_api("/search/forsold", params)


# -------------------- Suggestions Tool --------------------


class GetSuggestionsInput(BaseModel):
    """Input schema for location suggestions."""

    location: str = Field(..., description="Location for suggestions")


class GetSuggestionsTool(AsyncBaseTool):
    name: str = "get_location_suggestions"
    description: str = "Get location suggestions based on a partial location string"
    args_schema: Type[BaseModel] = GetSuggestionsInput

    async def run_async_code(self, location: str) -> Dict[str, Any]:
        """Get location suggestions based on a partial location string."""
        params = {"location": location}
        return await call_rapid_api("/suggestion", params)


# -------------------- Agent Tools --------------------


class SearchAgentsInput(BaseModel):
    """Input schema for searching real estate agents."""

    location: str = Field(..., description="Location for searching agents")
    name: Optional[str] = Field(None, description="Agent name to search for")
    limit: int = Field(50, description="Limit the number of results")
    page: int = Field(1, description="Page number for pagination")


class SearchAgentsTool(AsyncBaseTool):
    name: str = "search_real_estate_agents"
    description: str = (
        "Search for real estate agents by location and optionally by name"
    )
    args_schema: Type[BaseModel] = SearchAgentsInput

    async def run_async_code(
        self, location: str, name: Optional[str] = None, limit: int = 50, page: int = 1
    ) -> Dict[str, Any]:
        """Search for real estate agents by location and name."""
        params = {
            "location": location,
            "limit": limit,
            "page": page,
        }
        if name:
            params["name"] = name

        return await call_rapid_api("/agents", params)


class GetAgentProfileInput(BaseModel):
    """Input schema for getting agent profile details."""

    advertiser_id: str = Field(..., description="ID of the agent")


class GetAgentProfileTool(AsyncBaseTool):
    name: str = "get_agent_profile"
    description: str = (
        "Get detailed profile information for a specific real estate agent"
    )
    args_schema: Type[BaseModel] = GetAgentProfileInput

    async def run_async_code(self, advertiser_id: str) -> Dict[str, Any]:
        """Get detailed profile information for a specific agent."""
        params = {"advertiser_id": advertiser_id}
        return await call_rapid_api("/agents/profile", params)


class GetAgentReviewsInput(BaseModel):
    """Input schema for getting agent reviews."""

    advertiser_id: str = Field(..., description="ID of the agent")


class GetAgentReviewsTool(AsyncBaseTool):
    name: str = "get_agent_reviews"
    description: str = "Get customer reviews for a specific real estate agent"
    args_schema: Type[BaseModel] = GetAgentReviewsInput

    async def run_async_code(self, advertiser_id: str) -> Dict[str, Any]:
        """Get reviews for a specific agent."""
        params = {"advertiser_id": advertiser_id}
        return await call_rapid_api("/agents/reviews", params)


class GetAgentListingsInput(BaseModel):
    """Input schema for getting agent listings."""

    advertiser_id: str = Field(..., description="ID of the agent")
    page: int = Field(1, description="Page number for pagination")
    type: ListingType = Field(ListingType.ALL, description="Type of listing")


class GetAgentListingsTool(AsyncBaseTool):
    name: str = "get_agent_listings"
    description: str = "Get property listings managed by a specific real estate agent"
    args_schema: Type[BaseModel] = GetAgentListingsInput

    async def run_async_code(
        self, advertiser_id: str, page: int = 1, type: ListingType = ListingType.ALL
    ) -> Dict[str, Any]:
        """Get listings for a specific agent."""
        params = {
            "advertiser_id": advertiser_id,
            "page": page,
            "type": type,
        }
        return await call_rapid_api("/agents/listings", params)


# -------------------- Property Tools --------------------


class GetPropertyDetailsInput(BaseModel):
    """Input schema for getting property details."""

    property_id: Optional[str] = Field(None, description="ID of the property")
    url: Optional[str] = Field(None, description="URL of the property")


class GetPropertyDetailsTool(AsyncBaseTool):
    name: str = "get_property_details"
    description: str = "Get detailed information for a specific property by ID or URL"
    args_schema: Type[BaseModel] = GetPropertyDetailsInput

    async def run_async_code(
        self, property_id: Optional[str] = None, url: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get detailed information for a specific property."""
        if not property_id and not url:
            raise ValueError("Either property_id or url must be provided")

        params = {}
        if property_id:
            params["property_id"] = property_id
        if url:
            params["url"] = url

        return await call_rapid_api("/properties/detail", params)


class GetPropertyPhotosInput(BaseModel):
    """Input schema for getting property photos."""

    property_id: Optional[str] = Field(None, description="ID of the property")
    url: Optional[str] = Field(None, description="URL of the property")


class GetPropertyPhotosTool(AsyncBaseTool):
    name: str = "get_property_photos"
    description: str = "Get photos for a specific property by ID or URL"
    args_schema: Type[BaseModel] = GetPropertyPhotosInput

    async def run_async_code(
        self, property_id: Optional[str] = None, url: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get photos for a specific property."""
        if not property_id and not url:
            raise ValueError("Either property_id or url must be provided")

        params = {}
        if property_id:
            params["property_id"] = property_id
        if url:
            params["url"] = url

        return await call_rapid_api("/properties/photos", params)


class GetPropertyEnvironmentRiskInput(BaseModel):
    """Input schema for getting property environmental risk information."""

    property_id: Optional[str] = Field(None, description="ID of the property")
    url: Optional[str] = Field(None, description="URL of the property")


class GetPropertyEnvironmentRiskTool(AsyncBaseTool):
    name: str = "get_property_environment_risk"
    description: str = (
        "Get environmental risk information for a specific property by ID or URL"
    )
    args_schema: Type[BaseModel] = GetPropertyEnvironmentRiskInput

    async def run_async_code(
        self, property_id: Optional[str] = None, url: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get environmental risk information for a specific property."""
        if not property_id and not url:
            raise ValueError("Either property_id or url must be provided")

        params = {}
        if property_id:
            params["property_id"] = property_id
        if url:
            params["url"] = url

        return await call_rapid_api("/properties/environment-risk", params)


class GetSimilarHomesInput(BaseModel):
    """Input schema for getting similar homes."""

    property_id: Optional[str] = Field(None, description="ID of the property")
    url: Optional[str] = Field(None, description="URL of the property")
    status: PropertyStatus = Field(
        PropertyStatus.FOR_SALE, description="Status of similar homes to retrieve"
    )


class GetSimilarHomesTool(AsyncBaseTool):
    name: str = "get_similar_homes"
    description: str = "Get similar homes for a specific property by ID or URL"
    args_schema: Type[BaseModel] = GetSimilarHomesInput

    async def run_async_code(
        self,
        property_id: Optional[str] = None,
        url: Optional[str] = None,
        status: PropertyStatus = PropertyStatus.FOR_SALE,
    ) -> Dict[str, Any]:
        """Get similar homes for a specific property."""
        if not property_id and not url:
            raise ValueError("Either property_id or url must be provided")

        params = {"status": status}
        if property_id:
            params["property_id"] = property_id
        if url:
            params["url"] = url

        return await call_rapid_api("/properties/similar-homes", params)


# -------------------- Housing Market Details Tool --------------------


class GetHousingMarketDetailsInput(BaseModel):
    """Input schema for getting housing market details."""

    slug_id: Optional[str] = Field(
        None, description="Slug ID for retrieving housing market details"
    )
    location: Optional[str] = Field(
        None, description="Location for retrieving housing market details"
    )


class GetHousingMarketDetailsTool(AsyncBaseTool):
    name: str = "get_housing_market_details"
    description: str = (
        "Get housing market details for a location by slug ID or location name"
    )
    args_schema: Type[BaseModel] = GetHousingMarketDetailsInput

    async def run_async_code(
        self, slug_id: Optional[str] = None, location: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get housing market details for a location."""
        if not slug_id and not location:
            raise ValueError("Either slug_id or location must be provided")

        params = {}
        if slug_id:
            params["slug_id"] = slug_id
        if location:
            params["location"] = location

        return await call_rapid_api("/market/details", params)


# List of all available tools
REALTOR_TOOLS = [
    SearchForSaleTool(),
    SearchForSaleCoordinatesTool(),
    SearchForRentTool(),
    SearchForRentCoordinatesTool(),
    SearchForSoldTool(),
    GetSuggestionsTool(),
    SearchAgentsTool(),
    GetAgentProfileTool(),
    GetAgentReviewsTool(),
    GetAgentListingsTool(),
    GetPropertyDetailsTool(),
    GetPropertyPhotosTool(),
    GetPropertyEnvironmentRiskTool(),
    GetSimilarHomesTool(),
    GetHousingMarketDetailsTool(),
]
