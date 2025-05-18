import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
	return (
		<div className="relative min-h-screen flex items-center">
			{/* Background image */}
			<div className="absolute inset-0 z-0">
				<img
					src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop&ixlib=rb-4.1.0"
					alt="Modern house with pool"
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-sky-900/80 to-sky-900/50"></div>
			</div>

			{/* Content */}
			<div className="container mx-auto px-4 relative z-10 pt-20">
				<div className="max-w-3xl animate-fade-in">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
						Find Your Perfect Home with AI-Powered Insights
					</h1>
					<p className="text-xl text-white/90 mb-8">
						Vet My Homes is your personal AI real estate agent that searches,
						analyzes, and vets properties so you can make confident decisions.
					</p>

					<div className="flex justify-start mb-10">
						<Link
							href="/simple"
							className="bg-sky-500 hover:bg-sky-600 text-white py-6 px-8 text-lg"
						>
							Start Now
							<ArrowRight className="ml-2" />
						</Link>
					</div>

					<div className="flex flex-wrap gap-6 text-white">
						<div className="flex items-center">
							<div className="h-8 w-8 bg-sky-500 rounded-full flex items-center justify-center mr-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="text-white"
								>
									<path d="m9 18 6-6-6-6" />
								</svg>
							</div>
							<span>Advanced property search</span>
						</div>
						<div className="flex items-center">
							<div className="h-8 w-8 bg-sky-500 rounded-full flex items-center justify-center mr-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="text-white"
								>
									<path d="m9 18 6-6-6-6" />
								</svg>
							</div>
							<span>In-depth risk analysis</span>
						</div>
						<div className="flex items-center">
							<div className="h-8 w-8 bg-sky-500 rounded-full flex items-center justify-center mr-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="text-white"
								>
									<path d="m9 18 6-6-6-6" />
								</svg>
							</div>
							<span>AI-powered recommendations</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
