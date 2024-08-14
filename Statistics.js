import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ month }) => {
    const [statistics, setStatistics] = useState({});
// Month name mapping
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
    useEffect(() => {
        fetchStatistics();
    }, [month]);

    const fetchStatistics = async () => {
        const response = await axios.get('http://localhost:5000/api/statistics', { params: { month } });
        setStatistics(response.data);
    };

    return (
        // <div>
        //     <h3>Statistics for {month}</h3>
        //     <p>Total Sale Amount: {statistics.totalAmount}</p>
        //     <p>Total Sold Items: {statistics.totalSold}</p>
        //     <p>Total Not Sold Items: {statistics.totalNotSold}</p>
        // </div>
        <div className="container mt-4 p-4 bg-light rounded shadow-sm">
    <h3 className="mb-4 text-primary">Statistics for {monthNames[parseInt(month, 10) - 1]}</h3>
    <p className="mb-2"><strong>Total Sale Amount:</strong> {statistics.totalAmount}</p>
    <p className="mb-2"><strong>Total Sold Items:</strong> {statistics.totalSold}</p>
    <p><strong>Total Not Sold Items:</strong> {statistics.totalNotSold}</p>
</div>
    );
};

export default Statistics;
