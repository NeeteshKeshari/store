"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from 'next/link';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import Cookies from 'js-cookie';
import SalesList from "@/app/components/SalesList";

export default function SalesPage() {
    const [product, setProduct] = useState("");
    const [productList, setProductList] = useState([]);
    const [quantity, setQuantity] = useState("");
    const [quantityTotal, setQuantityTotal] = useState("");
    const [productId, setProductId] = useState("");
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
            const response = await axios.get(`${apiUrl}/api/customers`, {
                headers: {
                    "Authorization": `Bearer ${Cookies.get('authToken')}`
                }
            });
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
            const response = await axios.get(`${apiUrl}/api/sales`, {
                headers: {
                    "Authorization": `Bearer ${Cookies.get('authToken')}`
                }
            });
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

    const handleCustomerFilter = (event) => {
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

    const [producList, setProducList] = useState([{ product: '', productId: '', quantity: '', cost: '', totalQuantity: '' }]);

    // Function to handle product selection and auto-fill total quantity and cost
    const handleProductChange = (index, selectedProductName) => {
        const selectedProduct = productList.find(product => product.selectedProduct === selectedProductName);
        const updatedProductList = [...producList];
        updatedProductList[index].product = selectedProductName;
        updatedProductList[index].totalQuantity = selectedProduct.quantity;
        updatedProductList[index].cost = selectedProduct.sellingCost;
        updatedProductList[index].productId = selectedProduct._id;
        setProducList(updatedProductList);
    };

    // Function to handle quantity change for a specific product
    const handleQuantityChange = (index, quantity) => {
        const updatedProductList = [...producList];
        updatedProductList[index].quantity = quantity;
        setProducList(updatedProductList);
    };

    // Function to add a new product entry to producList
    const addProduct = () => {
        setProducList([...producList, { product: '', quantity: '', productId: '', cost: '', totalQuantity: '' }]);
    };

    // Function to remove a specific product entry from producList
    const removeProduct = (index) => {
        const updatedProductList = producList.filter((_, i) => i !== index);
        setProducList(updatedProductList);
    };

    const [totalAmount, setTotalAmount] = useState(0);

    // Calculate total amount and total due
    const handleCalculateTotal = () => {
        setError("");
        // Calculate the total amount for all products
        const calculatedTotalAmount = producList.reduce((sum, item) => {
            return sum + (item.quantity * item.cost);
        }, 0);

        // Calculate the total payments made
        const totalPayments = amountPaid.reduce((sum, payment) => {
            return sum + parseFloat(payment.amount || 0);
        }, 0);

        // Calculate the total due
        const calculatedTotalDue = calculatedTotalAmount - totalPayments;

        // Set the total amount and total due states
        setTotalAmount(calculatedTotalAmount);
        setTotalDue(calculatedTotalDue);
        setIsCalculated(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Prepare the payload based on the requirements
        const payload = {
            producList: producList.map(item => ({
                product: item.product,
                productId: item.productId,
                quantity: item.quantity,
                cost: item.cost,
            })),
            date: new Date(date).toISOString(),
            customerName,
            customerAddress,
            amountPaid: amountPaid.map(payment => ({
                amount: parseFloat(payment.amount),
                date: new Date(payment.date).toISOString(),
                _id: payment._id || undefined,
            })),
            amountDue: totalAmount,
            totalDue: totalDue,
        };

        try {
            const response = await fetch(`${apiUrl}/api/sales`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${Cookies.get('authToken')}`
                },
                body: JSON.stringify(payload),
            });
    
            if (response.ok) {
                const data = await response.json();
                alert('Sale submitted successfully!');
                
                // Optional: Clear form state here if needed
                setProducList([]); // Clear product list if appropriate
                setDate('');
                setCustomerName('');
                setCustomerAddress('');
                setAmountPaid([{ amount: '', date: '' }]); // Reset to initial payment structure if desired
                setTotalDue(0);
                setAmountDue(0);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message || errorData);
                alert('Failed to submit sale. Please check your input.');
            }
        } catch (error) {
            console.error('Request error:', error);
            alert('An error occurred while submitting. Please try again later.');
        }
    };

    const handleEdit = (sale) => {
        // console.log(sale)
        setProduct(sale.product);
        setProductId(productId)
        setQuantity(sale.quantity);
        setCost(sale.cost);
        const formattedDate = new Date(sale.date).toISOString().split('T')[0];
        setDate(formattedDate);
        console.log(formattedDate)
        setCustomerName(sale.customerName);
        setCustomerAddress(sale.customerAddress);
        setAmountPaid(sale.amountPaid || [{ amount: "", date: "" }]); // Ensure it uses the existing data or a default value
        setTotalDue(sale.totalDue);
        setAmountDue(sale.amountDue);
        setIsCalculated(true);
        setEditingSaleId(sale._id);
    };

    const resetForm = () => {
        setProduct("Select Product");
        setQuantity("");
        setProductId("");
        setQuantityTotal("");
        setCost("");
        setDate("");
        setCustomerName("");
        setCustomerAddress("");
        setAmountPaid([{ amount: "", date: "" }]);
        setAmountDue("");
        setTotalDue("");
        setIsCalculated(false);
        setEditingSaleId(null);
        setError("");
        setSuccess("");
    };

    

// const handleCalculateTotal = () => {
//     setError("");
//     if (!quantity || !cost || isNaN(quantity) || isNaN(cost) || quantity <= 0 || cost <= 0) {
//         setError("Please enter valid Quantity and Cost.");
//         return;
//     }

//     const total = parseFloat(quantity) * parseFloat(cost);
//     const totalPaid = amountPaid.reduce((acc, payment) => acc + parseFloat(payment.amount || 0), 0);
//     const due = total - totalPaid;
//     setTotalDue(total.toFixed(2));
//     setAmountDue(due.toFixed(2));
//     setIsCalculated(true);
// };

    useEffect(() => {
        async function fetchSales() {
            try {
                const response = await axios.get(`${apiUrl}/api/products`, {
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('authToken')}`
                    }
                });
                setProductList(response.data);
            } catch (error) {
                console.error("Error fetching sales:", error);
            }
        }
        fetchSales();
    }, []);
    

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
                    {producList.map((productItem, index) => (
                        <div key={index} className="space-y-4 border-b p-4 rounded-md mb-4 bg-gray-200 relative">
                            <h3 className="font-semibold text-lg">Product {index + 1}</h3>

                            <div className='flex flex-row gap-x-4'>
                                {/* Product Name Dropdown */}
                                <div className='w-full'>
                                    <label className="block text-gray-700">Product Name</label>
                                    <select
                                        value={productItem.product}
                                        onChange={(e) => handleProductChange(index, e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Select a product</option>
                                        {productList.map((product) => (
                                            <option key={product._id} value={product.selectedProduct}>
                                                {product.selectedProduct}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Quantity Input */}
                                <div className='w-full'>
                                    <label className="block text-gray-700">Quantity (in Kg)</label>
                                    <input
                                        type="number"
                                        value={productItem.quantity}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                        placeholder="Enter quantity"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className='flex flex-row gap-x-4'>
                                {/* Total Quantity (Read-only) */}
                                <div className='w-full'>
                                    <label className="block text-gray-700">Total Quantity</label>
                                    <input
                                        type="number"
                                        value={productItem.totalQuantity}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-lg focus:outline-none"
                                    />
                                </div>

                                {/* Cost per Kg (Read-only, populated based on selected product) */}
                                <div className='w-full'>
                                    <label className="block text-gray-700">Cost (per Kg)</label>
                                    <input
                                        type="number"
                                        value={productItem.cost}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-lg focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Remove Product Button */}
                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeProduct(index)}
                                    className="text-white absolute right-4 top-0 bg-red-500 hover:bg-red-700 w-[40px] cursor-pointer h-[40px] mt-[2px] rounded text-lg font-bold"
                                >
                                    x
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Add Another Product Button */}
                    <button
                        type="button"
                        onClick={addProduct}
                        className="bg-green-500 px-2 py-1 rounded text-white hover:bg-green-700 mt-2"
                    >
                        Add Another Product
                    </button>

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
                        {amountPaid && amountPaid.map((payment, index) => {
                            // Check if the date is valid
                            const dateValue = payment.date ? new Date(payment.date) : null;
                            const formattedDate = dateValue && !isNaN(dateValue) ? dateValue.toISOString().split('T')[0] : '';

                            return (
                                <div key={index} className="flex space-x-2 mb-2">
                                    <div className='relative w-[44%]'>
                                        <div className='addRupee'>
                                            <input
                                                type="number"
                                                value={payment.amount}
                                                onChange={(e) => handlePaymentChange(index, "amount", e.target.value)}
                                                placeholder="Amount"
                                                className="w-full px-3 py-2 pl-6 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <input
                                        type="date"
                                        // Use the checked and formatted date
                                        value={formattedDate}
                                        onChange={(e) => handlePaymentChange(index, "date", e.target.value)}
                                        className="w-[44%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                            );
                        })}

                        <button
                            type="button"
                            onClick={addPayment}
                            className="text-blue-500 hover:text-blue-700 mt-2"
                        >
                            Add More Payment
                        </button>
                    </div>
                    <div className='flex flex-row gap-x-4'>
                        <div className='w-full'>
                            <label className="block text-gray-700">Total Amount</label>
                            <div className='relative'>
                                <div className='addRupee'>
                                    <input
                                        type="text"
                                        value={totalAmount}
                                        readOnly
                                        className="w-full px-3 py-2 pl-6 border border-gray-300 rounded-lg bg-gray-100"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='w-full'>
                            <label className="block text-gray-700">Amount Due</label>
                            <div className='relative'>
                                <div className='addRupee'>
                                    <input
                                        type="text"
                                        value={totalDue}
                                        readOnly
                                        className="w-full px-3 py-2 pl-6 border border-gray-300 rounded-lg bg-gray-100"
                                    />
                                </div>
                            </div>
                        </div>
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
                        onChange={handleCustomerFilter}
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

                <SalesList key={filteredSalesNew} filteredSalesNew={filteredSalesNew} handleEdit={handleEdit} fetchSales={fetchSales} />
            </div>
        </div>
    );
}
