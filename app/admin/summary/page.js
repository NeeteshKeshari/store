"use client"
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const StockManagementDashboard = () => {
	const [products, setProducts] = useState([]);
	const [sales, setSales] = useState([]);
	const [manufacturing, setManufacturing] = useState([]);
	const [loading, setLoading] = useState(true);
	

	useEffect(() => {
		const fetchData = async () => {
			try {
				const productsRes = await fetch(`${apiUrl}/api/products`, {
					headers: {
						"Authorization": `Bearer ${Cookies.get('authToken')}`
					}
				});
				const salesRes = await fetch(`${apiUrl}/api/sales`, {
					headers: {
						"Authorization": `Bearer ${Cookies.get('authToken')}`
					}
				});
				const manufacturingRes = await fetch(`${apiUrl}/api/entry`, {
					headers: {
						"Authorization": `Bearer ${Cookies.get('authToken')}`
					}
				});

				const productsData = await productsRes.json();
				const salesData = await salesRes.json();
				const manufacturingData = await manufacturingRes.json();

				setProducts(productsData);
				setSales(salesData);
				setManufacturing(manufacturingData);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching data:', error);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const calculateTotalSales = () => {
		return sales.reduce((total, sale) => total + sale.cost * sale.quantity, 0);
	};

	const calculateTotalDue = () => {
		return sales.reduce((total, sale) => total + sale.amountDue, 0);
	};

	const calculateTotalPaid = () => {
		return sales.reduce((total, sale) => total + sale.amountPaid, 0);
	};

	const calculateTotalManufacturingCost = () => {
		return manufacturing.reduce((total, item) => {
			const product = products.find(prod => prod.selectedProduct === item.productName);
			const soldItemCount = sales.find(saleItem => saleItem.product === item.productName);
			console.log(soldItemCount)
			console.log(total + (product ? soldItemCount.quantity : 0) + (product ? product.packingCharge * soldItemCount.quantity : 0) + (product ? product.pisaiCharge * soldItemCount.quantity : 0) + (product ? product.pouchCharge * soldItemCount.quantity : 0) + (product ? product.actualCost * soldItemCount.quantity : 0) + (product ? (product.transportCharge) / 100 * soldItemCount.quantity : 0))
			return total + (product ? product.packingCharge * soldItemCount.quantity : 0) + (product ? product.pisaiCharge * soldItemCount.quantity : 0) + (product ? product.pouchCharge * soldItemCount.quantity : 0) + (product ? product.actualCost * soldItemCount.quantity : 0) + (product ? (product.transportCharge) / 100 * soldItemCount.quantity : 0);
		}, 0);
	};

	const calculateRemainingStock = () => {
		return products.map(product => {
			const totalSold = sales
				.filter(sale => sale.product === product.selectedProduct)
				.reduce((total, sale) => total + sale.quantity, 0);

			const remainingQuantity = product.quantity - totalSold;

			return {
				selectedProduct: product.selectedProduct,
				remainingQuantity
			};
		});
	};

	const calculateTotalIncome = () => {
		const totalSales = calculateTotalSales();
		const totalManufacturingCost = calculateTotalManufacturingCost();
		return totalSales - totalManufacturingCost;
	};

	const calculateProfitOrLoss = () => {
		const totalIncome = calculateTotalIncome();
		return totalIncome > 0 ? 'Profit' : 'Loss';
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold">Stock Management Dashboard</h2>

			<div className="mt-4">
				<h3 className="text-xl">Total Sales: ₹{calculateTotalSales()}</h3>
				<h3 className="text-lg">Total Paid: ₹{calculateTotalPaid()}</h3>
				<h3 className="text-lg">Total Due: ₹{calculateTotalDue()}</h3>
				<h3 className="text-xl mt-5">Total Income: ₹{calculateTotalIncome()}</h3>
				<h3 className="text-xl mt-5">{`You are in: ${calculateProfitOrLoss()}`}</h3>
			</div>

			<div className="mt-4">
				<h3 className="text-xl font-bold">Remaining Stock</h3>
				<ul>
					{calculateRemainingStock().map(stock => (
						<li key={stock.selectedProduct}>
							{stock.selectedProduct}: {stock.remainingQuantity} kg
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default StockManagementDashboard;
