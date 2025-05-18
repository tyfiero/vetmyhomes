import os
import json
from datetime import datetime
from pathlib import Path

from rich.console import Console
from rich.prompt import Prompt
from rich.markdown import Markdown

# Assuming the script is run from the root of the vetmyhomes project
# Adjust the path if necessary to correctly import kickoff_crew
try:
    from crews.research_crew.crew_manager import kickoff_crew
    from crews.research_crew.types import PropertyList # For type hinting and potentially better formatting
except ImportError as e:
    print(f"Error importing crew manager: {e}")
    print("Please ensure you are running this script from the root of the 'vetmyhomes' project directory,")
    print("and that the backend module is correctly structured.")
    exit(1)

def save_results_to_markdown(results: any, query: str, directory: str = "crew_results") -> str:
    """Saves the crew results to a markdown file."""
    # Ensure the directory exists
    Path(directory).mkdir(parents=True, exist_ok=True)

    # Generate a filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_query = "".join(c if c.isalnum() else "_" for c in query[:30]) # Sanitize query for filename
    filename = f"{timestamp}_{safe_query}.md"
    filepath = Path(directory) / filename

    content = f"# Research Results for Query: {query}\n\n"

    if isinstance(results, dict) or (hasattr(results, 'model_dump') and callable(getattr(results, 'model_dump'))):
        # If it's a dict or Pydantic model
        json_results = json.dumps(results.model_dump() if hasattr(results, 'model_dump') else results, indent=2, ensure_ascii=False)
        content += "## Raw JSON Output\n\n"
        content += f"```json\n{json_results}\n```\n"
    elif isinstance(results, str):
        content += "## Output\n\n"
        content += results
    else:
        content += "## Raw Output\n\n"
        content += f"```\n{str(results)}\n```\n"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    return str(filepath.resolve())

def main():
    console = Console()
    console.print("[bold cyan]Welcome to the VetMyHomes Research Crew CLI![/bold cyan]")
    console.print("---")

    user_query = Prompt.ask("[bold green]Enter your research query[/bold green]")

    if not user_query:
        console.print("[yellow]No query entered. Exiting.[/yellow]")
        return

    console.print(f"\n[cyan]Processing query:[/cyan] '{user_query}'")
    console.print("[magenta]Kicking off the research crew... This may take a while. Logs will appear below:[/magenta]")
    console.print("---")

    inputs = {"query": user_query}

    try:
        # kickoff_crew is expected to print its own logs due to verbose=True in CrewAI
        crew_result = kickoff_crew(inputs)
        console.print("---")
        console.print("[bold green]Crew execution finished successfully![/bold green]")

        if crew_result:
            console.print("\n[cyan]Saving results to Markdown...[/cyan]")
            md_filepath = save_results_to_markdown(crew_result, user_query)
            console.print(f"[green]Results saved to:[/green] [link=file://{md_filepath}]{md_filepath}[/link]")
            
            # Optionally, display the markdown in console if it's not too long
            # with open(md_filepath, "r", encoding="utf-8") as f:
            #     md_content = f.read()
            # if len(md_content) < 2000: # Arbitrary limit to avoid flooding console
            #     console.print("\n--- Preview of Markdown ---")
            #     console.print(Markdown(md_content))
            #     console.print("--- End of Preview ---")
            # else:
            #     console.print("[yellow]Markdown content is too long to display here. Please open the file.[/yellow]")

        else:
            console.print("[yellow]Crew execution did not return any results.[/yellow]")

    except Exception as e:
        console.print("---")
        console.print(f"[bold red]An error occurred during crew execution:[/bold red]\n{e}")
        import traceback
        console.print("[red]Traceback:[/red]")
        console.print(traceback.format_exc())

    console.print("\n[bold cyan]CLI session finished.[/bold cyan]")

if __name__ == "__main__":
    main() 