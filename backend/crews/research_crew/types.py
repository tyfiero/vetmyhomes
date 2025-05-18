from pydantic import BaseModel, Field
from typing import Optional, List

class RiskItem(BaseModel):
    code: str = Field(..., description="Risk code identifier")
    description: str = Field(..., description="Description of the risk factor")
    value: float = Field(..., description="Value or score for this risk factor")

class RiskDetail(BaseModel):
    level: str = Field(..., description="Risk level (low, medium, high)")
    description: str = Field(..., description="Description of the risk")
    score: Optional[float] = Field(None, description="Numerical risk score")
    summary: Optional[str] = Field(None, description="Summary of the risk")
    items: List[RiskItem] = Field(..., description="List of risk items for this sub-risk")

class EnvironmentalRisks(BaseModel):
    earthquake: Optional[RiskDetail] = None
    landslide: Optional[RiskDetail] = None
    flood: Optional[RiskDetail] = None
    wildfire: Optional[RiskDetail] = None
    hurricane: Optional[RiskDetail] = None
    summary: Optional[str] = Field(None, description="Summary of the risks")

class Property(BaseModel):
    """Model representing a real estate property."""

    address: str = Field(..., description="Property street address")
    price: int = Field(..., description="Property price in dollars")
    bedrooms: int = Field(..., description="Number of bedrooms")
    bathrooms: int = Field(..., description="Number of bathrooms")
    sqft: int = Field(..., description="Property square footage")
    agent: str = Field(..., description="Real estate agent name")
    agent_phone: str = Field(..., description="Real estate agent phone number")
    agent_email: str = Field(..., description="Real estate agent email address")
    tract_fips: str = Field(..., description="Census Tract FIPS code")
    environmental_risks: EnvironmentalRisks = Field(
        ..., description="Detailed environmental risks by type"
    )
    photos: list[str] = Field(default_factory=list, description="List of photo URLs")


class PropertyList(BaseModel):
    properties: list[Property]





