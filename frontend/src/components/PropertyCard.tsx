import { useState } from "react";
import type {
	EnvironmentalRisks,
	EnvironmentalRiskDetail,
	EnvironmentalRiskItem,
	PropertyDetail,
} from "../types";

const getDominantRiskLevel = (risks: EnvironmentalRisks): string => {
	if (risks.earthquake?.level) return risks.earthquake.level;
	if (risks.landslide?.level) return risks.landslide.level;
	if (risks.wildfire?.level) return risks.wildfire.level;
	if (risks.hurricane?.level) return risks.hurricane.level;
	if (risks.flood?.level) return risks.flood.level;
	return "N/A";
};

const PropertyCard = ({ property }: { property: PropertyDetail }) => {
	const [imageError, setImageError] = useState(false);

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(price);
	};

	const getRiskColor = (risk: string) => {
		switch (risk?.toLowerCase()) {
			case "low":
				return "bg-green-100 text-green-700";
			case "medium":
				return "bg-yellow-100 text-yellow-700";
			case "high":
				return "bg-red-100 text-red-700";
			default:
				return "bg-gray-100 text-gray-700";
		}
	};

	const handleImageError = () => {
		setImageError(true);
	};

	const renderEnvironmentalRiskDetail = (
		riskName: string,
		riskDetail: EnvironmentalRiskDetail | null,
		icon: string, // Placeholder for icon
	) => {
		if (!riskDetail) {
			return (
				<div
					key={riskName}
					className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
				>
					<div className="flex items-center mb-1">
						<span className="mr-2 text-lg">{icon}</span>
						<h5 className="text-sm font-semibold text-gray-800 dark:text-white">
							{riskName.charAt(0).toUpperCase() + riskName.slice(1)}
						</h5>
					</div>
					<p className="text-xs text-gray-500 dark:text-gray-300 italic">
						No significant risk data available.
					</p>
				</div>
			);
		}

		return (
			<div
				key={riskName}
				className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm"
			>
				<div className="flex justify-between items-center mb-1">
					<div className="flex items-center">
						<span className="mr-2 text-lg">{icon}</span>
						<h5 className="text-sm font-semibold text-gray-800 dark:text-white">
							{riskName.charAt(0).toUpperCase() + riskName.slice(1)}
						</h5>
					</div>
					<span
						className={`px-2 py-1 text-xs font-bold rounded-full ${getRiskColor(riskDetail.level)}`}
					>
						{riskDetail.level.toUpperCase()}
					</span>
				</div>
				<p className="text-xs text-gray-700 dark:text-gray-300 mb-1">
					<span className="font-semibold">Score:</span>{" "}
					{riskDetail.score.toFixed(2)}
				</p>
				<p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
					{riskDetail.description}
				</p>
				{riskDetail.summary && (
					<p className="text-xs italic text-gray-500 dark:text-gray-400 mb-2">
						{riskDetail.summary}
					</p>
				)}

				{riskDetail.items && riskDetail.items.length > 0 && (
					<div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
						<h6 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
							Breakdown:
						</h6>
						<dl className="text-xs text-gray-600 dark:text-gray-400">
							{riskDetail.items.map((item: EnvironmentalRiskItem) => (
								<div key={item.code} className="flex justify-between">
									<dt className="font-medium">{item.description}:</dt>
									<dd className="text-right">
										{typeof item.value === "number"
											? item.value.toFixed(2)
											: item.value}
									</dd>
								</div>
							))}
						</dl>
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out max-w-sm mx-auto my-2">
			{!imageError && property.photos && property.photos.length > 0 && (
				<img
					src={property.photos[0]}
					alt={`Property at ${property.address}`}
					className="w-full h-40 object-cover"
					onError={handleImageError}
				/>
			)}
			<div className="p-4">
				<h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1 leading-tight">
					{property.address}
				</h3>
				<p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
					{formatPrice(property.price)}
				</p>

				<div className="grid grid-cols-3 gap-2 mb-2 text-xs text-gray-700 dark:text-gray-300">
					<div>
						<span className="font-semibold">Beds:</span> {property.bedrooms}
					</div>
					<div>
						<span className="font-semibold">Baths:</span> {property.bathrooms}
					</div>
					<div>
						<span className="font-semibold">Sqft:</span> {property.sqft}
					</div>
					{property.tract_fips && (
						<div className="col-span-3 mt-1">
							<span className="font-semibold">Tract FIPS:</span>{" "}
							{property.tract_fips}
						</div>
					)}
				</div>

				<div className="mb-2">
					<h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-0.5">
						Agent:
					</h4>
					<p className="text-xs text-gray-600 dark:text-gray-400">
						{property.agent}
					</p>
					<p className="text-xs text-gray-600 dark:text-gray-400">
						<a
							href={`tel:${property.agent_phone}`}
							className="hover:text-blue-500"
						>
							{property.agent_phone}
						</a>
					</p>
					<p className="text-xs text-gray-600 dark:text-gray-400">
						<a
							href={`mailto:${property.agent_email}`}
							className="hover:text-blue-500"
						>
							{property.agent_email}
						</a>
					</p>
				</div>

				<div className="flex items-center justify-between text-xs">
					<span className="text-gray-600 dark:text-gray-400">
						Environmental Risk:
					</span>
					<span
						className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getRiskColor(getDominantRiskLevel(property.environmental_risks))}`}
					>
						{getDominantRiskLevel(property.environmental_risks).toUpperCase()}
					</span>
				</div>

				<div className="mt-3">
					<h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-1">
						Environmental Risks
					</h4>
					{property.environmental_risks.summary && (
						<p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md">
							Overall Summary: {property.environmental_risks.summary}
						</p>
					)}
					
					{renderEnvironmentalRiskDetail(
						"earthquake",
						property.environmental_risks.earthquake,
						"⛰️", // Placeholder icon
					)}
					{renderEnvironmentalRiskDetail(
						"landslide",
						property.environmental_risks.landslide,
						"🏞️", // Placeholder icon
					)}
					{renderEnvironmentalRiskDetail(
						"flood",
						property.environmental_risks.flood,
						"🌊", // Placeholder icon
					)}
					{renderEnvironmentalRiskDetail(
						"wildfire",
						property.environmental_risks.wildfire,
						"🔥", // Placeholder icon
					)}
					{renderEnvironmentalRiskDetail(
						"hurricane",
						property.environmental_risks.hurricane,
						"🌀", // Placeholder icon
					)}
					{property.environmental_risks.fault_lines_map && (
						<div className="mb-4">
						<h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
							Fault Lines Map
						</h5>
						<div className="relative w-full h-48 overflow-hidden rounded-md shadow-md">
							<img 
								src={`http://localhost:8000/${property.environmental_risks.fault_lines_map}`} 
								alt="Fault Lines Map"
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
						)}
				</div>
			</div>
		</div>
	);
};

export default PropertyCard;
