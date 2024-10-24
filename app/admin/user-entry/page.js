"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import Cookies from 'js-cookie';
import Loading from "@/app/components/Loading";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function UserEntry() {
    const [quantity, setQuantity] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [entryList, setEntryList] = useState([]);
    // const [userNum, setUserNum] = useState('');
    const storedUser = Cookies.get('userMobile');


    // Fetch entry list
    const fetchEntryList = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${apiUrl}/api/entry`, {
                headers: {
					"Authorization": `Bearer ${Cookies.get('authToken')}`
				}
            }); // Pass userNum as a query parameter
            const data = await res.json();
            setEntryList(data);
            setLoading(false)
        } catch (error) {
            setError("Failed to fetch entry list.");
        }
    };


    useEffect(() => {
        if (storedUser) {
            fetchEntryList();
        }
    }, [storedUser]);

    const handleApproval = async (entry) => {
        try {
            const url = `${apiUrl}/api/entry/${entry._id}`;
            const currentDate = new Date().toISOString().split('T')[0];

            // Use values directly from the entry object
            const productName = entry.productName;
            const quantity = entry.quantity;
            const approvalStatus = 'Approved';
            const userNum = entry?.userNum;
            console.log('Body:', {
                productName,
                quantity,
                userNum,
                approvalStatus,
                date: currentDate,
            });

            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get('authToken')}`
                },
                body: JSON.stringify({
                    productName,
                    quantity,
                    userNum,
                    approvalStatus,
                    date: currentDate,
                }),
            });

            if (res.ok) {
                alert("Entry approved successfully!");
                setQuantity("");
                setDate("");
                fetchEntryList(); // Refresh the entry list after adding/updating
            } else {
                alert("Failed to approve entry.");
            }
        } catch (err) {
            alert("Failed to approve entry. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
		return <Loading />;
	} else {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <div className='flex flex-col items-center justify-center'>
                    <div className='w-full text-center mb-5 mt-1'>
                        <Link href='/admin/dashboard' className='text-sm border border-gray-500 p-1 px-2 rounded-md hover:border-blue-600 hover:text-blue-600'>Dashboard</Link>
                    </div>
                    <div className='w-full'>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                            Approve User Entry
                        </h2>
                    </div>
                    <div className='w-1/4'></div>
                </div>
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entryList && entryList
                .filter((entry) => entry.approvalStatus === "Submitted" ||  entry.approvalStatus === "Approved") // Filter entries with approvalStatus "Submitted"
                .map((entry) => (
                        <div key={entry._id} className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800">{entry.productName}</h3>
                            <p className="text-gray-600">Submitted by: {entry.userNum}</p>
                            <p className="text-gray-600">Quantity: {entry.quantity} packets</p>
                            <p className="text-gray-600">Date: {new Date(entry.date).toLocaleDateString()}</p>
                            <div className='flex flex-row gap-3'>
                                {entry.approvalStatus === 'Approved' &&
                                    <button
                                        disabled
                                        className="mt-4 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
                                    >
                                        Approved
                                    </button>
                                }
                                {entry.approvalStatus === 'Submitted' &&
                                    <button
                                        onClick={() => handleApproval(entry)}
                                        className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                                    >
                                        Approve
                                    </button>
                                }
                                {entry.approvalStatus === 'Approved' &&
                                    <a
                                        href={`https://wa.me/${encodeURIComponent(entry.userNum)}?text=Entry%20Details:%0AProduct%20Name:%20${encodeURIComponent(entry.productName)}%0ABy:%20${encodeURIComponent(entry.userNum)}%0AQuantity:%20${encodeURIComponent(entry.quantity)}%20packets%0ADate:%20${encodeURIComponent(new Date(entry.date).toLocaleDateString())}%0AApproval%20Status:%20${encodeURIComponent(entry.approvalStatus)}`}
                                        target="_blank"
                                        className="mt-4 w-full bg-green-600 text-white text-center px-4 py-2 rounded hover:bg-green-700"
                                    >Send WhatsApp</a>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }


    
}
