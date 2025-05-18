import { Button } from "@/components/ui/button";

const HowItWorks = () => {
	const steps = [
		{
			number: "01",
			title: "Search for Properties",
			description:
				"Enter your desired location and preferences to discover available properties that match your criteria.",
		},
		{
			number: "02",
			title: "Review AI Analysis",
			description:
				"Our AI analyzes each property, providing insights on value, potential risks, neighborhood quality, and more.",
		},
		{
			number: "03",
			title: "Explore Detailed Reports",
			description:
				"Dive deep into comprehensive reports on geological risks, walkability scores, and property history.",
		},
		{
			number: "04",
			title: "Make Confident Decisions",
			description:
				"Use our data-driven insights to make informed decisions about which properties to pursue further.",
		},
	];

	return (
		<section id="how-it-works" className="py-24 bg-white">
			<div className="container mx-auto px-4">
				<div className="grid md:grid-cols-2 gap-12 items-center">
					<div>
						<h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-6">
							How Vet My Homes Works
						</h2>
						<p className="text-lg text-gray-600 mb-8">
							Our AI-powered platform simplifies the property research process,
							giving you confidence in your real estate decisions.
						</p>

						<div className="space-y-8">
							{steps.map((step, index) => (
								<div key={index} className="flex">
									<div className="mr-6">
										<div className="bg-sky-100 text-sky-600 font-bold text-lg h-12 w-12 rounded-full flex items-center justify-center">
											{step.number}
										</div>
									</div>
									<div>
										<h3 className="text-xl font-semibold mb-2 text-sky-800">
											{step.title}
										</h3>
										<p className="text-gray-600">{step.description}</p>
									</div>
								</div>
							))}
						</div>

						<Button className="mt-10 bg-sky-500 hover:bg-sky-600">
							Try It Now
						</Button>
					</div>

					<div className="relative">
						<div className="bg-gray-100 rounded-xl p-3 shadow-xl mx-auto max-w-md">
							<img
								src="https://images.unsplash.com/photo-1592595896616-c37162298647?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0"
								alt="Modern house with garden"
								className="rounded-lg w-full h-auto"
							/>

							<div className="bg-white p-6 rounded-lg mt-4 shadow-sm">
								<div className="flex justify-between items-center mb-4">
									<h4 className="font-bold text-lg">123 Maple Avenue</h4>
									<span className="text-sky-500 font-semibold">$549,000</span>
								</div>

								<div className="space-y-3">
									<div className="flex justify-between">
										<span className="text-gray-500">Walk Score:</span>
										<span className="font-medium">92/100</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Flood Risk:</span>
										<span className="font-medium text-green-600">Low</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Earthquake Risk:</span>
										<span className="font-medium text-yellow-600">
											Moderate
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">School Rating:</span>
										<span className="font-medium">8/10</span>
									</div>
								</div>

								<div className="h-2 bg-gray-100 rounded-full mt-6 overflow-hidden">
									<div
										className="bg-sky-500 h-full rounded-full"
										style={{ width: "85%" }}
									></div>
								</div>
								<div className="text-right mt-1 text-sm text-gray-500">
									Overall Rating: 85%
								</div>
							</div>
						</div>

						<div className="absolute -bottom-6 -left-6 w-24 h-24 bg-sky-500 rounded-full z-[-1]"></div>
						<div className="absolute -top-6 -right-6 w-32 h-32 bg-sky-200 rounded-full z-[-1]"></div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HowItWorks;
