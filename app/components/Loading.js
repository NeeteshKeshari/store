import React, { useState, useEffect } from "react";

const Loading = () => {
  

  return (
    <div className="flex justify-center items-center min-h-screen">
      
        <div
          className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full animate-spin"
          style={{ borderTopColor: "#3498db" }} // Add a blue color to the top
        ></div>
     
    </div>
  );
};

export default Loading;
