import Header from '@/app/components/Header';
import Link from 'next/link';

export default function AdminDashboard() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-white">
			<Header />
			<div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">User Dashboard</h2>
				<ul className="space-y-4">
					<li>
						<Link href="/user/add-entry" className="block w-full text-center py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
							Add Entry
						</Link>
					</li>
					<li>
						<Link href="/admin/update-user" className="block w-full text-center py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
							Check Entry
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}