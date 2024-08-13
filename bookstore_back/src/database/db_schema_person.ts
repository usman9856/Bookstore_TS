// Import necessary modules from mongoose
import { Schema, model, Document } from 'mongoose';

// Define the IPerson interface
// This interface represents the structure of a Person document in MongoDB
interface IPerson extends Document {
  person_id: string;          // Unique identifier for the person
  firstName: string;         // First name of the person
  lastName: string;          // Last name of the person
  access: string;            // Access level or role of the person
  library: Schema.Types.ObjectId[]; // Array of ObjectIds referencing books in the library
  email: string;             // Email address of the person
  password: string;          // Password of the person (hashed)
  orderHistory: Schema.Types.ObjectId[]; // Array of ObjectIds referencing orders made by the person
}

// Create the Mongoose schema for the Person model
const personSchema = new Schema<IPerson>({
  person_id: { type: String, required: true }, // person_id is a required field
  firstName: { type: String, required: true }, // First name is a required field
  lastName: { type: String, required: true },  // Last name is a required field
  access: { type: String, required: true },    // Access level is a required field
  library: [{ type: Schema.Types.ObjectId, ref: 'Book', required: true }], // Array of ObjectIds referencing books, required field
  email: { type: String, required: true, unique: true }, // Email is a required field and must be unique
  password: { type: String, required: true }, // Password is a required field
  orderHistory: [{ type: Schema.Types.ObjectId, ref: 'Order' }] // Array of ObjectIds referencing orders, not required
});

// Create and export the Mongoose model based on the schema
// The model is named 'person_log' and is mapped to the 'person_log' collection in MongoDB
const model_person = model<IPerson>('person_log', personSchema, 'person_log');

export default model_person;
