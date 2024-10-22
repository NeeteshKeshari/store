"use client";
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import Cookies from 'js-cookie';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import Image from 'next/image';
import binImage from '../../assets/bin.gif';
// import { QRCodeSVG } from 'qrcode.react'; // Make sure to install qrcode.react using `npm install qrcode.react`

const SalesList = ({ filteredSalesNew, handleEdit, fetchSales }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const generatePDF = () => {
        const doc = new jsPDF();

        filteredSalesNew.forEach((sale, index) => {
            const startingY = 10 + index * 90; // Adjust starting Y based on index

            doc.text(`|| Aarika Gold Receipt ||`, 10, startingY);
            doc.text('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=', 10, startingY + 10);
            doc.text(`Billing Date: ${new Date(sale.date).toLocaleDateString('en-GB')}`, 10, startingY + 20);
            doc.text(`Customer: ${sale.customerName}`, 10, startingY + 30);
            doc.text(`Address: ${sale.customerAddress}`, 10, startingY + 40);
            doc.text('............................................................', 10, startingY + 50);
            doc.text(`Product: ${sale.product}`, 10, startingY + 60);
            doc.text(`Quantity: ${sale.quantity} Kg`, 10, startingY + 70);
            doc.text(`Price: ${sale.cost} rupees per Kg`, 10, startingY + 80);
            doc.text(`Total: ${sale.totalDue} rupees`, 10, startingY + 90);
            doc.text('............................................................', 10, startingY + 100);
            // Adding payment records
            doc.text('Payments:', 10, startingY + 110);
            sale.amountPaid.forEach((payment, paymentIndex) => {
                const paymentY = startingY + 120 + paymentIndex * 10;
                doc.text(`${paymentIndex + 1} - ${payment.amount} rupees on ${new Date(payment.date).toLocaleDateString('en-GB')}`, 10, paymentY);
            });
            // Separator between each sale
            doc.text('............................................................', 10, startingY + 120 + sale.amountPaid.length * 10);
            doc.text(`Amount Due: ${sale.amountDue} rupees`, 10, startingY + 130 + sale.amountPaid.length * 10);


        });

        const pdfBlob = doc.output('blob');

        const url = URL.createObjectURL(pdfBlob);
        console.log(url)
        setPdfUrl(url); // Set the generated PDF URL for download
    };

    const deleteSale = async (SaleID) => {
        try {
            setLoading(true);
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
            setLoading(false); // Stop the loader
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
                            {loading &&
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
                                    onClick={() => generatePDF()}
                                    className="mt-2 w-full bg-blue-500 text-white py-1 rounded-lg hover:bg-blue-600"
                                >
                                    Generate Bill
                                </button>

                                {pdfUrl && (
                                    <div className="">
                                        {/* <QRCodeSVG value={pdfUrl} size={256} /> */}
                                        <a href={pdfUrl} download={fileName} className="mt-2 w-full block text-center bg-green-500 text-white py-1 rounded-lg hover:bg-green-600">
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
