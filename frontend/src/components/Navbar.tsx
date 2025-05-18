import Link from "next/link";

export default function Navbar() {
	return (
		<nav className="bg-slate-800 backdrop-blur-md text-white p-1 flex items-center justify-between  z-50 opacity-90">
			<Link href="/" className="flex items-center">
				<div className="w-4 h-4 bg-blue-500 rounded-full mr-2" />
				<span className="font-semibold text-lg tracking-tight">
					Vetmy.homes
				</span>
			</Link>
			<div className="flex items-center">
				<Link
					href="/simple"
					className="text-sm text-gray-300 hover:text-white mr-4"
				>
					App
				</Link>
			</div>
		</nav>
	);
}
