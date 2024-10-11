import Link from 'next/link';
import Header from './components/Header';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <Header />
            <h1 className="text-4xl text-center font-bold text-blue-600 my-6">Stock Management</h1>
            <div className="space-x-4 mt-5">
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
