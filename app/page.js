import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome to Stock Management System</h1>
      <div className="space-x-4">
        <Link href="/admin" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          Admin
        </Link>
        <Link href="/user" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
          User
        </Link>
      </div>
    </div>
  );
}
