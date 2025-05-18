import geopandas as gpd
import contextily as ctx
import matplotlib.pyplot as plt
from shapely.geometry import box
import base64, io
import os
from typing import Optional, Type
from pydantic import BaseModel, Field
from crewai.tools import BaseTool
from .tool_utils import AsyncBaseTool


def plot_map(lat, lon):
    # ---- user inputs ---------------------------------------------------------
    # lat, lon   = 47.6062, -122.3321          # Seattle, WA
    # lat, lon = 47.615747, -122.322268
    zoomkm = 2  # map half-width in km
    fault_zip = "WA_Qfault_2020_Update_Shapefile"  # or the nationwide file
    outfile = f"topo_map_{lat}_{lon}.png"
    # --------------------------------------------------------------------------

    # Build a GeoDataFrame with the point of interest
    poi = gpd.GeoSeries.from_xy([lon], [lat], crs="EPSG:4326").to_crs(3857)
    x, y = poi.geometry.iloc[0].x, poi.geometry.iloc[0].y

    # Construct a square bounding box around the point (Web-Mercator metres)
    half = zoomkm * 1_000
    xmin, ymin, xmax, ymax = x - half, y - half, x + half, y + half
    bbox = box(xmin, ymin, xmax, ymax)
    bbox_gdf = gpd.GeoDataFrame(geometry=[bbox], crs=3857)

    # Read and crop the fault layer
    faults = gpd.read_file(fault_zip)
    faults = faults.to_crs(3857)  # match web-mercator
    faults_clip = gpd.clip(faults, bbox_gdf)

    # Plot
    fig, ax = plt.subplots(figsize=(8, 8))
    ax.set_xlim(xmin, xmax)  # 1️⃣ force extent
    ax.set_ylim(ymin, ymax)
    ax.set_aspect("equal")  # keep it square

    if not faults_clip.empty:  # 2️⃣ only plot if we have data
        faults_clip.plot(ax=ax)
    ax.plot(poi.geometry.iloc[0].x, poi.geometry.iloc[0].y, "ro")

    # 2) Use a light-gray basemap instead of US Topo
    ctx.add_basemap(
        ax,
        source="https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
        crs=3857,
        attribution="USGS National Map",
    )

    ax.set_axis_off()
    plt.tight_layout()
    plt.savefig(outfile, dpi=300, bbox_inches="tight")
    plt.close()

    return outfile


# Input schema for the PlotMapTool
class PlotMapInput(BaseModel):
    """Input schema for plotting a map with fault data."""

    latitude: float = Field(..., description="Latitude coordinate for the map center")
    longitude: float = Field(..., description="Longitude coordinate for the map center")


# CrewAI tool that wraps the plot_map function
class PlotMapTool(BaseTool):
    name: str = "plot_map"
    description: str = (
        "Create a topographic map centered at specific coordinates showing geological fault lines"
    )
    args_schema: Type[BaseModel] = PlotMapInput

    def _run(
        self,
        latitude: float,
        longitude: float,
    ) -> str:
        """Create a map centered at the specified coordinates.

        Args:
            latitude: Latitude coordinate for the map center
            longitude: Longitude coordinate for the map center

        Returns:
            str: Path to the saved map image file
        """
        try:
            # Call the original plot_map function
            result = plot_map(latitude, longitude)

            # Return the path to the saved file
            return result
        except Exception as e:
            return f"Error creating map: {str(e)}"


# List of all available map tools
MAP_TOOLS = [
    PlotMapTool(),
]
