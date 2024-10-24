"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import Cookies from 'js-cookie';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function AddEntry() {
    const [productName, setProductName] = useState("Besan");
    const [approvalStatus, setApprovalStatus] = useState("Pending");
    const [quantity, setQuantity] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [entryList, setEntryList] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const storedUser = Cookies.get('userMobile');
    // Fetch entry list
    const fetchEntryList = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/entry`, {
                headers: {
                    "Authorization": `Bearer ${Cookies.get('authToken')}`
                }
            });
            const data = await res.json();
            // Filter data based on userNum
            console.log(data)
            const filteredData = data.filter(entry => entry.userNum?.toString() === storedUser.toString());
            console.log(filteredData)
            setEntryList(filteredData);
        } catch (error) {
            setError("Failed to fetch entry list.");
        }
    };

    useEffect(() => {
        if (storedUser) {
            fetchEntryList();
        }
    }, [storedUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        // Validation
        if (!productName || !quantity || !date) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        if (isNaN(quantity) || quantity <= 0) {
            setError("Quantity must be a positive number.");
            setLoading(false);
            return;
        }

        try {
            const method = isEdit ? "PUT" : "POST";
            const url = isEdit
                ? `${apiUrl}/api/entry/${editId}`
                : `${apiUrl}/api/entry`;

            // Set the current date when updating a product
            const currentDate = isEdit ? new Date().toISOString().split('T')[0] : date;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get('authToken')}`
                },
                body: JSON.stringify({ productName, quantity, storedUser, approvalStatus, date: currentDate }),
            });

            if (res.ok) {
                setSuccess(isEdit ? "Entry updated successfully!" : "Entry added successfully!");
                setQuantity("");
                setDate("");
                setApprovalStatus('Pending')
                setIsEdit(false);
                setEditId(null);
                fetchEntryList(); // Refresh the entry list after adding/updating
            } else {
                setError(isEdit ? "Failed to update entry." : "Failed to add entry.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (entry) => {
        setProductName(entry.productName);
        setQuantity(entry.quantity);
        setDate(new Date().toISOString().split('T')[0]); // Set date to current date for updates
        setIsEdit(true);
        setApprovalStatus('Pending')
        setEditId(entry._id);
        setSuccess("");
        setError("");
    };

    const handleApproval = async (entry) => {
        try {
            const url = `${apiUrl}/api/entry/${entry._id}`;
            const currentDate = new Date().toISOString().split('T')[0];

            // Use values directly from the entry object
            const productName = entry.productName;
            const quantity = entry.quantity;
            const approvalStatus = 'Submitted';

            console.log('Body:', {
                productName,
                quantity,
                storedUser,
                approvalStatus,
                date: currentDate,
            });

            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productName,
                    quantity,
                    storedUser,
                    approvalStatus,
                    date: currentDate,
                }),
            });

            if (res.ok) {
                setSuccess("Entry submitted successfully!");
                setQuantity("");
                setDate("");
                fetchEntryList(); // Refresh the entry list after adding/updating
            } else {
                setError("Failed to submit entry.");
            }
        } catch (err) {
            setError("Failed to submit entry. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const handleCancel = () => {
        setQuantity("");
        setDate("");
        setIsEdit(false);
        setEditId(null);
        setSuccess("");
        setError("");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 mb-8">
                <div className='flex flex-row items-start'>
                    <div className='w-1/4 mt-1'>
                        <Link href='/user/dashboard' className='text-xs border border-gray-500 p-1 px-2 rounded-md hover:border-blue-600 hover:text-blue-600'>Back</Link>
                    </div>
                    <div className='w-1/2'>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                            {isEdit ? "Update Entry" : "Add Entry"}
                        </h2>
                    </div>
                    <div className='w-1/4'></div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Phone Number</label>
                        <input
                            type="number"
                            value={storedUser}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Product Name</label>
                        <select
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="Besan">Besan</option>
                            <option value="Sooji">Sooji</option>
                            <option value="Maida">Maida</option>
                            <option value="Khadi Moong">Khadi Moong</option>
                            <option value="Daliya">Daliya</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Quantity (number of packets)</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                            disabled={loading}
                        >
                            {loading ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update" : "Add")}
                        </button>
                        {isEdit && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {success && <p className="text-green-500 mt-2">{success}</p>}
                </form>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entryList.length > 0 ? (
                    entryList.map((entry) => (
                        <div key={entry._id} className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800">{entry.productName}</h3>
                            <p className="text-gray-600">Quantity: {entry.quantity} packets</p>
                            <p className="text-gray-600">Date: {new Date(entry.date).toLocaleDateString()}</p>
                            <div className='flex flex-row gap-3'>
                                {entry.approvalStatus === 'Pending' &&
                                    <button
                                        onClick={() => handleEdit(entry)}
                                        className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
                                    >
                                        Edit
                                    </button>
                                }
                                {entry.approvalStatus === 'Submitted' &&
                                    <button
                                        disabled
                                        className="mt-4 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
                                    >
                                        Submitted
                                    </button>
                                }
                                {entry.approvalStatus === 'Pending' &&
                                    <button
                                        onClick={() => handleApproval(entry)}
                                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                                    >
                                        Send for Approval
                                    </button>
                                }
                                {entry.approvalStatus === 'Approved' &&
                                    <button
                                        disabled
                                        className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                                    >
                                        Approved
                                    </button>
                                }
                                {entry.approvalStatus === 'Submitted' &&
                                    <a
                                        href={`https://wa.me/9560366334?text=Entry%20Details:%0AProduct%20Name:%20${encodeURIComponent(entry.productName)}%0ABy:%20${encodeURIComponent(entry.userNum)}%0AQuantity:%20${encodeURIComponent(entry.quantity)}%20packets%0ADate:%20${encodeURIComponent(new Date(entry.date).toLocaleDateString())}%0AApproval%20Status:%20${encodeURIComponent(entry.approvalStatus)}`}
                                        target="_blank"
                                        className="mt-4 w-full bg-green-600 text-white text-center px-4 py-2 rounded hover:bg-green-700"
                                    >Send WhatsApp</a>
                                }
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">No entries found.</p>
                )}
            </div>
        </div>
    );
}
