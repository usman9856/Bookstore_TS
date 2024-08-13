"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary modules
const express_1 = __importDefault(require("express")); // Express framework
const db_connect_1 = __importDefault(require("./database/db_connect")); // Function to connect to the database
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes")); // Routes for book-related operations
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes")); // Routes for order-related operations
const personRoutes_1 = __importDefault(require("./routes/personRoutes")); // Routes for person-related operations
// Create an instance of the Express application
const app = (0, express_1.default)(); // Initialize Express app
const port = 5000; // Define port number
// Connect to the database
(0, db_connect_1.default)(); // Call function to establish a database connection
// Middleware to parse JSON bodies from incoming requests
app.use(express_1.default.json()); // Enable JSON body parsing
// Define API routes and attach route handlers
app.use('/Book', bookRoutes_1.default); // Route requests to /Book to bookRoutes handler
app.use('/Order', orderRoutes_1.default); // Route requests to /Order to orderRoutes handler
app.use('/Person', personRoutes_1.default); // Route requests to /Person to orderPerson handler
// Start the server and listen for incoming requests
app.listen(port, () => {
    console.log(`Server listening on port: http://localhost:${port}`); // Log server status
});
