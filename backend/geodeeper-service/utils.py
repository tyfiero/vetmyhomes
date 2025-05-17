# A bucket o' utility functions

# Verify address is valid

# Parse US Address
import re

def parse_us_address(address: str):
    """
    Parses a US address string into street, city, and state.
    Assumes format: "street, city, state ZIP"
    Returns: (street, city, state)
    """
    # Example: "1605 Boylston Ave, Seattle, WA 98122"
    parts = [p.strip() for p in address.split(",")]
    if len(parts) < 3:
        raise ValueError("Address must be in 'street, city, state ZIP' format")
    street = parts[0]
    city = parts[1]
    # Extract state (2-letter) from the third part
    state_zip = parts[2]
    match = re.match(r"([A-Z]{2})\\b", state_zip)
    if match:
        state = match.group(1)
    else:
        # fallback: just take first two letters
        state = state_zip[:2]
    return street, city, state