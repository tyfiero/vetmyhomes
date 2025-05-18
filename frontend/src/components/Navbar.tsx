import Link from "next/link";

export default function Navbar() {
	return (
		<nav className="bg-gray-800 text-white p-4 flex items-center justify-between">
			<div className="flex items-center">
				<div className="w-8 h-8 bg-blue-500 rounded-full mr-2" />
				<span className="font-semibold text-xl tracking-tight">
					Vetmy.homes
				</span>
			</div>
			<div className="flex items-center">
				<Link
					href="/agent"
					className="text-sm text-gray-300 hover:text-white mr-4"
				>
					App
				</Link>
			</div>
		</nav>
	);
}
