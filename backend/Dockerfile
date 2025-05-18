#Dockerfile

# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies for GDAL and other geospatial libraries
RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    gcc \
    g++ 

# Set GDAL environment variables
ENV GDAL_VERSION=3.6.2
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

# Install uv (a fast Python package installer)
RUN pip install uv

# Copy the dependencies file to the working directory
COPY requirements.txt .
COPY requirements.lock .

# Install any needed packages specified in requirements.txt
# Using uv for faster installation
RUN uv pip install --no-cache-dir --system -r requirements.txt

# Copy the rest of the application's code to the working directory
COPY . .

# Expose port 8000 to the outside world
EXPOSE 8000

# Command to run the application
# The default host and port are 0.0.0.0:8000, which is what Railway expects
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]