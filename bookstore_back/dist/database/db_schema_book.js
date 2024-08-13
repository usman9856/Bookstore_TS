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
exports.model_Book = void 0;
// Import necessary modules from mongoose
const mongoose_1 = __importStar(require("mongoose"));
// Create the Mongoose schema for the Book model
const bookSchema = new mongoose_1.Schema({
    ISBN: { type: String, required: true }, // ISBN is a required field
    title: { type: String, required: true }, // Title is a required field
    author: { type: String, required: true }, // Author is a required field
    publishedYear: { type: Number, required: true }, // Published year is required
    genre: { type: String, required: true }, // Genre is a required field
    price: { type: Number, required: true }, // Price is a required field
    inStock: { type: Boolean, default: true }, // InStock defaults to true if not specified
    quantity: { type: Number, required: true }, // Quantity is a required field
    rating: { type: mongoose_1.Schema.Types.Decimal128, required: false }, // Rating is optional
    review: { type: [String], required: true, default: [] }, // Review is required and defaults to an empty array
});
// Create and export the Mongoose model based on the schema
const model_Book = mongoose_1.default.model('book_log', bookSchema, 'book_log');
exports.model_Book = model_Book;
