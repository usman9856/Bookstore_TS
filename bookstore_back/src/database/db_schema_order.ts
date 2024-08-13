// Import necessary modules and types from Mongoose
import mongoose, { Schema, Document } from 'mongoose'; // Mongoose for database interaction
import { IBook } from './db_schema_book'; // Import the IBook interface for type reference

// Define the TypeScript interface for the Order document
interface IOrder extends Document { // Extends Mongoose's Document type for MongoDB documents
    orderId: string; // Unique identifier for the order
    customerName: string; // Name of the customer placing the order
    email: string; // Email of the customer
    orderDate: Date; // Date when the order was placed
    book: IBook['_id']; // Reference to the Book model ID (using Book's ID type)
    status: string; // Current status of the order (e.g., Processing, Shipped)
}

// Define the schema for the Order model
const orderSchema: Schema<IOrder> = new Schema({
    orderId: { type: String, required: true }, // Order ID must be a string and is required
    customerName: { type: String, required: true }, // Customer's name must be a string and is required
    email: { type: String, required: true }, // Customer's email must be a string and is required
    orderDate: { type: Date, required: true }, // Date of the order must be a Date object and is required
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, // Reference to the Book model, required
    status: { type: String, required: true } // Order status must be a string and is required
});

// Create the Order model using the schema and export it
const model_Order = mongoose.model<IOrder>('order_log', orderSchema, 'order_log');

export { model_Order, IOrder }; // Export the model and interface for use in other parts of the application
