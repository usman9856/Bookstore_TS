import mongoose, { Schema, Document } from 'mongoose';
import { IBook } from './db_schema_book';

// Define the TypeScript interface for the Order document
interface IOrder extends Document {
  customerName: string;
  orderDate: string;
  book: IBook;
  status: string[];
}

// Create the Mongoose schema for the Order model
const orderSchema: Schema<IOrder> = new Schema({
  customerName: {
    type: String,
    required: true,
  },
  orderDate: {
    type: String,
    required: true
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  status: {
    type: [String],
    required: true
  }
});

// Create and export the Mongoose model based on the schema
const model_Order = mongoose.model<IOrder>('Order', orderSchema);

export { model_Order, IOrder };
