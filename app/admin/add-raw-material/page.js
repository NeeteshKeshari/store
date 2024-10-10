"use client";
import { useState, useEffect } from "react";

export default function AddRawMaterial() {
	const [rawMaterialName, setRawMaterialName] = useState("Chana Daal");
	const [quantity, setQuantity] = useState("");
	const [price, setPrice] = useState("");
	const [date, setDate] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [stockList, setStockList] = useState([]);
	const [isEdit, setIsEdit] = useState(false);
	const [editId, setEditId] = useState(null);

	// Fetch stock list
	const fetchStockList = async () => {
		try {
			const res = await fetch('https://stock-node-55ci.onrender.com/api/stock');
			const data = await res.json();
			setStockList(data);
		} catch (error) {
			setError("Failed to fetch stock list.");
		}
	};

	useEffect(() => {
		fetchStockList();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);

		// Validation
		if (!rawMaterialName || !quantity || !price || !date) {
			setError("All fields are required.");
			setLoading(false);
			return;
		}

		if (isNaN(quantity) || quantity <= 0) {
			setError("Quantity must be a positive number.");
			setLoading(false);
			return;
		}

		if (isNaN(price) || price <= 0) {
			setError("Price must be a positive number.");
			setLoading(false);
			return;
		}

		try {
			const method = isEdit ? "PUT" : "POST";
			const url = isEdit
				? `https://stock-node-55ci.onrender.com/api/stock/${editId}`
				: 'https://stock-node-55ci.onrender.com/api/stock';

			// Set the current date when updating a product
			const currentDate = isEdit ? new Date().toISOString().split('T')[0] : date;

			const res = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ rawMaterialName, quantity, price, date: currentDate }),
			});

			if (res.ok) {
				setSuccess(isEdit ? "Raw material updated successfully!" : "Raw material added successfully!");
				setQuantity("");
				setPrice("");
				setDate("");
				setIsEdit(false);
				setEditId(null);
				fetchStockList(); // Refresh the stock list after adding/updating
			} else {
				setError(isEdit ? "Failed to update raw material." : "Failed to add raw material.");
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (stock) => {
		setRawMaterialName(stock.rawMaterialName);
		setQuantity(stock.quantity);
		setPrice(stock.price);
		// Set the date to the current date for updates
		setDate(new Date().toISOString().split('T')[0]);
		setIsEdit(true);
		setEditId(stock._id);
		setSuccess("");
		setError("");
	};

	const handleCancel = () => {
		setQuantity("");
		setPrice("");
		setDate("");
		setIsEdit(false);
		setEditId(null);
		setSuccess("");
		setError("");
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
			<div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 mb-8">
				<h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
					{isEdit ? "Update Raw Material" : "Add Raw Material"}
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-gray-700">Raw Material Name</label>
						<select
							value={rawMaterialName}
							onChange={(e) => setRawMaterialName(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
						>
							<option value="Chana Daal">Chana Daal</option>
							<option value="Sugar">Sugar</option>
						</select>
					</div>
					<div>
						<label className="block text-gray-700">Quantity (in Kg)</label>
						<input
							type="number"
							value={quantity}
							onChange={(e) => setQuantity(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
						/>
					</div>
					<div>
						<label className="block text-gray-700">Price (per Kg)</label>
						<input
							type="number"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
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
				{stockList.map((stock) => (
					<div key={stock._id} className="bg-white p-4 rounded-lg shadow-md">
						<h3 className="text-lg font-semibold text-gray-800">{stock.rawMaterialName}</h3>
						<p className="text-gray-600">Quantity: {stock.quantity} Kg</p>
						<p className="text-gray-600">Price: ₹{stock.price} per Kg</p>
						<p className="text-gray-600">Date: {new Date(stock.date).toLocaleDateString()}</p>
						<button
							onClick={() => handleEdit(stock)}
							className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
						>
							Edit
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
