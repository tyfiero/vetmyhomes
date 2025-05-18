"use client";

import { useState } from "react";
import PropertyCard from "../../components/PropertyCard";
import type { PropertyDetail } from "../../types";

export default function SimplePage() {
	const [inputValue, setInputValue] = useState<string>("");
	const [properties, setProperties] = useState<PropertyDetail[] | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		setIsLoading(true);
		setError(null);
		setProperties(null);

		try {
			const response = await fetch("http://localhost:8000/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ query: inputValue }),
			});

			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(
					`Network response was not ok. Status: ${response.status}. Message: ${errorData}`,
				);
			}

			const data = await response.json();
			// Assuming the API returns an object with a 'properties' key
			if (data?.properties) {
				setProperties(data.properties);
			} else {
				// If the structure is different, e.g., data is directly the array
				// setProperties(data);
				// For now, let's assume it's { properties: [] }
				console.warn(
					"Received data.properties is missing or not an array:",
					data,
				);
				setProperties([]); // Set to empty array if structure is not as expected or no properties
			}
		} catch (e: unknown) {
			console.error("Failed to fetch properties:", e);
			if (e instanceof Error) {
				setError(e.message);
			} else {
				setError("An unknown error occurred while fetching properties.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto p-4 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
			<header className="text-center my-8">
				<h1 className="text-4xl font-bold text-sky-400">
					Property Inquiry Assistant
				</h1>
				<p className="text-slate-300 mt-2">
					Enter your query below to find relevant properties.
				</p>
			</header>

			<div className="max-w-2xl mx-auto bg-slate-800/70 backdrop-blur-md p-6 rounded-lg shadow-xl">
				<div className="mb-4">
					<textarea
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder="e.g., 'Show me properties in Seattle with at least 3 bedrooms'"
						className="w-full p-3 border border-slate-600 rounded-md shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-700 text-white placeholder-slate-400 transition duration-150 ease-in-out"
						rows={4}
						disabled={isLoading}
					/>
				</div>
				<button
					type="button"
					onClick={handleSubmit}
					disabled={isLoading}
					className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center"
				>
					{isLoading ? (
						<>
							<svg
								className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<title>Loading</title>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							Processing...
						</>
					) : (
						"Send Query"
					)}
				</button>
			</div>

			{error && (
				<div className="mt-6 max-w-2xl mx-auto p-4 bg-red-700/80 text-red-100 rounded-md shadow-lg">
					<p className="font-semibold">Error:</p>
					<p>{error}</p>
				</div>
			)}

			{isLoading && !properties && (
				<div className="text-center mt-8 text-slate-300">
					<p>Loading properties...</p>
				</div>
			)}

			{!isLoading && properties && properties.length === 0 && !error && (
				<div className="mt-6 max-w-2xl mx-auto p-4 bg-slate-700/70 text-slate-300 rounded-md shadow-lg text-center">
					<p>
						No properties found for your query, or the assistant didn&apos;t
						return any.
					</p>
				</div>
			)}

			{properties && properties.length > 0 && (
				<div className="mt-8">
					<h2 className="text-2xl font-semibold text-sky-400 mb-4 text-center">
						Available Properties:
					</h2>
					<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{properties.map((property, index) => (
							<PropertyCard
								key={property.address || `property-${index}`}
								property={property}
							/>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
