# VetMyHomes Backend Setup

This guide explains how to set up the Python environment using uv and install the required dependencies.

## Prerequisites

- Python 3.10+ installed
- uv package manager installed

## Setup Instructions

1. Create a virtual environment:

```bash
uv venv .venv
```

2. Activate the virtual environment:

```bash
source .venv/bin/activate  # On Unix/macOS
# OR
.venv\Scripts\activate  # On Windows
```

3. Install dependencies:

```bash
uv pip install -r requirements.txt
```

## Running the API

```bash
python main.py
```

Alternatively:

```bash
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

## API Documentation

- Interactive API docs: http://localhost:8000/docs
- Alternative API docs: http://localhost:8000/redoc

## Environment Variables

Create a `.env` file based on `.env.example` and fill in your API keys and configuration. 