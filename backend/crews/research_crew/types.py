from pydantic import BaseModel, Field


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
    environmental_risk: str = Field(
        ..., description="Environmental risk level (low, medium, high)"
    )
    photos: list[str] = Field(default_factory=list, description="List of photo URLs")


class PropertyList(BaseModel):
    properties: list[Property]
