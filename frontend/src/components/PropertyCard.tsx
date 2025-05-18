import React, { useState } from "react";

// Assuming PropertyDetail is defined in agent/page.tsx or a shared types file
// For now, let's duplicate it here or ensure it's imported if paths are set up.
type PropertyDetail = {
	address: string;
	price: number;
	bedrooms: number;
	bathrooms: number;
	sqft: number;
	agent: string;
	agent_phone: string;
	agent_email: string;
	environmental_risk: string;
	photos: string[];
};

interface PropertyCardProps {
	property: PropertyDetail;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
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
						className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getRiskColor(property.environmental_risk)}`}
					>
						{property.environmental_risk.toUpperCase()}
					</span>
				</div>
			</div>
		</div>
	);
};

export default PropertyCard;
