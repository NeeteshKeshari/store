"use client"
import Header from '@/app/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
	const router = useRouter();
	const handleLogout = () => {
		Cookies.remove('authToken');
		Cookies.remove('userMobile');
		router.push('/');
	};
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-white">
			<Header />
			<div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
				<div className='flex flex-col mb-8 justify-center items-center'>
					<h2 className="text-2xl font-bold text-gray-800 text-center">User Dashboard</h2>
					<button onClick={handleLogout} className='block w-1/4 text-center py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition cursor-pointer'>Logout</button>
				</div>
				<ul className="space-y-4">
					<li>
						<Link href="/user/add-entry" className="block w-full text-center py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
							Add Entry
						</Link>
					</li>
					{/* <li>
						<Link href="/admin/update-user" className="block w-full text-center py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
							Check Entry
						</Link>
					</li> */}
				</ul>
			</div>
		</div>
	);
}
