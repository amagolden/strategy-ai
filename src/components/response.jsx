import React, { useState } from 'react';

const Response = ({ response, loading  }) => {

  /*const downloadCSV = () => {
    if (!response) {
      alert("No strategic plan available to download!");
      return;
    }
  
    // CSV header
    const header = ["Objective", "Key Result", "Timeline"];
    const csvRows = [];

    // Loop through each objective and its key results
    response.objectives.forEach((objective) => {
      objective.keyResults.forEach((keyResult) => {
        csvRows.push([objective.objective, keyResult.keyResult, keyResult.timeline].join(","));
      });
    });

    // Combine header and rows
    const csvContent = [header.join(","), ...csvRows].join("\n");
  
    // Convert response object to a JSON string
    const jsonData = JSON.stringify(response, null, 2); // 2 for indentation

    // Create a Blob from the JSON string
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = "strategic_plan.json";
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  */

  /*const downloadCSV = () => {
    if (!response || Object.keys(response).length === 0) {
      alert("No strategic plan available to download!");
      return;
    }
  
    const csvRows = [];
    
    // Add the header row
    csvRows.push("Section,Objective,Key Result,Timeline");
  
    // Process the response object
    for (const [section, items] of Object.entries(response)) {
      if (Array.isArray(items)) {
        // If the section is an array (e.g., Goals or Objectives)
        items.forEach((item) => {
          if (item.keyResults) {
            // Nested key results
            item.keyResults.forEach((keyResult) => {
              csvRows.push(
                `${section},${item.objective || "N/A"},${keyResult.keyResult || "N/A"},${keyResult.timeline || "N/A"}`
              );
            });
          } else {
            // Flat items
            csvRows.push(`${section},${item.Goal || "N/A"},${item.Objective || "N/A"},N/A`);
          }
        });
      } else {
        // If the section is not an array (e.g., VisionStatement)
        csvRows.push(`${section},${items},N/A,N/A`);
      }
    }
  
    // Combine rows into CSV content
    const csvContent = csvRows.join("\n");
  
    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "strategic_plan.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  */  

  const downloadCSV = () => {
    if (!response || Object.keys(response).length === 0) {
      alert("No strategic plan available to download!");
      return;
    }
  
    const csvRows = [];
    
    // Add the header row
    csvRows.push("Section,Objective/Strategy/KPI,Key Result/Detail,Timeline");
  
    // Process the response object
    for (const [section, items] of Object.entries(response)) {
      if (Array.isArray(items)) {
        // If the section is an array (e.g., Goals, Strategies, KPIs)
        items.forEach((item) => {
          if (section === "Goals" && item.Objective) {
            // For Goals & Objectives, extract both goal and objective
            csvRows.push(
              `${section},${item.Goal || "N/A"}: ${item.Objective || "N/A"},N/A,N/A`
            );
          } else if (section === "Strategies" && item.Strategy) {
            // For Strategies, extract strategy details
            csvRows.push(
              `${section},${item.Strategy || "N/A"},N/A,N/A`
            );
          } else if (section === "KPIs" && item.Metric) {
            // For KPIs, extract metric and target
            csvRows.push(
              `${section},${item.Metric || "N/A"}: ${item.Target || "N/A"},N/A,N/A`
            );
          }
        });
      } else {
        // If the section is not an array (e.g., Vision Statement or Mission Statement)
        csvRows.push(`${section},${items},N/A,N/A`);
      }
    }
  
    // Combine rows into CSV content
    const csvContent = csvRows.join("\n");
  
    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "strategic_plan.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSection = (key, value) => {
    if (Array.isArray(value)) {
      // Render arrays as a list of cards
      return value.map((item, index) => (
        <div
          key={`${key}-${index}`}
          className="bg-white rounded-lg shadow-md p-4 border border-gray-200 space-y-2"
        >
          {Object.entries(item).map(([subKey, subValue]) => (
            <p key={subKey} className="text-sm text-gray-800">
              <strong>{subKey}:</strong> {subValue}
            </p>
          ))}
        </div>
      ));
    } else if (typeof value === "object") {
      // Render nested objects as collapsible sections
      return Object.entries(value).map(([subKey, subValue]) => (
        <div
          key={subKey}
          className="bg-gray-50 rounded-lg shadow p-4 space-y-2"
        >
          <h4 className="font-semibold">{subKey}</h4>
          <p className="text-sm">{JSON.stringify(subValue, null, 2)}</p>
        </div>
      ));
    } else {
      // Render simple key-value pairs
      return (
        <p className="text-sm text-gray-800">
          <strong>{key}:</strong> {value}
        </p>
      );
    }
  };

  return (
    <div className="border-b border-gray-900/10 pb-6">
      <h3 className="text-lg font-semibold text-gray-900">Strategic Plan</h3>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
        {/* Loop through each objective and display details */}
        {/*{response.objectives?.map((objective) => (
          <div key={objective.objective} className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
          <div className="flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900">{objective.objective}</h3>
          </div>
              {objective.keyResults?.map((keyResult) => (
                <div className="flex-grow">
                  <p className="text-sm">
                    <strong>Key Result:</strong> {keyResult?.keyResult || 'Not available'}
                  </p>
                  <p className="text-sm">
                    <strong>Timline:</strong> {keyResult?.timeline || 'Not available'}
                  </p>
                </div>
              ))}
          </div>
        ))}
        </div>
      )}*/}

        {/* Render each section of the response */}
        {Object.entries(response).map(([key, value]) => (
          <div
            key={key}
            className="bg-gray-100 rounded-lg shadow-md p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold text-indigo-600">
              {key}
            </h3>
            {renderSection(key, value)}
          </div>
        ))}
        </div>
      )}
      <button
        onClick={downloadCSV}
        className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
      >
        Download as CSV
      </button>
    </div>
  );
};

export default Response;
