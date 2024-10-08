"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.model_Order = void 0;
// Import necessary modules and types from Mongoose
const mongoose_1 = __importStar(require("mongoose")); // Mongoose for database interaction
// Define the schema for the Order model
const orderSchema = new mongoose_1.Schema({
    orderId: { type: String, required: true }, // Order ID must be a string and is required
    customerName: { type: String, required: true }, // Customer's name must be a string and is required
    email: { type: String, required: true }, // Customer's email must be a string and is required
    orderDate: { type: Date, required: true }, // Date of the order must be a Date object and is required
    book: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Book', required: true }, // Reference to the Book model, required
    status: { type: String, required: true } // Order status must be a string and is required
});
// Create the Order model using the schema and export it
const model_Order = mongoose_1.default.model('order_log', orderSchema, 'order_log');
exports.model_Order = model_Order;
