import mongoose, { Schema, Document, Decimal128 } from 'mongoose';

// Define the TypeScript interface for the Book document
interface IBook extends Document {
  title: string;
  author: string;
  publishedYear: number;
  genre: string;
  price: number;
  inStock?: boolean; // Optional field with default value
  rating?: Decimal128; // Optional field, use Decimal128 type from mongoose
}

// Create the Mongoose schema for the Book model
const bookSchema: Schema<IBook> = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publishedYear: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Schema.Types.Decimal128, // Use Decimal128 for decimal values
    required: false
  }
});

// Create and export the Mongoose model based on the schema
const model_Book = mongoose.model<IBook>('Book', bookSchema);

export { model_Book, IBook };
