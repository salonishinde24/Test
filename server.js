const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionRoutes = require('./routes/transcation');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/transactions_db', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
const mongoURI = 'mongodb://localhost:27017/transactions_db';

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

app.use('/api', transactionRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
