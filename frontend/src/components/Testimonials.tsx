import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
	const testimonials = [
		{
			quote:
				"Vet My Homes helped me avoid a house with major foundation issues. The geological risk assessment saved me from making a costly mistake.",
			name: "Sarah Johnson",
			title: "First-time Homebuyer",
			image: "https://i.pravatar.cc/150?img=32",
		},
		{
			quote:
				"The walkability analysis was spot on. As someone who doesn't drive, finding a home with great access to public transit and amenities was crucial.",
			name: "Michael Chen",
			title: "Urban Professional",
			image: "https://i.pravatar.cc/150?img=69",
		},
		{
			quote:
				"We were relocating to a new city and didn't know the neighborhoods well. The AI recommendations helped us find the perfect area for our family.",
			name: "Jessica Rodriguez",
			title: "Remote Worker",
			image: "https://i.pravatar.cc/150?img=47",
		},
	];

	return (
		<section id="testimonials" className="py-24 bg-sky-50">
			<div className="container mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
						What Our Users Say
					</h2>
					<p className="text-lg text-gray-600 max-w-3xl mx-auto">
						See how Vet My Homes has helped people make smarter real estate
						decisions.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{testimonials.map((testimonial, index) => (
						<Card
							key={index}
							className="border-none shadow-md hover:shadow-lg transition-shadow"
						>
							<CardContent className="p-6">
								<div className="flex flex-col items-center text-center">
									<div className="mb-6 relative">
										<div className="w-20 h-20 overflow-hidden rounded-full border-4 border-white shadow-md">
											<img
												src={testimonial.image}
												alt={testimonial.name}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="absolute -bottom-2 -right-2 bg-sky-500 rounded-full p-1">
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
												<path d="M12 20.92A18.93 18.93 0 0 1 .32 14.73L12 2l11.68 12.73a18.93 18.93 0 0 1-11.68 6.19z"></path>
											</svg>
										</div>
									</div>

									<div className="mb-4">
										<svg
											width="45"
											height="36"
											className="text-gray-200 mb-4"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 18 14"
										>
											<path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
										</svg>
									</div>

									<p className="italic text-gray-700 mb-6">
										{testimonial.quote}
									</p>

									<h4 className="font-semibold text-sky-800">
										{testimonial.name}
									</h4>
									<p className="text-sm text-gray-500">{testimonial.title}</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

export default Testimonials;
