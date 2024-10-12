"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function AdminLogin() {
	const [mobile, setMobile] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const response = await fetch(`${apiUrl}/api/users`);
			if (!response.ok) {
				throw new Error('Failed to fetch users');
			}
			const users = await response.json();

			const user = users.find(
				(user) => user.mobile === mobile && user.password === password
			);

			if (user) {
				router.push('/user/dashboard');
			} else {
				setError('Access denied 🙅‍♂️');
			}
		} catch (error) {
			console.error('Login error:', error);
			setError('Something went wrong. Please try again later.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-white">
			<Header />
			<div className="w-full max-w-sm bg-white rounded-lg mt-5 shadow-md p-6">
				<h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">User Login</h2>
				<form onSubmit={handleLogin} className="space-y-4">
					<input
						type="text"
						placeholder="Mobile Number"
						value={mobile}
						onChange={(e) => setMobile(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
					/>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
						disabled={loading}
					>
						{loading ? 'Logging in...' : 'Login'}
					</button>
				</form>
				{error && <p className="text-red-500 text-center mt-4">{error}</p>}
			</div>
		</div>
	);
}
