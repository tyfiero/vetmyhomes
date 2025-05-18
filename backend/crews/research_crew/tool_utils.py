import asyncio
from concurrent.futures import ThreadPoolExecutor
from crewai.tools import BaseTool


class AsyncBaseTool(BaseTool):
    def _run(self, *args, **kwargs):
        try:
            # Try to get the current event loop
            loop = asyncio.get_event_loop()

            # Check if the loop is running
            if loop.is_running():
                # Use ThreadPoolExecutor if the loop is already running
                with ThreadPoolExecutor() as executor:
                    future = executor.submit(self._run_in_new_loop, *args, **kwargs)
                    return future.result()
            else:
                # Use the existing loop if it's not running
                return loop.run_until_complete(self.run_async_code(*args, **kwargs))
        except RuntimeError:
            # If there's no event loop in this thread, create a new one
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                return loop.run_until_complete(self.run_async_code(*args, **kwargs))
            finally:
                loop.close()

    def _run_in_new_loop(self, *args, **kwargs):
        # Create a new event loop in the thread
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(self.run_async_code(*args, **kwargs))
        finally:
            loop.close()

    async def run_async_code(self, *args, **kwargs):
        """This method should be implemented by subclasses to run async code."""
        raise NotImplementedError("Subclasses must implement run_async_code")
