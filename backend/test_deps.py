#!/usr/bin/env python3
"""
Test script to verify dependencies are correctly installed
"""

import subprocess
import sys


def check_dependency(module_name):
    try:
        if module_name == "python-dotenv":
            # python-dotenv is imported as dotenv
            __import__("dotenv")
        else:
            __import__(module_name)
        return True
    except ImportError:
        return False


def check_crewai_tool():
    """Check if crewai is installed as a uv tool"""
    try:
        result = subprocess.run(
            ["uv", "tool", "list"], capture_output=True, text=True, check=False
        )
        return "crewai" in result.stdout
    except Exception:
        return False


def main():
    dependencies = [
        "fastapi",
        "uvicorn",
        "httpx",
        "firecrawl",
        "langchain",
        "langchain_community",
        "langchain_openai",
        "pydantic",
        "pydantic_settings",
        "python-dotenv",
    ]

    print("Testing dependencies...")
    all_passed = True

    # Check regular dependencies
    for dep in dependencies:
        if check_dependency(dep):
            print(f"✅ {dep} installed successfully")
        else:
            print(f"❌ {dep} not installed or has issues")
            all_passed = False

    # Check crewai as a uv tool
    if check_crewai_tool():
        print("✅ crewai installed as a uv tool")
    else:
        print("❌ crewai not installed as a uv tool")
        all_passed = False

    if all_passed:
        print("\nAll dependencies installed successfully!")
        return 0
    else:
        print("\nSome dependencies are missing or have issues")
        return 1


if __name__ == "__main__":
    sys.exit(main())
