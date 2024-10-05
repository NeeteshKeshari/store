"use client"; // Ensure this component is a Client Component

import { useState } from 'react';

const RawMaterialForm = ({ onMaterialAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    totalQuantity: 0,
    stockDate: '',
    addedQuantity: 0,
    addDate: '',
    removedQuantity: 0,
    removeDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'totalQuantity' || name === 'addedQuantity' || name === 'removedQuantity'
      ? Number(value) : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const remainingQuantity = formData.totalQuantity + formData.addedQuantity - formData.removedQuantity;

    await fetch('/api/raw-material', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        remainingQuantity,
      }),
    });

    // Call the provided onMaterialAdded function to refresh the table
    onMaterialAdded();
    setFormData({
      name: '',
      totalQuantity: 0,
      stockDate: '',
      addedQuantity: 0,
      addDate: '',
      removedQuantity: 0,
      removeDate: '',
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Raw Material Management</h2>
        
        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Raw Material Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Total Raw Material Quantity (in Kg)</label>
            <input
              type="number"
              name="totalQuantity"
              value={formData.totalQuantity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700">Raw Material Stock Date</label>
            <input
              type="date"
              name="stockDate"
              value={formData.stockDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Add Raw Material Quantity</label>
            <input
              type="number"
              name="addedQuantity"
              value={formData.addedQuantity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700">Add Raw Material Quantity Date</label>
            <input
              type="date"
              name="addDate"
              value={formData.addDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Remove Raw Material Quantity</label>
            <input
              type="number"
              name="removedQuantity"
              value={formData.removedQuantity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700">Remove Raw Material Quantity Date</label>
            <input
              type="date"
              name="removeDate"
              value={formData.removeDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RawMaterialForm;
