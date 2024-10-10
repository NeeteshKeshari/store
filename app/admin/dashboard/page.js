import Link from 'next/link';

export default function AdminDashboard() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Admin Dashboard</h2>
				<ul className="space-y-4">
					<li>
						<Link href="/admin/add-raw-material" className="block w-full text-center py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
							Add Raw Material
						</Link>
					</li>
					<li>
						<Link href="/admin/update-user" className="block w-full text-center py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
							Update User Entry
						</Link>
					</li>
					<li>
						<Link href="/admin/products" className="block w-full text-center py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
							Products
						</Link>
					</li>
					<li>
						<Link href="/admin/check-sales" className="block w-full text-center py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
							Sales
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
