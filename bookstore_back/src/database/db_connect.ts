// Import the mongoose library for interacting with MongoDB
import mongoose from 'mongoose';

// Function to connect to the MongoDB database
const connectDB = async () => {
    // Check if the database connection is already established
    if (mongoose.connection.readyState !== 1) {
        // If not connected, establish a new connection to MongoDB
        await mongoose.connect('mongodb+srv://um50765:USEVDnoFKoRaVDmI@cluster0.ervwj.mongodb.net/Bookstore');
        console.log("Database Connected!"); // Log a message once the connection is successful
    } else {
        // If already connected, log a message indicating the database is already connected
        console.log("Database Already Connected!");
    }
};

// Export the connectDB function for use in other parts of the application
export default connectDB;
