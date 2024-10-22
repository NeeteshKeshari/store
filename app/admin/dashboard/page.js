"use client"
import Header from '@/app/components/Header';
import Link from 'next/link';
import React, { } from 'react';
import Cookies from 'js-cookie';
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
					<h2 className="text-2xl font-bold text-gray-800 text-center">Admin Dashboard</h2>
					<button onClick={handleLogout} className='block w-1/4 text-center py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition cursor-pointer'>Logout</button>
				</div>
				<ul className="space-y-4">
					<li>
						<Link href="/admin/add-raw-material" className="block w-full text-center py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
							Raw Material
						</Link>
					</li>
					<li>
						<Link href="/admin/user-entry" className="block w-full text-center py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
							Approve User Entry
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
					<li>
						<Link href="/admin/summary" className="block w-full text-center py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
							Summary
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
