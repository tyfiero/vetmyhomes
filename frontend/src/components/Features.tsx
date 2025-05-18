import { FileSearch, MapPin, Search, FootprintsIcon } from "lucide-react";

const Features = () => {
	const features = [
		{
			icon: <Search className="h-10 w-10 text-sky-500" />,
			title: "Smart Property Search",
			description:
				"Find your ideal home with our AI-powered search that understands your preferences and requirements.",
		},
		{
			icon: <FileSearch className="h-10 w-10 text-sky-500" />,
			title: "Comprehensive Due Diligence",
			description:
				"Get detailed reports on property history, condition assessments, and potential issues before making a decision.",
		},
		{
			icon: <MapPin className="h-10 w-10 text-sky-500" />,
			title: "Geological Risk Assessment",
			description:
				"Understand flood zones, earthquake risks, soil stability, and other environmental factors that could affect your property.",
		},
		{
			icon: <FootprintsIcon className="h-10 w-10 text-sky-500" />,
			title: "Walkability & Neighborhood Analysis",
			description:
				"Explore walking scores, proximity to amenities, school ratings, and neighborhood safety statistics.",
		},
	];

	return (
		<section id="features" className="py-24 bg-gray-50">
			<div className="container mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
						Features That Make Home Buying Smarter
					</h2>
					<p className="text-lg text-gray-600 max-w-3xl mx-auto">
						Our AI-powered platform provides comprehensive insights and analysis
						to help you make informed decisions about your next home.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{features.map((feature, index) => (
						<div
							key={index}
							className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
						>
							<div className="mb-4">{feature.icon}</div>
							<h3 className="text-xl font-semibold mb-3 text-sky-800">
								{feature.title}
							</h3>
							<p className="text-gray-600">{feature.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Features;
