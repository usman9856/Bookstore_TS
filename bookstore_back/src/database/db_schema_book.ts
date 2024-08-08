import mongoose, { Schema, Document, Decimal128 } from 'mongoose';

// Define the TypeScript interface for the Book document
interface IBook extends Document {
  title: string;
  author: string;
  publishedYear: number;
  genre: string;
  price: number;
  inStock?: boolean; 
  quantity: number;
  rating?: Decimal128;
}

// Create the Mongoose schema for the Book model
const bookSchema: Schema<IBook> = new Schema({
  title: {
    type: String,
    required: false
  },
  author: {
    type: String,
    required: false
  },
  publishedYear: {
    type: Number,
    required: false
  },
  genre: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: false
  },
  inStock: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    required: false
  },
  rating: {
    type: Schema.Types.Decimal128, // Use Decimal128 for decimal values
    required: false
  }
});

// Create and export the Mongoose model based on the schema
const model_Book = mongoose.model<IBook>('book_log', bookSchema, 'book_log');

export { model_Book, IBook };
