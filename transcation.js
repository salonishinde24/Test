const express = require('express');
const router = express.Router();
const Transaction = require('../model/Transcation');
// const Transaction = require('');
const axios = require('axios');

// Initialize Database with seed data
router.get('/initialize', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Transaction.insertMany(response.data);
        res.status(200).send('Database initialized with seed data.');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List all transactions with search and pagination
router.get('/transactions', async (req, res) => {
    const { page = 1, per_page = 10, search = '' } = req.query;
    const query = {
        $or: [
            { title: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
            { price: new RegExp(search, 'i') }
        ]
    };

    try {
        const transactions = await Transaction.find(query)
            .skip((page - 1) * per_page)
            .limit(Number(per_page));
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Statistics API
router.get('/statistics', async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(`2023-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    try {
        const totalSales = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
            { $group: { _id: null, totalAmount: { $sum: "$price" }, totalSold: { $sum: { $cond: ["$sold", 1, 0] } }, totalNotSold: { $sum: { $cond: ["$sold", 0, 1] } } } }
        ]);
        res.status(200).json(totalSales[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Bar chart API
router.get('/barchart', async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(`2023-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const priceRanges = [
        { label: '0-100', min: 0, max: 100 },
        { label: '101-200', min: 101, max: 200 },
        { label: '201-300', min: 201, max: 300 },
        { label: '301-400', min: 301, max: 400 },
        { label: '401-500', min: 401, max: 500 },
        { label: '501-600', min: 501, max: 600 },
        { label: '601-700', min: 601, max: 700 },
        { label: '701-800', min: 701, max: 800 },
        { label: '801-900', min: 801, max: 900 },
        { label: '901-above', min: 901, max: Infinity },
    ];

    try {
        const barChartData = await Promise.all(
            priceRanges.map(async range => {
                const count = await Transaction.countDocuments({
                    dateOfSale: { $gte: startDate, $lt: endDate },
                    price: { $gte: range.min, $lt: range.max }
                });
                return { range: range.label, count };
            })
        );
        res.status(200).json(barChartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Pie chart API
router.get('/piechart', async (req, res) => {
    const { month } = req.query;
    const startDate = new Date(`2023-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    try {
        const pieChartData = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);
        res.status(200).json(pieChartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Combined API
router.get('/combined', async (req, res) => {
    const PORT = process.env.PORT || 5000;
    try {
        const [statistics, barChart, pieChart] = await Promise.all([
            axios.get(`http://localhost:${PORT}/api/statistics`, { params: req.query }),
            axios.get(`http://localhost:${PORT}/api/barchart`, { params: req.query }),
            axios.get(`http://localhost:${PORT}/api/piechart`, { params: req.query }),
        ]);

        res.status(200).json({
            statistics: statistics.data,
            barChart: barChart.data,
            pieChart: pieChart.data,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
