"use client"; // Ensure this component is a Client Component

import { useEffect, useState } from 'react';

const RawMaterialTable = ({ refreshKey }) => { // Accept refreshKey as a prop
  const [rawMaterials, setRawMaterials] = useState([]);

  const fetchRawMaterials = async () => {
    const response = await fetch('/api/raw-material');
    const result = await response.json();
    setRawMaterials(result.data); // Access the data property
  };

  useEffect(() => {
    fetchRawMaterials(); // Fetch data on component mount and when refreshKey changes
  }, [refreshKey]); // Add refreshKey to the dependency array

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-4 border-b">Raw Material Name</th>
            <th className="py-2 px-4 border-b">Total Quantity (Kg)</th>
            <th className="py-2 px-4 border-b">Stock Date</th>
            <th className="py-2 px-4 border-b">Added Quantity</th>
            <th className="py-2 px-4 border-b">Add Date</th>
            <th className="py-2 px-4 border-b">Removed Quantity</th>
            <th className="py-2 px-4 border-b">Remove Date</th>
            <th className="py-2 px-4 border-b">Remaining Quantity</th>
          </tr>
        </thead>
        <tbody>
          {rawMaterials.length > 0 ? (
            rawMaterials.map((material) => (
              <tr key={material._id}>
                <td className="py-2 px-4 border-b text-center">{material.name}</td>
                <td className="py-2 px-4 border-b text-center">{material.totalQuantity}</td>
                <td className="py-2 px-4 border-b text-center">{new Date(material.stockDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b text-center">{material.addedQuantity}</td>
                <td className="py-2 px-4 border-b text-center">{new Date(material.addDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b text-center">{material.removedQuantity}</td>
                <td className="py-2 px-4 border-b text-center">{new Date(material.removeDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b text-center">{material.remainingQuantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="py-2 px-4 border-b text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RawMaterialTable;
