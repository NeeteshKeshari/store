"use client"
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import Link from 'next/link';
import Loading from '@/app/components/Loading';

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
		return sales.reduce((total, sale) => {
			const totalPaidForSale = sale.amountPaid.reduce((sum, payment) => sum + payment.amount, 0);
			return total + totalPaidForSale;
		}, 0);
	};

	const calculateTotalManufacturingCost = () => {
		return manufacturing.reduce((total, item) => {
			const product = products.find(prod => prod.selectedProduct === item.productName);
			const soldItemCount = sales.find(saleItem => saleItem.product === item.productName);
			console.log(total + (product ? soldItemCount.quantity : 0) + (product ? product.packingCharge * soldItemCount.quantity : 0) + (product ? product.pisaiCharge * soldItemCount.quantity : 0) + (product ? product.pouchCharge * soldItemCount.quantity : 0) + (product ? product.actualCost * soldItemCount.quantity : 0) + (product ? (product.transportCharge) / 100 * soldItemCount.quantity : 0))
			return total + (product ? product.packingCharge * soldItemCount?.quantity : 0) + (product ? product.pisaiCharge * soldItemCount?.quantity : 0) + (product ? product.pouchCharge * soldItemCount?.quantity : 0) + (product ? product.actualCost * soldItemCount?.quantity : 0) + (product ? (product.transportCharge) / 100 * soldItemCount?.quantity : 0);
		}, 0);
	};

	const calculateRemainingStock = () => {
		return products.map(product => {
			const totalSold = sales
				.filter(sale => sale.product === product.selectedProduct)
				.reduce((total, sale) => total + sale.quantity, 0);

			const remainingQuantity = product.quantity;

			return {
				selectedProduct: product.selectedProduct,
				remainingQuantity
			};
		});
	};

	const calculateTotalIncome = () => {
		const totalSales = calculateTotalSales();
		const totalManufacturingCost = calculateTotalManufacturingCost();
		console.log(totalSales, totalManufacturingCost)
		if (totalSales === 0) {
			return 'No Sell';
		}
		return totalSales - totalManufacturingCost;
	};

	const calculateProfitOrLoss = () => {
		const totalIncome = calculateTotalIncome();
		if (totalIncome === 'No Sell') {
			return 'No Sell';
		} else {
			return totalIncome > 0 ? 'Profit' : 'Loss';
		}
	};

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="flex flex-col h-full items-center justify-center bg-gray-100">
			<div className="w-full bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl font-bold text-center">Summary</h2>
				<div className="w-1/4 -mt-[27px]">
					<Link href="/admin/dashboard" className="text-xs border border-gray-500 p-1 px-2 rounded-md hover:border-blue-600 hover:text-blue-600">Back</Link>
				</div>
				<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
					<div className="bg-white border-l-8 border-t border-t-gray-100 border-gray-500 p-4 rounded-lg flex flex-col justify-start shadow-md relative">
						<div className="text-lg font-semibold mb-2">Total Sales</div>
						<div className="text-2xl font-bold">₹{calculateTotalSales()}</div>
					</div>
					<div className="bg-white border-l-8 border-t border-t-gray-100 border-blue-500 p-4 rounded-lg flex flex-col justify-start shadow-md relative">
						<div className="text-lg font-semibold mb-2">Total Paid</div>
						<div className="text-2xl font-bold">₹{calculateTotalPaid()}</div>
					</div>
					<div className="bg-white border-l-8 border-t border-t-gray-100 border-red-500 p-4 rounded-lg flex flex-col justify-start shadow-md relative">
						<div className="text-lg font-semibold mb-2">Total Due</div>
						<div className="text-2xl font-bold">₹{calculateTotalDue()}</div>
					</div>
					<div className="bg-white border-l-8 border-t border-t-gray-100 border-green-500 p-4 rounded-lg flex flex-col justify-start shadow-md relative">
						<div className="text-lg font-semibold mb-2">Total Income</div>
						<div className="text-2xl font-bold">₹{calculateTotalIncome()}</div>
					</div>
					{calculateProfitOrLoss() === 'Profit' ?
						<div className="p-4 bg-green-500 text-white font-bold text-2xl text-center rounded-lg shadow-md relative">{`You are in: ${calculateProfitOrLoss()}`}</div>
						: <>
							{calculateProfitOrLoss() === 'No Sell' ?
								<div className="p-4 bg-gray-500 text-white font-bold text-2xl text-center rounded-lg shadow-md relative">{`${calculateProfitOrLoss()}`}</div>
								:
								<div className="p-4 bg-red-500 text-white font-bold text-2xl text-center rounded-lg shadow-md relative">{`You are in: ${calculateProfitOrLoss()}`}</div>

							}
						</>

					}

				</div>

				<div className="mt-10 pt-10 border-t border-gray-300">
					<h2 className="text-2xl font-bold text-center">Stock</h2>
					<div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
						{calculateRemainingStock().map(stock => (
							<div
								key={stock.selectedProduct}
								className={`border-l-8 border-t border-t-gray-100 border-gray-500 p-4 rounded-lg flex flex-col justify-start shadow-md relative ${stock.remainingQuantity === 0 ? 'bg-red-500 text-white' : 'bg-white'}`}
							>
								<div className="text-lg font-semibold mb-2">{stock.selectedProduct}</div>
								<div className="text-2xl font-bold">{stock.remainingQuantity === 0 ? 'Out of stock' : `${stock.remainingQuantity} Kg`}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default StockManagementDashboard;
