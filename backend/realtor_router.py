from enum import Enum
from typing import Any, Dict, Optional

import httpx
from config import settings
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/realtor", tags=["realtor"])

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
            raise HTTPException(
                status_code=response.status_code,
                detail=f"RapidAPI error: {response.text}",
            )

        return response.json()


# Enum for sorting options
class SortOption(str, Enum):
    RELEVANT = "relevant"
    NEWEST = "newest"
    PRICE_HIGH_TO_LOW = "price_high_to_low"
    PRICE_LOW_TO_HIGH = "price_low_to_high"
    SQFT_HIGH_TO_LOW = "sqft_high_to_low"
    SQFT_LOW_TO_HIGH = "sqft_low_to_high"


# -------------------- For Sale Listings Endpoints --------------------


@router.get("/search/forsale")
async def search_forsale(
    location: str = Query(..., description="Location for searching properties"),
    page: int = Query(1, description="Page number for pagination"),
    sort: SortOption = Query(
        SortOption.RELEVANT, description="Sorting option for the results"
    ),
    limit: int = Query(
        50, ge=1, le=200, description="Limit the number of listings (max: 200)"
    ),
    search_radius: int = Query(
        0, ge=0, le=50, description="Radius in kilometers (max: 50)"
    ),
):
    """Search for properties for sale based on location"""
    params = {
        "location": location,
        "page": page,
        "sort": sort,
        "limit": limit,
        "search_radius": search_radius,
    }

    return await call_rapid_api("/search/forsale", params)


@router.get("/search/forsale/coordinates")
async def search_forsale_coordinates(
    latitude: float = Query(..., description="Latitude coordinate"),
    longitude: float = Query(..., description="Longitude coordinate"),
    radius: int = Query(10, ge=1, le=50, description="Radius in kilometers (max: 50)"),
    page: int = Query(1, description="Page number for pagination"),
    sort: SortOption = Query(
        SortOption.RELEVANT, description="Sorting option for the results"
    ),
    limit: int = Query(
        50, ge=1, le=200, description="Limit the number of listings (max: 200)"
    ),
    polygon: Optional[str] = Query(
        None, description="Polygon coordinates for the area"
    ),
):
    """Search for properties for sale based on coordinates"""
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


# -------------------- For Rent Listings Endpoints --------------------


@router.get("/search/forrent")
async def search_forrent(
    location: str = Query(..., description="Location for searching rental properties"),
    page: int = Query(1, description="Page number for pagination"),
    sort: SortOption = Query(
        SortOption.RELEVANT, description="Sorting option for the results"
    ),
    limit: int = Query(
        50, ge=1, le=200, description="Limit the number of listings (max: 200)"
    ),
    search_radius: int = Query(
        0, ge=0, le=50, description="Radius in kilometers (max: 50)"
    ),
):
    """Search for properties for rent based on location"""
    params = {
        "location": location,
        "page": page,
        "sort": sort,
        "limit": limit,
        "search_radius": search_radius,
    }

    return await call_rapid_api("/search/forrent", params)


@router.get("/search/forrent/coordinates")
async def search_forrent_coordinates(
    latitude: float = Query(..., description="Latitude coordinate"),
    longitude: float = Query(..., description="Longitude coordinate"),
    radius: int = Query(10, ge=1, le=50, description="Radius in kilometers (max: 50)"),
    page: int = Query(1, description="Page number for pagination"),
    sort: SortOption = Query(
        SortOption.RELEVANT, description="Sorting option for the results"
    ),
    limit: int = Query(
        50, ge=1, le=200, description="Limit the number of listings (max: 200)"
    ),
    polygon: Optional[str] = Query(
        None, description="Polygon coordinates for the area"
    ),
):
    """Search for rental properties based on coordinates"""
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


# -------------------- For Sold Listings Endpoints --------------------


@router.get("/search/forsold")
async def search_forsold(
    location: str = Query(..., description="Location for searching sold properties"),
    page: int = Query(1, description="Page number for pagination"),
    sort: SortOption = Query(
        SortOption.RELEVANT, description="Sorting option for the results"
    ),
    limit: int = Query(
        50, ge=1, le=200, description="Limit the number of listings (max: 200)"
    ),
    search_radius: int = Query(
        0, ge=0, le=50, description="Radius in kilometers (max: 50)"
    ),
):
    """Search for sold properties based on location"""
    params = {
        "location": location,
        "page": page,
        "sort": sort,
        "limit": limit,
        "search_radius": search_radius,
    }

    return await call_rapid_api("/search/forsold", params)


# -------------------- Suggestions Endpoint --------------------


@router.get("/suggestion")
async def get_suggestions(
    location: str = Query(..., description="Location for suggestions"),
):
    """Get location suggestions for autocomplete"""
    params = {"location": location}
    return await call_rapid_api("/suggestion", params)


