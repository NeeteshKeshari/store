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
        console.log(id)
        setPdfLoadingId(id)
        const doc = new jsPDF();
        filteredSalesNew.filter((ids => ids._id === id)).forEach((sale, index) => {
            const startingY = 10 + index * 90; // Adjust starting Y based on index
            // Get the page width to calculate the center
            const pageWidth = doc.internal.pageSize.getWidth();
            const imageWidth = 30; // Width of the image
            const centerX = (pageWidth - imageWidth) / 2;

            // Centering the "Aarika Gold Receipt" text
            const receiptText = '|| Aarika Gold Receipt ||';
            const textWidth = doc.getTextWidth(receiptText);
            const centerXText = (pageWidth - textWidth) / 2;

            doc.addImage(logoBase64, 'PNG', centerX, startingY, imageWidth, 40);
            doc.text(receiptText, centerXText, startingY + 50);
            doc.text('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=', 10, startingY + 60);
            doc.text(`Billing Date: ${new Date(sale.date).toLocaleDateString('en-GB')}`, 10, startingY + 70);
            doc.text(`Customer: ${sale.customerName}`, 10, startingY + 80);
            doc.text(`Address: ${sale.customerAddress}`, 10, startingY + 90);
            doc.text('.............................', 10, startingY + 100);
            doc.text(`Product: ${sale.product}`, 10, startingY + 110);
            doc.text(`Quantity: ${sale.quantity} Kg`, 10, startingY + 120);
            doc.text(`Price: ${sale.cost}/- per Kg`, 10, startingY + 130);
            doc.text(`Total: ${sale.totalDue}/-`, 10, startingY + 140);
            doc.text('.............................', 10, startingY + 150);
            // Adding payment records
            doc.text('Payments:', 10, startingY + 160);
            sale.amountPaid.forEach((payment, paymentIndex) => {
                const paymentY = startingY + 170 + paymentIndex * 10;
                doc.text(`${paymentIndex + 1})- ${payment.amount}/- on ${new Date(payment.date).toLocaleDateString('en-GB')}`, 10, paymentY);
            });
            // Separator between each sale
            doc.text('.............................', 10, startingY + 170 + sale.amountPaid.length * 10);
            doc.setFontSize(18);
            doc.text(`Amount Due: ${sale.amountDue}/-`, 10, startingY + 180 + sale.amountPaid.length * 10);


        });

        const pdfBlob = doc.output('blob');

        const url = URL.createObjectURL(pdfBlob);
        // console.log(url)
        setPdfUrl(url); // Set the generated PDF URL for download
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
                            <h4 className="text-lg font-semibold">Customer: {sale.customerName}</h4>
                            <p>Product: {sale.product}</p>
                            <p>Quantity: {sale.quantity} Kg</p>
                            <p>Cost: ₹{sale.cost} per Kg</p>
                            <p>Total: ₹{sale.totalDue}</p>
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
                                                <td className='border p-1 border-slate-300'>₹{item.amount}</td>
                                                <td className='border p-1 border-slate-300'>{new Date(item.date).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </p>
                            <h4 className="text-lg font-semibold">Amount Due: ₹{sale.amountDue}</h4>
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
                                        {/* <QRCodeSVG value={pdfUrl} size={256} /> */}
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