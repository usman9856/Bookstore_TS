import mongoose, { Schema, Document, Decimal128 } from 'mongoose';

// Define the TypeScript interface for the Book document
interface IBook extends Document {
  id: string;
  title: string;
  author: string;
  publishedYear: number;
  genre: string;
  price: number;
  inStock?: boolean;
  quantity: number;
  rating?: Decimal128; // Optional
}

// Create the Mongoose schema for the Book model
const bookSchema: Schema<IBook> = new Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publishedYear: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    required: true,
  },
  rating: {
    type: Schema.Types.Decimal128,
    required: false,
  },
});

// Create and export the Mongoose model based on the schema
const model_Book = mongoose.model<IBook>('book_log', bookSchema, 'book_log');

export { model_Book, IBook };
