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
    const [amountPaid, setAmountPaid] = useState([{ amount: "", date: "" }]);
    const [amountDue, setAmountDue] = useState("");
    const [totalDue, setTotalDue] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isCalculated, setIsCalculated] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [newCustomer, setNewCustomer] = useState(false);
    const [editingSaleId, setEditingSaleId] = useState(null);
    const [salesNew, setSalesNew] = useState([]);
    const [filteredSalesNew, setFilteredSalesNew] = useState([]);
    const [customersNew, setCustomersNew] = useState([]);
    const [selectedCustomerNew, setSelectedCustomerNew] = useState('All');
    const [totalPaidNew, setTotalPaidNew] = useState(0);
    const [totalDueNew, setTotalDueNew] = useState(0);
    const [totalOverallDueNew, setTotalOverallDueNew] = useState(0);


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
            const data = response.data;

            // Get unique customers and their addresses
            const uniqueCustomers = [...new Set(data.map(sale => sale.customerName))]
                .map(name => {
                    const { customerAddress } = data.find(sale => sale.customerName === name);
                    return { name, address: customerAddress };
                });
            setCustomersNew(uniqueCustomers);
            setSalesNew(data);
            setFilteredSalesNew(data);
            calculateTotals(data);
        } catch (error) {
            console.error("Error fetching sales:", error);
        }
    }

    useEffect(() => {
        fetchCustomers();
        fetchSales();
    }, []);

    const handlePaymentChange = (index, field, value) => {
        const updatedPayments = [...amountPaid];
        if (updatedPayments[index]) {
            updatedPayments[index][field] = value;
            setAmountPaid(updatedPayments);
        }
    };

    const addPayment = () => {
        setAmountPaid([...amountPaid, { amount: "", date: "" }]);
    };

    const removePayment = (index) => {
        const updatedPayments = amountPaid.filter((_, i) => i !== index);
        setAmountPaid(updatedPayments.length > 0 ? updatedPayments : [{ amount: "", date: "" }]);
    };

    const calculateTotals = (salesData) => {
        const totalDue = salesData.reduce((acc, sale) => acc + sale.amountDue, 0);
        const totalOverallDue = salesData.reduce((acc, sale) => acc + sale.totalDue, 0);
        const totalPaid = salesData.reduce((acc, sale) => {
            const totalAmountForSale = sale.amountPaid.reduce((sum, payment) => sum + payment.amount, 0);
            return acc + totalAmountForSale;
        }, 0);

        setTotalPaidNew(totalPaid);
        setTotalDueNew(totalDue);
        setTotalOverallDueNew(totalOverallDue);
    };

    const handleCustomerChangeNew = (event) => {
        const selectedCustomerName = event.target.value;
        setSelectedCustomerNew(selectedCustomerName);

        if (selectedCustomerName === 'All') {
            // Show all sales if "All" is selected
            setFilteredSalesNew(salesNew);
            calculateTotals(salesNew);
        } else {
            // Filter sales by selected customer name
            const customerSales = salesNew.filter(sale => sale.customerName === selectedCustomerName);
            setFilteredSalesNew(customerSales);
            calculateTotals(customerSales);
        }
    };

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
        const totalPaid = amountPaid.reduce((acc, payment) => acc + parseFloat(payment.amount || 0), 0);
        const due = total - totalPaid;
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
                    setSalesNew((prevSales) =>
                        prevSales.map((sale) =>
                            sale._id === editingSaleId ? { ...res.data } : sale
                        )
                    );
                    setSuccess("Sale record updated successfully!");
                    fetchSales();
                }
            } else {
                console.log(payload)
                res = await axios.post("https://stock-node-55ci.onrender.com/api/sales", payload);
                if (res.status === 201) {
                    setSalesNew((prevSales) => [...prevSales, res.data]);
                    setSuccess("Sale record added successfully!");
                    fetchSales();
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
        const formattedDate = new Date(sale.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        // Update the state
        setDate(formattedDate);
        setCustomerName(sale.customerName);
        setCustomerAddress(sale.customerAddress);
        setAmountPaid(sale.amountPaid || [{ amount: "", date: "" }]); // Ensure it uses the existing data or a default value
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
        setAmountPaid([{ amount: "", date: "" }]);
        setAmountDue("");
        setTotalDue("");
        setIsCalculated(false);
        setEditingSaleId(null);
    };

    return (
        <div className="min-h-screen py-10 flex flex-col items-center justify-center bg-gray-100">
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
                            {customers && customers.map((customer) => (
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
                        <label className="block text-gray-700">Payments</label>
                        {amountPaid && amountPaid.map((payment, index) => (
                            <div key={index} className="flex space-x-2 mb-2">
                                <input
                                    type="number"
                                    value={payment.amount}
                                    onChange={(e) => handlePaymentChange(index, "amount", e.target.value)}
                                    placeholder="Amount"
                                    className="w-[44%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    required
                                />
                                <input
                                    type="date"
                                    value={payment.date}
                                    onChange={(e) => handlePaymentChange(index, "date", e.target.value)}
                                    className="w-[44%] w- px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    required
                                />
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removePayment(index)}
                                        className="text-white bg-red-500 hover:bg-red-700 w-[40px] cursor-pointer h-[40px] mt-[2px] rounded text-lg font-bold"
                                    >
                                        x
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addPayment}
                            className="text-blue-500 mt-2"
                        >
                            Add More Payment
                        </button>
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
                    <div className="flex flex-col sm:flex-row justify-between mt-4 text-xl">
                        <p className="text-gray-600">Total: <span className="font-semibold">₹{totalOverallDueNew}</span></p>
                        <p className="text-gray-600">Amount Paid: <span className="font-semibold">₹{totalPaidNew}</span></p>
                        <p className="text-gray-600">Amount Due: <span className="font-semibold">₹{totalDueNew}</span></p>
                    </div>
                </div>
                <h3 className="text-xl font-semibold px-4 md:px-0 text-gray-800 mb-4">Sales Records</h3>

                <div className="mb-4 mx-4 md:mx-0">
                    <label htmlFor="customerSelect" className="block font-bold text-sm text-gray-700">
                        Select Customer:
                    </label>
                    <select
                        id="customerSelect"
                        className="mt-1 block w-full sm:w-1/2 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md"
                        value={selectedCustomerNew || ''}
                        onChange={handleCustomerChangeNew}
                    >
                        <option value="" disabled>Select a customer</option>
                        <option value="All">All</option>
                        {customersNew && customersNew.map((customer) => (
                            <option key={customer.name} value={customer.name}>
                                {customer.name} - {customer.address}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSalesNew && filteredSalesNew.map((sale) => (
                        <div key={sale._id} className="bg-white p-4 rounded-lg shadow-md">
                            <h4 className="text-lg font-semibold">{sale.product}</h4>
                            <p>Customer: {sale.customerName}</p>
                            <p>Quantity: {sale.quantity} Kg</p>
                            <p>Cost: {sale.cost} per Kg</p>
                            <p>Total: {sale.totalDue}</p>
                            <p>Payment Record:
                                <table className='border-collapse text-sm w-full mb-1 border border-slate-400'>
                                    <thead>
                                        <tr>
                                            <th className='border text-left p-1 border-slate-300'>Amount</th>
                                            <th className='border p-1 border-slate-300 text-left'>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sale.amountPaid && sale.amountPaid.map((item, index) => (

                                            <tr key={index}>
                                                <td className='border p-1 border-slate-300'>{item.amount}</td>
                                                <td className='border p-1 border-slate-300'>{new Date(item.date).toLocaleDateString()}</td>
                                            </tr>

                                        ))}
                                    </tbody>
                                </table>
                            </p>
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
