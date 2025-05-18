import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
			}`}
		>
			<div className="container mx-auto flex justify-between items-center px-4">
				<a href="/" className="flex items-center gap-2">
					<div className="bg-sky-500 p-1 rounded-md">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-white"
						>
							<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
							<polyline points="9 22 9 12 15 12 15 22" />
						</svg>
					</div>
					<span
						className={`font-bold text-lg ${isScrolled ? "text-sky-900" : "text-white"}`}
					>
						VetMyHomes
					</span>
				</a>

				<nav className="hidden md:flex gap-10">
					<a
						href="#features"
						className={`font-medium ${isScrolled ? "text-sky-800" : "text-white"} hover:text-sky-500 transition-colors`}
					>
						Features
					</a>
					<a
						href="#how-it-works"
						className={`font-medium ${isScrolled ? "text-sky-800" : "text-white"} hover:text-sky-500 transition-colors`}
					>
						How It Works
					</a>
					<a
						href="#testimonials"
						className={`font-medium ${isScrolled ? "text-sky-800" : "text-white"} hover:text-sky-500 transition-colors`}
					>
						Testimonials
					</a>
				</nav>

				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						className={`hidden md:inline-flex ${isScrolled ? "text-sky-800" : "text-white"} hover:text-sky-500 hover:bg-transparent`}
					>
						Log in
					</Button>
					<Button className="bg-sky-500 hover:bg-sky-600">Get Started</Button>
				</div>
			</div>
		</header>
	);
};

export default Header;
