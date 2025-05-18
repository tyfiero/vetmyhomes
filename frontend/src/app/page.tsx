"use client";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
export default function Home() {
	return (
		<div className="min-h-screen">
			<Hero />
			<Features />
			<HowItWorks />
			<Testimonials />
			<CallToAction />
			<Footer />
		</div>
	);
}
