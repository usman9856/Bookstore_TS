// Import necessary modules from mongoose
import mongoose, { Schema, Document, Decimal128 } from 'mongoose';

// Define the TypeScript interface for the Book document
// This interface represents the structure of a Book document in MongoDB
interface IBook extends Document {
  ISBN: string;            // International Standard Book Number
  title: string;           // Title of the book
  author: string;          // Author of the book
  publishedYear: number;  // Year the book was published
  genre: string;           // Genre of the book
  price: number;           // Price of the book
  inStock?: boolean;       // Optional field indicating if the book is in stock
  quantity: number;        // Number of copies available
  rating?: Decimal128;     // Optional field for book rating (Decimal128 type for precision)
  review: string[];        // Array of reviews for the book
}

// Create the Mongoose schema for the Book model
const bookSchema: Schema<IBook> = new Schema({
  ISBN: { type: String, required: true }, // ISBN is a required field
  title: { type: String, required: true }, // Title is a required field
  author: { type: String, required: true }, // Author is a required field
  publishedYear: { type: Number, required: true }, // Published year is required
  genre: { type: String, required: true }, // Genre is a required field
  price: { type: Number, required: true }, // Price is a required field
  inStock: { type: Boolean, default: true }, // InStock defaults to true if not specified
  quantity: { type: Number, required: true }, // Quantity is a required field
  rating: { type: Schema.Types.Decimal128, required: false }, // Rating is optional
  review: { type: [String], required: true, default: [] }, // Review is required and defaults to an empty array
});

// Create and export the Mongoose model based on the schema
const model_Book = mongoose.model<IBook>('book_log', bookSchema, 'book_log');

export { model_Book, IBook };
