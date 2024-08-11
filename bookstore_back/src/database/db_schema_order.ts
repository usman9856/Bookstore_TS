import mongoose, { Schema, Document } from 'mongoose';
import { IBook } from './db_schema_book';

// Define the TypeScript interface for the Order document
// IOrder interface
interface IOrder extends Document {
  orderId: string;
  customerName: string;
  orderDate: Date;  // Change to Date for better type management
  book: IBook['_id']; // Reference to the Book model ID
  status: string;
}

// Order schema
const orderSchema: Schema<IOrder> = new Schema({
  orderId: {
      type: String,
      required: true,
  },
  customerName: {
      type: String,
      required: true,
  },
  orderDate: {
      type: Date, // Ensure the type is Date for consistency
      required: true,
  },
  book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
  },
  status: {
      type: String,
      required: true,
  }
});

const model_Order = mongoose.model<IOrder>('order_log', orderSchema, 'order_log');


export { model_Order, IOrder };
