import express from 'express';
import connectDB from './database/db_connect'; 
import bookRoutes from './routes/bookRoutes'; 
import orderRoutes from './routes/orderRoutes'; 

const app = express();
const port: number = 5000;

// Connect to the database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

//API call
app.use('/Book', bookRoutes);
app.use('/Order', orderRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port: http://localhost:${port}`);
});
