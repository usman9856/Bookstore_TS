import express from 'express';
import mongoose from 'mongoose';
import connectDB from './database/db_connect'; // Adjust path if necessary
import bookRoutes from './routes/bookRoutes'; // Adjust path if necessary
// import orderRoutes from './routes/orderRoutes'; // Adjust path if necessary

const app = express();
const port: number = 5000;

// Connect to the database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// Use bookRoutes for any routes starting with /api/books
app.use('/api/books', bookRoutes);

// Use orderRoutes for any routes starting with /api/orders
// app.use('/api/orders', orderRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port: http://localhost:${port}`);
});
