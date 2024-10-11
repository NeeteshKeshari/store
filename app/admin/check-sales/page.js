"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from 'next/link';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function SalesPage() {
    const [product, setProduct] = useState("Besan");
    const [quantity, setQuantity] = useState("");
    const [cost, setCost] = useState("");
    const [date, setDate] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [amountPaid, setAmountPaid] = useState("");
    const [amountDue, setAmountDue] = useState("");
    const [totalDue, setTotalDue] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isCalculated, setIsCalculated] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [newCustomer, setNewCustomer] = useState(false);
    const [sales, setSales] = useState([]);
    const [editingSaleId, setEditingSaleId] = useState(null);
    const [totalTotalDue, setTotalTotalDue] = useState(0);
    const [totalAmountPaid, setTotalAmountPaid] = useState(0);
    const [totalAmountDue, setTotalAmountDue] = useState(0);

    useEffect(() => {
        async function fetchCustomers() {
            try {
                const response = await axios.get(`${apiUrl}/api/customers`);
                const formattedCustomers = response.data.map((customer) => ({
                    id: customer._id,
                    name: customer.customerName,
                    address: customer.customerAddress,
                }));
                setCustomers(formattedCustomers);
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        }

        async function fetchSales() {
            try {
                const response = await axios.get("https://stock-node-55ci.onrender.com/api/sales");
                setSales(response.data);
            } catch (error) {
                console.error("Error fetching sales:", error);
            }
        }

        fetchCustomers();
        fetchSales();
    }, []);

    useEffect(() => {
        // Calculate total amounts whenever sales data changes
        const totalDueSum = sales.reduce((acc, sale) => acc + parseFloat(sale.totalDue || 0), 0);
        const totalPaidSum = sales.reduce((acc, sale) => acc + parseFloat(sale.amountPaid || 0), 0);
        const totalAmountDueSum = sales.reduce((acc, sale) => acc + parseFloat(sale.amountDue || 0), 0);

        setTotalTotalDue(totalDueSum.toFixed(2));
        setTotalAmountPaid(totalPaidSum.toFixed(2));
        setTotalAmountDue(totalAmountDueSum.toFixed(2));
    }, [sales]);

    const handleCustomerChange = (e) => {
        const selected = e.target.value;
        if (selected === "addNew") {
            setNewCustomer(true);
            setCustomerName("");
            setCustomerAddress("");
        } else {
            setNewCustomer(false);
            setSelectedCustomer(selected);
            const selectedCustomerData = customers.find((customer) => customer.id === selected);
            if (selectedCustomerData) {
                setCustomerName(selectedCustomerData.name);
                setCustomerAddress(selectedCustomerData.address);
            }
        }
    };

    const handleCalculateTotal = () => {
        setError("");
        if (!quantity || !cost || isNaN(quantity) || isNaN(cost) || quantity <= 0 || cost <= 0) {
            setError("Please enter valid Quantity and Cost.");
            return;
        }

        const total = parseFloat(quantity) * parseFloat(cost);
        const due = total - parseFloat(amountPaid || 0);
        setTotalDue(total.toFixed(2));
        setAmountDue(due.toFixed(2));
        setIsCalculated(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!isCalculated) {
            setError("Please calculate the total before submitting.");
            return;
        }

        try {
            const payload = {
                product,
                quantity,
                cost,
                date: new Date().toISOString(),
                customerName,
                customerAddress,
                amountPaid,
                amountDue,
                totalDue,
            };

            let res;
            if (editingSaleId) {
                res = await axios.put(`https://stock-node-55ci.onrender.com/api/sales/${editingSaleId}`, payload);
                if (res.status === 200) {
                    setSales((prevSales) =>
                        prevSales.map((sale) =>
                            sale._id === editingSaleId ? { ...res.data } : sale
                        )
                    );
                    setSuccess("Sale record updated successfully!");
                }
            } else {
                res = await axios.post("https://stock-node-55ci.onrender.com/api/sales", payload);
                if (res.status === 201) {
                    setSales((prevSales) => [...prevSales, res.data]);
                    setSuccess("Sale record added successfully!");
                }
            }

            resetForm();
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    const handleEdit = (sale) => {
        setProduct(sale.product);
        setQuantity(sale.quantity);
        setCost(sale.cost);
        setDate(sale.date);
        setCustomerName(sale.customerName);
        setCustomerAddress(sale.customerAddress);
        setAmountPaid(sale.amountPaid);
        setTotalDue(sale.totalDue);
        setAmountDue(sale.amountDue);
        setIsCalculated(true);
        setEditingSaleId(sale._id);
    };

    const resetForm = () => {
        setProduct("Besan");
        setQuantity("");
        setCost("");
        setDate("");
        setCustomerName("");
        setCustomerAddress("");
        setAmountPaid("");
        setAmountDue("");
        setTotalDue("");
        setIsCalculated(false);
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
							{editingSaleId ? "Update Sales" : "Add Sales"}
						</h2>
					</div>
					<div className='w-1/4'></div>
				</div>
                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                        <label className="block text-gray-700">Select Product</label>
                        <select
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            <option value="Besan">Besan</option>
                            <option value="Sooji">Sooji</option>
                            <option value="Maida">Maida</option>
                            <option value="Daliya">Daliya</option>
                            <option value="Bhura">Bhura</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Select Customer</label>
                        <select
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            value={selectedCustomer}
                            onChange={handleCustomerChange}
                        >
                            <option value="">Select Customer</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                            <option value="addNew">Add New Customer</option>
                        </select>
                    </div>
                    {newCustomer && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">New Customer Name</label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    placeholder="Enter customer name"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">New Customer Address</label>
                                <input
                                    type="text"
                                    value={customerAddress}
                                    onChange={(e) => setCustomerAddress(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    placeholder="Enter customer address"
                                    required
                                />
                            </div>
                        </>
                    )}
                    {!newCustomer && (
                        <input
                            type="text"
                            placeholder="Customer Address"
                            value={customerAddress}
                            readOnly
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                        />
                    )}
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
                        <label className="block text-gray-700">Cost (per Kg)</label>
                        <input
                            type="number"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
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
                    <div>
                        <label className="block text-gray-700">Amount Paid</label>
                        <input
                            type="number"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Total Amount</label>
                        <input
                            type="text"
                            value={totalDue}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Amount Due</label>
                        <input
                            type="text"
                            value={amountDue}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleCalculateTotal}
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        Calculate Total
                    </button>
                    <button
                        type="submit"
                        disabled={!isCalculated}
                        className={`w-full bg-blue-500 text-white py-2 rounded-lg transition ${!isCalculated ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
                    >
                        {editingSaleId ? "Update Sale" : "Add Sale"}
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
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {success && <p className="text-green-500 mt-2">{success}</p>}
                </form>
            </div>

            {/* Sales List */}
            <div className="w-full max-w-4xl mt-8">
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Sales Summary</h3>
                    <div className="flex flex-col sm:flex-row justify-between mt-4">
                        <p className="text-gray-600">Total TotalDue: <span className="font-semibold">₹{totalTotalDue}</span></p>
                        <p className="text-gray-600">Total Amount Paid: <span className="font-semibold">₹{totalAmountPaid}</span></p>
                        <p className="text-gray-600">Total Amount Due: <span className="font-semibold">₹{totalAmountDue}</span></p>
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Sales Records</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sales && sales.map((sale) => (
                        <div key={sale._id} className="bg-white p-4 rounded-lg shadow-md">
                            <h4 className="text-lg font-semibold">{sale.product}</h4>
                            <p>Quantity: {sale.quantity} Kg</p>
                            <p>Cost: {sale.cost} per Kg</p>
                            <p>Total: {sale.totalDue}</p>
                            <p>Amount Paid: {sale.amountPaid}</p>
                            <p>Amount Due: {sale.amountDue}</p>
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
    );
}
