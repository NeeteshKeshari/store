"use client";
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import Cookies from 'js-cookie';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import Image from 'next/image';
import binImage from '../../assets/bin.gif';
import { logoBase64 } from './base64Image';
// import { QRCodeSVG } from 'qrcode.react'; // Make sure to install qrcode.react using `npm install qrcode.react`

const SalesList = ({ filteredSalesNew, handleEdit, fetchSales }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pdfLoadingId, setPdfLoadingId] = useState(null);
    const generatePDF = (id) => {
        console.log(id);
        setPdfLoadingId(id);
        const doc = new jsPDF();
        const salesData = filteredSalesNew.find((sale) => sale._id === id);
    
        if (!salesData) {
            console.error("Sale not found!");
            return;
        }
    
        const pageWidth = doc.internal.pageSize.getWidth();
        const imageWidth = 30;
        const centerXImage = (pageWidth - imageWidth) / 2;
    
        const receiptText = 'Thank you for shopping with us!';
        const brandName = 'Aarika Gold Pvt. Ltd.';
        const brandAddress = 'Preetam Nagar Colony';
        const brandCityAddress = 'Prayagraj, 211011 (UP) India';
        const textWidth = doc.getTextWidth(receiptText);
        const text1Width = doc.getTextWidth(brandName);
        const text2Width = doc.getTextWidth(brandAddress);
        const text3Width = doc.getTextWidth(brandCityAddress);
        const centerXText = (pageWidth - textWidth) / 2;
        const centerX1Text = (pageWidth - text1Width) / 2;
        const centerX2Text = (pageWidth - text2Width) / 2;
        const centerX3Text = (pageWidth - text3Width) / 2;

    
        let currentY = 10;
    
        // Adding Logo
        doc.addImage(logoBase64, 'PNG', centerXImage, currentY, imageWidth, 40);
        currentY += 50;
    
        // Centered Receipt Header
        doc.text(brandName, centerX1Text, currentY);
        currentY += 7;
        doc.text(brandAddress, centerX2Text, currentY);
        currentY += 7;
        doc.text(brandCityAddress, centerX3Text, currentY);
        currentY += 10;
        doc.text('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=', 10, currentY);
        currentY += 10;
    
        // Sale Information
        doc.text(`Billing Date: ${new Date(salesData.date).toLocaleDateString('en-GB')}`, 10, currentY);
        currentY += 10;
        doc.text(`Customer: ${salesData.customerName}`, 10, currentY);
        currentY += 10;
        doc.text(`Address: ${salesData.customerAddress}`, 10, currentY);
        currentY += 10;
        doc.text('.............................', 10, currentY);
        currentY += 10;
    
        // Adding Products
        doc.text('Products:', 10, currentY);
        currentY += 10;
    
        salesData.productList.forEach((product, index) => {
            const total = product.quantity * product.cost; // Calculate total for each product
            doc.text(`${index + 1}) ${product.product} - Quantity: ${product.quantity}kg, Price: ${product.cost}/kg-, Total: ${total}/-`, 10, currentY);
            currentY += 10;
        });
    
        doc.text('.............................', 10, currentY);
        currentY += 10;
    
        // Adding Payment Records
        doc.text('Payments:', 10, currentY);
        currentY += 10;
        
        salesData.amountPaid.forEach((payment, index) => {
            doc.text(`${index + 1}) ${payment.amount}/- on ${new Date(payment.date).toLocaleDateString('en-GB')}`, 10, currentY);
            currentY += 10;
        });

        doc.text('.............................', 10, currentY);
        currentY += 10;

        doc.setFontSize(18);

        // Total Due Calculation
        doc.text(`Total Due: ${salesData.totalDue}/-`, 10, currentY);
        currentY += 10;
        doc.text(`Amount Due: ${salesData.amountDue}/-`, 10, currentY);
        currentY += 40;

        doc.text(receiptText, centerXText, currentY);
    
        // Generate and Set PDF URL
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
    
        // Print PDF directly
        // const printWindow = window.open(url);
        // if (printWindow) {
        //     printWindow.onload = () => {
        //         printWindow.print();
        //     };
        // }
    };

    const deleteSale = async (SaleID) => {
        console.log(SaleID)
        try {
            setLoading(SaleID);;
            const response = await fetch(`${apiUrl}/api/sales/${SaleID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${Cookies.get('authToken')}`
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Sale deleted successfully:", result);
                fetchSales()
                // Handle success (e.g., refresh the list of sales)
            } else {
                console.error("Failed to delete sale:", response.statusText);
            }
        } catch (error) {
            console.error("Error while deleting sale:", error);
        } finally {
            setLoading(null); // Stop the loader
        }
    };


    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-5 sm:m-0">
                {filteredSalesNew && filteredSalesNew.map((sale, index) => {
                    const fileName = `${sale.customerName}-${new Date(sale.date).toLocaleDateString('en-GB')}.pdf`;
                    return (
                        <div key={sale._id} className="bg-white p-4 rounded-lg shadow-md relative">
                            <button onClick={() => deleteSale(sale._id)} className='absolute right-4 top-4 bg-red-500 text-white font-bold text-center pb-[2px] w-[26px] rounded-full'>x</button>
                            {loading === sale._id &&
                                <div className='absolute top-0 left-0 rounded-lg flex h-full w-full items-center justify-center bg-white'>
                                    <Image
                                        src={binImage}
                                        width={150}
                                        height={190}
                                        alt="Remove Sale"
                                    />
                                </div>
                            }
                            <h4 className="text-lg font-semibold">Bill Date: {new Date(sale.date).toLocaleDateString()}</h4>
                            <h4 className="text-lg font-semibold">{sale.customerName} - {sale.customerAddress}</h4>

                            {/* Product List */}
                            <p className="font-semibold">Product Details:</p>
                            <table className="w-full text-sm mb-2 border-collapse border border-slate-400">
                                <thead>
                                    <tr>
                                        <th className="border p-1 border-slate-300 text-left">Product</th>
                                        <th className="border p-1 border-slate-300 text-left">Quantity (Kg)</th>
                                        <th className="border p-1 border-slate-300 text-left">Cost per Kg (₹)</th>
                                        <th className="border p-1 border-slate-300 text-left">Total Cost (₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sale.productList.map((product, index) => (
                                        <tr key={product._id}>
                                            <td className="border p-1 border-slate-300">{product.product}</td>
                                            <td className="border p-1 border-slate-300">{product.quantity}</td>
                                            <td className="border p-1 border-slate-300">₹{product.cost}</td>
                                            <td className="border p-1 border-slate-300">₹{product.quantity * product.cost}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Payment Record */}
                            <p className="font-semibold">Payment Record:</p>
                            {sale.amountPaid && sale.amountPaid.length > 0 ? (
                                <table className='border-collapse text-sm w-full mb-1 border border-slate-400'>
                                    <thead>
                                        <tr>
                                            <th className='border text-left p-1 border-slate-300'>Amount</th>
                                            <th className='border p-1 border-slate-300 text-left'>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sale.amountPaid.map((item, index) => (
                                            <tr key={index}>
                                                <td className='border p-1 border-slate-300'>₹{item.amount}</td>
                                                <td className='border p-1 border-slate-300'>{new Date(item.date).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-600">No Advance Payment</p>
                            )}

                            <h4 className="text-lg font-semibold">Total Amount Paid: ₹{sale.amountPaid.reduce((acc, payment) => acc + payment.amount, 0)}</h4>

                            <h4 className="text-lg font-semibold">Amount Due: ₹{sale.totalDue}</h4>

                            <button
                                onClick={() => handleEdit(sale)}
                                className="mt-2 w-full bg-yellow-500 text-white py-1 rounded-lg hover:bg-yellow-600"
                            >
                                Edit
                            </button>

                            <div className='flex flex-col'>
                                <button
                                    onClick={() => generatePDF(sale._id)}
                                    className="mt-2 w-full bg-blue-500 text-white py-1 rounded-lg hover:bg-blue-600"
                                >
                                    Generate Bill
                                </button>
                                {pdfUrl && pdfLoadingId === sale._id && (
                                    <div className="">
                                        <a href={pdfUrl} download={fileName} onClick={() => setPdfLoadingId(null)} className="mt-2 w-full block text-center bg-green-500 text-white py-1 rounded-lg hover:bg-green-600">
                                            Download Bill
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

            </div>


        </div>
    );
};

export default SalesList;