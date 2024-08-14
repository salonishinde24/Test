import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, BarElement, LinearScale } from "chart.js";
import axios from "axios";

// Register the required components
Chart.register(CategoryScale, BarElement, LinearScale);

const BarChart = ({ month }) => {
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    let chartInstance = null;

    const fetchBarData = async () => {
      const response = await axios.get("http://localhost:5000/api/barchart", {
        params: { month },
      });
      setBarData(response.data);
    };

    fetchBarData();

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [month]);

  // const fetchBarData = async () => {
  //     const response = await axios.get('http://localhost:5000/api/barchart', { params: { month } });
  //     setBarData(response.data);
  // };

  const data = {
    labels: barData.map((item) => item.range),
    datasets: [
      {
        label: "# of Items",
        data: barData.map((item) => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="container mt-4 p-4 bg-white rounded shadow-sm">
        <h3 className="mb-4 text-primary">Bar Chart</h3>
    {data && data.datasets && data.datasets.length > 0 ? (
        <Bar data={data} />
    ) : (
        <div className="alert alert-warning" role="alert">
            Data not found
        </div>
    )}
</div>
  );
};

export default BarChart;
