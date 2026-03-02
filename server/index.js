const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// Routes
const authRoutes = require('./route/authRoutes');
const contactRoutes = require('./route/contactRoutes');
const foodRoutes = require('./route/foodRoutes');
const orderRoutes = require('./route/orderRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});