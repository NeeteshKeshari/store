"use client";
import { useState, useEffect } from "react";
import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import Link from 'next/link';

export default function ProductPage() {
	const [selectedProduct, setSelectedProduct] = useState("Besan");
	const [quantity, setQuantity] = useState("");
	const [actualCost, setActualCost] = useState("");
	const [sellingCost, setSellingCost] = useState("");
	const [date, setDate] = useState("");
	const [packingCharge, setPackingCharge] = useState("");
	const [pouchCharge, setPouchCharge] = useState("");
	const [transportCharge, setTransportCharge] = useState("");
	const [extraCharge, setExtraCharge] = useState("");
	const [pisaiCharge, setPisaiCharge] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [sales, setSales] = useState([]);
	const [editingSaleId, setEditingSaleId] = useState(null);

	useEffect(() => {
		async function fetchSales() {
			try {
				const response = await axios.get(`${apiUrl}/api/products`);
				setSales(response.data);
			} catch (error) {
				console.error("Error fetching sales:", error);
			}
		}
		fetchSales();
	}, []);


	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		try {
			const payload = {
				selectedProduct,
				quantity,
				actualCost,
				sellingCost,
				date: new Date().toISOString(),
				packingCharge,
				pouchCharge,
				transportCharge,
				extraCharge,
				pisaiCharge,
			};

			let res;
			if (editingSaleId) {
				res = await axios.put(`https://stock-node-55ci.onrender.com/api/products/${editingSaleId}`, payload);
				if (res.status === 200) {
					setSales((prevSales) =>
						prevSales.map((sale) =>
							sale._id === editingSaleId ? { ...res.data } : sale
						)
					);
					setSuccess("Product record updated successfully!");
				}
			} else {
				res = await axios.post("https://stock-node-55ci.onrender.com/api/products", payload);
				if (res.status === 201) {
					setSales((prevSales) => [...prevSales, res.data]);
					setSuccess("Product record added successfully!");
				}
			}

			resetForm();
		} catch (err) {
			setError("An error occurred. Please try again.");
		}
	};

	const handleEdit = (sale) => {
		setSelectedProduct(sale.selectedProduct);
		setQuantity(sale.quantity);
		setActualCost(sale.actualCost);
		setSellingCost(sale.sellingCost);
		setDate(sale.date);
		setPackingCharge(sale.packingCharge);
		setPouchCharge(sale.pouchCharge);
		setTransportCharge(sale.transportCharge);
		setExtraCharge(sale.extraCharge);
		setPisaiCharge(sale.pisaiCharge);
		setEditingSaleId(sale._id);
	};

	const resetForm = () => {
		setSelectedProduct("Besan");
		setQuantity("");
		setActualCost("");
		setSellingCost("");
		setDate("");
		setPackingCharge("");
		setPouchCharge("");
		setTransportCharge("");
		setExtraCharge("");
		setPisaiCharge("");
		setEditingSaleId(null);
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
			<div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
				<div className='flex flex-row items-start'>
					<div className='w-1/4 mt-1'>
						<Link href='/admin/dashboard' className='text-xs border border-gray-500 p-1 px-2 rounded-md hover:border-blue-600 hover:text-blue-600'>Back</Link>
					</div>
					<div className='w-1/2'>
						<h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
							{editingSaleId ? "Update Product" : "Add Product"}
						</h2>
					</div>
					<div className='w-1/4'></div>
				</div>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-gray-700">Product</label>
						<select
							value={selectedProduct}
							onChange={(e) => setSelectedProduct(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
						>
							<option value="Besan">Besan</option>
							<option value="Sooji">Sooji</option>
							<option value="Maida">Maida</option>
							<option value="Daliya">Daliya</option>
							<option value="Bhura">Bhura</option>
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
						<label className="block text-gray-700">Actual Cost (per Kg)</label>
						<input
							type="number"
							value={actualCost}
							onChange={(e) => setActualCost(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
						/>
					</div>
					<div>
						<label className="block text-gray-700">Selling Cost (per Kg)</label>
						<input
							type="number"
							value={sellingCost}
							onChange={(e) => setSellingCost(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
						/>
					</div>
					<div>
						<label className="block text-gray-700">Packing Charge</label>
						<input
							type="number"
							value={packingCharge}
							onChange={(e) => setPackingCharge(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
						/>
					</div>
					<div>
						<label className="block text-gray-700">Pouch Charge</label>
						<input
							type="number"
							value={pouchCharge}
							onChange={(e) => setPouchCharge(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
						/>
					</div>
					<div>
						<label className="block text-gray-700">Transport Charge</label>
						<input
							type="number"
							value={transportCharge}
							onChange={(e) => setTransportCharge(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
						/>
					</div>
					<div>
						<label className="block text-gray-700">Extra Charge</label>
						<input
							type="number"
							value={extraCharge}
							onChange={(e) => setExtraCharge(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
						/>
					</div>
					<div>
						<label className="block text-gray-700">Pisai Charge</label>
						<input
							type="number"
							value={pisaiCharge}
							onChange={(e) => setPisaiCharge(e.target.value)}
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
					<button
						type="submit"
						className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
					>
						{editingSaleId ? "Update" : "Add Sale"}
					</button>
					{editingSaleId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition mt-2"
                        >
                            Cancel
                        </button>
                    )}
				</form>

				{error && <p className="text-red-500 mt-4">{error}</p>}
				{success && <p className="text-green-500 mt-4">{success}</p>}
			</div>

			<div className="mt-8 w-full max-w-lg">
					<div className="">
						<h3 className="text-xl font-semibold text-gray-800 mb-4">Product Records</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{sales && sales.map((sale) => (
								<div key={sale._id} className="bg-white p-4 rounded-lg shadow-md">
									<h4 className="text-lg font-semibold">{sale.selectedProduct}</h4>
									<p>Quantity: {sale.quantity} Kg</p>
									<p>Actual Cost: {sale.actualCost} per Kg</p>
									<p>Selling Cost: {sale.sellingCost}</p>
									<p>Date: {new Date(sale.date).toLocaleDateString()}</p>
									<button
										onClick={() => handleEdit(sale)}
										className="mt-2 w-full bg-yellow-500 text-white py-1 rounded-lg hover:bg-yellow-600"
									>
										Edit
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
		</div>
	);
}
