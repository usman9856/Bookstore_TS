"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary modules from mongoose
const mongoose_1 = require("mongoose");
// Create the Mongoose schema for the Person model
const personSchema = new mongoose_1.Schema({
    person_id: { type: String, required: true }, // person_id is a required field
    firstName: { type: String, required: true }, // First name is a required field
    lastName: { type: String, required: true }, // Last name is a required field
    access: { type: String, required: true }, // Access level is a required field
    library: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Book', required: true }], // Array of ObjectIds referencing books, required field
    email: { type: String, required: true, unique: true }, // Email is a required field and must be unique
    password: { type: String, required: true }, // Password is a required field
    orderHistory: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Order' }] // Array of ObjectIds referencing orders, not required
});
// Create and export the Mongoose model based on the schema
// The model is named 'person_log' and is mapped to the 'person_log' collection in MongoDB
const model_person = (0, mongoose_1.model)('person_log', personSchema, 'person_log');
exports.default = model_person;
