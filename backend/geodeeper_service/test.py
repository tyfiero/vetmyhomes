# Remove after moving into a tool
import asyncio
from geo_service import get_tract_fips_from_address, get_tract_field_names, get_tract_data

ADDRESS = "1605 Boylston Ave, Seattle, WA 98122"


if __name__ == "__main__":

    tract_fips = asyncio.run(get_tract_fips_from_address(ADDRESS))['tract_fips']
    field_names = asyncio.run(get_tract_field_names())
    single_result = asyncio.run(get_tract_data(['TSUN_ALRP'], tract_fips))
    multiple_results = asyncio.run(get_tract_data(['TSUN_ALRP', 'TRND_HLRA'], tract_fips))
    print('single_result', single_result)
    print('multiple_results', multiple_results)
