"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Cookies from 'js-cookie';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import { usePathname } from 'next/navigation'
export default function AdminLogin() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname()
  // Check if user is already logged in
  useEffect(() => {
    console.log(Cookies.get('userMobile'))
    const token = Cookies.get('authToken');
    if (token) {
      router.push(`${pathname}/dashboard`);
    }
  }, [pathname]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiUrl}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the token and mobile in cookies using js-cookie
        Cookies.set('authToken', data.token, { expires: 14 }); // Expires in 2 weeks
        Cookies.set('userMobile', mobile, { expires: 14 }); // Expires in 2 weeks

        // Redirect based on current URL
        const currentPath = window.location.pathname;
        if (currentPath === '/admin') {
          router.push('/admin/dashboard');
        } else if (currentPath === '/user') {
          router.push('/user/dashboard');
        } else {
          setError('Access denied 🙅‍♂️');
        }
      } else {
        setError(data.message || 'Access denied 🙅‍♂️');
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