# -------------------- Agent Endpoints --------------------


@router.get("/agent/search")
async def search_agents(
    location: str = Query(..., description="Location for searching agents"),
    name: Optional[str] = Query(None, description="Agent name to search for"),
    limit: int = Query(50, description="Limit the number of results"),
    page: int = Query(1, description="Page number for pagination"),
):
    """Search for real estate agents by location and name"""
    params = {"location": location, "page": page, "limit": limit}

    if name:
        params["name"] = name

    return await call_rapid_api("/agent/search", params)


@router.get("/agent/profile")
async def get_agent_profile(
    advertiser_id: str = Query(..., description="ID of the agent"),
):
    """Get detailed profile information for a specific agent"""
    params = {"advertiser_id": advertiser_id}
    return await call_rapid_api("/agent/profile", params)


@router.get("/agent/reviews")
async def get_agent_reviews(
    advertiser_id: str = Query(..., description="ID of the agent"),
):
    """Get reviews for a specific agent"""
    params = {"advertiser_id": advertiser_id}
    return await call_rapid_api("/agent/reviews", params)


class ListingType(str, Enum):
    ALL = "all"
    FORSALE = "forsale"
    FORRENT = "forrent"
    SOLD = "sold"


@router.get("/agent/listings")
async def get_agent_listings(
    advertiser_id: str = Query(..., description="ID of the agent"),
    page: int = Query(1, description="Page number for pagination"),
    type: ListingType = Query(ListingType.ALL, description="Type of listing"),
):
    """Get listings for a specific agent"""
    params = {"advertiser_id": advertiser_id, "page": page, "type": type}
    return await call_rapid_api("/agent/listings", params)


# -------------------- Property Endpoints --------------------


@router.get("/property/details")
async def get_property_details(
    property_id: Optional[str] = Query(None, description="ID of the property"),
    url: Optional[str] = Query(None, description="URL of the property"),
):
    """Get detailed information for a specific property"""
    if not property_id and not url:
        raise HTTPException(
            status_code=400, detail="Either property_id or url must be provided"
        )

    params = {}
    if property_id:
        params["property_id"] = property_id
    if url:
        params["url"] = url

    return await call_rapid_api("/property/details", params)


@router.get("/property/photos")
async def get_property_photos(
    property_id: Optional[str] = Query(None, description="ID of the property"),
    url: Optional[str] = Query(None, description="URL of the property"),
):
    """Get photos for a specific property"""
    if not property_id and not url:
        raise HTTPException(
            status_code=400, detail="Either property_id or url must be provided"
        )

    params = {}
    if property_id:
        params["property_id"] = property_id
    if url:
        params["url"] = url

    return await call_rapid_api("/property/photos", params)


@router.get("/property/environment_risk")
async def get_property_environment_risk(
    property_id: Optional[str] = Query(None, description="ID of the property"),
    url: Optional[str] = Query(None, description="URL of the property"),
):
    """Get environmental risk information for a specific property"""
    if not property_id and not url:
        raise HTTPException(
            status_code=400, detail="Either property_id or url must be provided"
        )

    params = {}
    if property_id:
        params["property_id"] = property_id
    if url:
        params["url"] = url

    return await call_rapid_api("/property/environment_risk", params)


class PropertyStatus(str, Enum):
    FOR_SALE = "for_sale"
    FOR_RENT = "for_rent"
    SOLD = "sold"


@router.get("/property/similar_homes")
async def get_similar_homes(
    property_id: Optional[str] = Query(None, description="ID of the property"),
    url: Optional[str] = Query(None, description="URL of the property"),
    status: PropertyStatus = Query(
        PropertyStatus.FOR_SALE, description="Status of similar homes to retrieve"
    ),
):
    """Get similar homes for a specific property"""
    if not property_id and not url:
        raise HTTPException(
            status_code=400, detail="Either property_id or url must be provided"
        )

    params = {"status": status}
    if property_id:
        params["property_id"] = property_id
    if url:
        params["url"] = url

    return await call_rapid_api("/property/similar_homes", params)


# -------------------- Housing Market Details Endpoint --------------------


@router.get("/housing_market_details")
async def get_housing_market_details(
    slug_id: Optional[str] = Query(
        None, description="Slug ID for retrieving housing market details"
    ),
    location: Optional[str] = Query(
        None, description="Location for retrieving housing market details"
    ),
):
    """Get housing market details for a location"""
    if not slug_id and not location:
        raise HTTPException(
            status_code=400, detail="Either slug_id or location must be provided"
        )

    params = {}
    if slug_id:
        params["slug_id"] = slug_id
    if location:
        params["location"] = location

    return await call_rapid_api("/housing_market_details", params)
