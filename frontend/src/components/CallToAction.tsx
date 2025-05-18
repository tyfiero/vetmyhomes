import Link from "next/link";

const CallToAction = () => {
	return (
		<section className="py-20 relative overflow-hidden">
			<div className="absolute inset-0 z-0">
				<img
					src="https://images.unsplash.com/photo-1580041065738-e72023775cdc?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0"
					alt="Modern bright living room"
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-sky-900/80"></div>
			</div>

			<div className="container mx-auto px-4 relative z-10">
				<div className="max-w-3xl mx-auto text-center">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
						Ready to Find Your Perfect Home?
					</h2>
					<p className="text-xl text-white/90 mb-10">
						Join thousands of happy homeowners who made confident decisions with
						Vet My Homes. Our AI-powered platform is ready to help you find and
						analyze your next home.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/simple"
							className="bg-white text-sky-600 hover:bg-gray-100 rounded-md px-4 py-2"
						>
							Start Your Search
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CallToAction;
