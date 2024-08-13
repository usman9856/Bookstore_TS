// Import necessary modules
import express from 'express'; // Express framework
import connectDB from './database/db_connect'; // Function to connect to the database
import bookRoutes from './routes/bookRoutes'; // Routes for book-related operations
import orderRoutes from './routes/orderRoutes'; // Routes for order-related operations
import orderPerson from './routes/personRoutes'; // Routes for person-related operations

// Create an instance of the Express application
const app = express(); // Initialize Express app
const port: number = 5000; // Define port number

// Connect to the database
connectDB(); // Call function to establish a database connection

// Middleware to parse JSON bodies from incoming requests
app.use(express.json()); // Enable JSON body parsing

// Define API routes and attach route handlers
app.use('/Book', bookRoutes); // Route requests to /Book to bookRoutes handler
app.use('/Order', orderRoutes); // Route requests to /Order to orderRoutes handler
app.use('/Person', orderPerson); // Route requests to /Person to orderPerson handler

// Start the server and listen for incoming requests
app.listen(port, () => { // Start server on defined port
    console.log(`Server listening on port: http://localhost:${port}`); // Log server status
});
