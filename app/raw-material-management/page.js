"use client"; // Marking this component as a Client Component

import { useState, useEffect } from 'react';
import RawMaterialForm from '../components/RawMaterialForm';
import RawMaterialTable from '../components/RawMaterialTable';

const RawMaterialManagementPage = () => {
  const [refreshKey, setRefreshKey] = useState(0); // Key to force re-render the table

  const refreshData = () => {
    setRefreshKey(prevKey => prevKey + 1); // Increment the key to refresh the table
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Raw Material Management</h1>
      <RawMaterialForm onMaterialAdded={refreshData} />
      <RawMaterialTable refreshKey={refreshKey} /> {/* Pass the refresh key to the table */}
    </div>
  );
};

export default RawMaterialManagementPage;
