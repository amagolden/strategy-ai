import React, { useState } from 'react';
import jsPDF from 'jspdf';

const Response = ({ response, loading  }) => {  

  // Function to download the response as PDF
  const downloadPDF = () => {
    if (!response || Object.keys(response).length === 0) {
      alert("No strategic plan available to download!");
      return;
    }
  
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10; // Margin for left and right
    const maxWidth = pageWidth - margin * 2; // Max width for text
    let y = 10; // Starting vertical offset
  
    // Utility function to pretty print JSON content
    const formatContent = (content, indent = "") => {
      if (Array.isArray(content)) {
        return content
          .map((item) => {
            if (typeof item === "object") {
              return `${indent}- ${formatContent(item, `${indent}  `)}`;
            }
            return `${indent}- ${item}`;
          })
          .join("\n");
      } else if (typeof content === "object") {
        return Object.entries(content)
          .map(([key, value]) => `${indent}${key}: ${formatContent(value, `${indent}  `)}`)
          .join("\n");
      } else {
        return `${indent}${content}`;
      }
    };
  
    // Title
    doc.setFontSize(16);
    doc.text("Strategic Planning", margin, y);
    y += 10; // Add space after title
  
    // Add each section to the PDF
    for (const [section, content] of Object.entries(response)) {
      // Section Header
      doc.setFontSize(14);
      doc.setTextColor(100, 149, 237); // Indigo color for section headers
      doc.text(section.replace(/_/g, " "), margin, y);
      y += 10;
  
      // Section Content
      doc.setFontSize(12);
      doc.setTextColor(0); // Black for content
  
      const formattedContent = formatContent(content);
      const lines = doc.splitTextToSize(formattedContent, maxWidth); // Split text to fit
      lines.forEach((line) => {
        if (y > doc.internal.pageSize.height - margin) {
          doc.addPage(); // Add a new page
          y = margin; // Reset vertical offset
        }
        doc.text(line, margin, y);
        y += 7; // Line spacing
      });
  
      y += 5; // Add some space between sections
    }
  
    // Save the PDF
    doc.save("strategic_plan.pdf");
  };
  

  const downloadCSV = () => {
    if (!response || Object.keys(response).length === 0) {
      alert("No strategic plan available to download!");
      return;
    }
  
    const csvRows = [];
  
    // Add the header row
    csvRows.push("Section,Objective/Strategy/KPI");
  
    // Check if response is an object before proceeding
    if (typeof response === "object" && response !== null) {
      // Process the response object
      for (const [section, items] of Object.entries(response)) {
        if (!items) {
          console.error(`Section ${section} is undefined or null.`);
          continue; // Skip sections with no data
        }
  
        if (Array.isArray(items)) {
          // If the section is an array (e.g., Goals, Strategies, KPIs)
          items.forEach((item) => {
            if (section === "Goals" && item?.Goal && item?.Objective) {
              csvRows.push(
                `${section},${item.Goal || "N/A"}: ${item.Objective || "N/A"}`
              );
            }
            // Check for Strategies
            else if (section === "Strategies" && item?.Strategy) {
              csvRows.push(
                `${section},${item.Strategy || "N/A"}`
              );
            }
            // Check for KPIs
            else if (section === "KPIs" && item?.Metric) {
              csvRows.push(
                `${section},${item.Metric || "N/A"}: ${item.Target || "N/A"}`
              );
            } else {
              console.log(`Unexpected item structure for section "${section}":`, item);
            }
          });
        } else {
          // If the section is not an array (e.g., Vision Statement or Mission Statement)
          csvRows.push(`${section},${items || "N/A"}`);
        }
      }
    } else {
      console.error("Response is not a valid object.");
      return;
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
      // Handle array values (e.g., "Strategies", "KPIs", "Goals")
      return (
        <div>
          {value.map((item, index) => (
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
          ))}
        </div>
      );
    } else if (typeof value === "object" && value !== null) {
      // Handle nested objects (unlikely based on your example)
      return Object.entries(value).map(([subKey, subValue]) => (
        <div key={subKey} className="bg-gray-50 rounded-lg shadow p-4 space-y-2">
          <h4 className="font-semibold">{subKey}</h4>
          <p className="text-sm">
            {typeof subValue === "object" ? (
              renderSection(subKey, subValue)
            ) : (
              subValue
            )}
          </p>
        </div>
      ));
    } else {
      // Handle direct text values (e.g., "Vision Statement", "Mission Statement")
      return (
        <p className="text-sm text-gray-800">
          <strong>{key}:</strong> {value}
        </p>
      );
    }
  };
  
  /*if (loading) return <p>Loading...</p>;

  if (!response) {
    return <p>No response received yet. Please try again.</p>;
  }

  if (typeof response === "string") {
    return (
      <div>
        <h3>Raw Response</h3>
        <pre>{response}</pre>
      </div>
    );
  }

  if (typeof response === "object") {
    return (
      <div>
        {Object.entries(response).map(([key, value]) => (
          <div key={key}>
            <h3 className="text-lg font-semibold">{key}</h3>
            {Array.isArray(value) ? (
              <ul>
                {value.map((item, index) => (
                  <li key={index}>{JSON.stringify(item)}</li>
                ))}
              </ul>
            ) : (
              <p>{value}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return <p>Unexpected response format.</p>;
};*/

  return (
    <div className="border-b border-gray-900/10 pb-6">
      <h3 className="text-lg font-semibold text-gray-900">Strategic Plan</h3>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">

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
      <button
        onClick={downloadPDF}
        className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
      >
        Download as PDF
      </button>
    </div>
  );
};

export default Response;
