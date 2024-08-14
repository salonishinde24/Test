import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import axios from 'axios';

// Register the required components
Chart.register(ArcElement);

const PieChart = ({ month }) => {
    const [pieData, setPieData] = useState([]);

    useEffect(() => {
        let chartInstance = null;
    
        const fetchPieData = async () => {
            const response = await axios.get('http://localhost:5000/api/piechart', { params: { month } });
            setPieData(response.data);
        };
    
        fetchPieData();
    
        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [month]);

    // const fetchPieData = async () => {
    //     const response = await axios.get('http://localhost:5000/api/piechart', { params: { month } });
    //     setPieData(response.data);
    // };

    const data = {
        labels: pieData.map(item => item._id),
        datasets: [
            {
                data: pieData.map(item => item.count),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ],
            },
        ],
    };

    return <div className="container mt-4 p-4 bg-light rounded shadow-lg">
        <h3 className="mb-4 text-primary">Pie Chart</h3>

        {data && data.datasets && data.datasets.length > 0 ? (
         <Pie data={data} />
    ) : (
        <div className="alert alert-warning" role="alert">
            Data not found
        </div>
    )}
   
</div>;
};

export default PieChart;
