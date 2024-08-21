"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getBook = exports.setBook = exports.getAllBooks = void 0;
const db_schema_book_1 = require("../database/db_schema_book"); // Book model and schema
const mongoose_1 = __importDefault(require("mongoose"));
const customError_1 = __importDefault(require("../error_manager/customError"));
const asyncErrorHanlder_1 = __importDefault(require("../error_manager/asyncErrorHanlder"));
// Function to get all books from the database with pagination
const getAllBooks = (0, asyncErrorHanlder_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const page = Number((_a = req.query.p) !== null && _a !== void 0 ? _a : 0); // Current page number
    const booksPerPage = 4; // Number of books per page
    console.log('Page:', page, 'Books Per Page:', booksPerPage, 'Skip:', page * booksPerPage);
    // Fetch books with pagination
    const existingBooks = yield db_schema_book_1.model_Book.find({})
        .skip(page * booksPerPage)
        .limit(booksPerPage);
    // Fetch the total count of books
    const totalBooks = yield db_schema_book_1.model_Book.countDocuments({});
    if (existingBooks.length > 0) {
        // Respond with paginated books and total count
        res.status(200).json({
            books: existingBooks,
            totalBooks: totalBooks,
            currentPage: page,
            totalPages: Math.ceil(totalBooks / booksPerPage)
        });
    }
    else {
        // Use CustomError and pass it to the error-handling middleware
        next(new customError_1.default('No books found for this page.', 404));
    }
}));
exports.getAllBooks = getAllBooks;
// Function to get a single book by ISBN
const getBook = (0, asyncErrorHanlder_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getBook Called"); // Log function call
    const { ISBN } = req.params; // Extract the identifier from request parameters
    console.log("getBook called to find book:\nIdentifier: ", ISBN); // Log the identifier
    if (!ISBN) {
        // Use CustomError to handle missing ISBN
        return next(new customError_1.default('Missing required parameter: ISBN or ID', 400));
    }
    // Determine if the identifier is an _id (assumed to be 24-character long) or an ISBN
    const isObjectId = ISBN.length === 24;
    // Find book by either _id or ISBN
    const query = isObjectId ? { _id: ISBN } : { ISBN: ISBN };
    const book = yield db_schema_book_1.model_Book.findOne(query); // Find the book using the appropriate query
    if (!book) {
        // Use CustomError for book not found
        return next(new customError_1.default('Book not found', 404));
    }
    res.status(200).json(book); // Respond with the book data
}));
exports.getBook = getBook;
// Function to update or create a book by ISBN
// Function to update or create a book by ISBN
const updateBook = (0, asyncErrorHanlder_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Updating book function called");
    const { ISBN } = req.params; // Extract the identifier from request parameters
    const bookData = req.body;
    console.log("Identifier from params: ", ISBN);
    console.log("Book data from body: ", bookData);
    if (!ISBN) {
        // Use CustomError to handle missing ISBN
        return next(new customError_1.default('Missing required parameter: ISBN or ID', 400));
    }
    // Determine if the identifier is an _id (assumed to be 24-character long) or an ISBN
    const isObjectId = ISBN.length === 24;
    // Find book by either _id or ISBN
    const query = isObjectId ? { _id: ISBN } : { ISBN: ISBN };
    const existingBook = yield db_schema_book_1.model_Book.findOne(query);
    if (existingBook) { // Check if the book exists
        let updateFields = {};
        if (bookData.review && Array.isArray(bookData.review)) {
            updateFields = {
                $push: { review: { $each: bookData.review } },
            };
        }
        console.log("Query:", query);
        console.log("Update Fields:", updateFields);
        const updateResult = yield db_schema_book_1.model_Book.updateOne(query, updateFields);
        console.log("Data Updated Successfully: ", updateResult);
        if (updateResult.matchedCount === 0) {
            return next(new customError_1.default('Book not found for update', 404));
        }
        if (updateResult.modifiedCount > 0) {
            res.status(200).json({ action: 'updated', data: updateResult });
        }
        else {
            // If no changes were made, respond with a success status but indicate no changes were necessary
            res.status(200).json({ action: 'no_changes', message: 'No changes were made to the book data because it was already up-to-date.' });
        }
    }
    else {
        // Use CustomError for book not found
        return next(new customError_1.default('Book not found', 404));
    }
}));
exports.updateBook = updateBook;
const setBook = (0, asyncErrorHanlder_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("setBook called"); // Log function call
    // Validate request body
    if (!Array.isArray(req.body) || req.body.length === 0) {
        return next(new customError_1.default('Request body should be a non-empty array', 400)); // Use CustomError for invalid body
    }
    const results = []; // Array to store results
    // Loop through each book data in the request body
    for (const bookData of req.body) {
        // Generate a new _id
        const newId = new mongoose_1.default.Types.ObjectId();
        // Add _id to bookData
        bookData._id = newId;
        // Check for required fields in each book data
        if (!bookData.ISBN || !bookData.title || !bookData.author || !bookData.publishedYear || !bookData.genre || !bookData.price || !bookData.quantity) {
            return next(new customError_1.default(`Missing required fields in entry: ${JSON.stringify(bookData)}`, 400)); // Use CustomError for missing fields
        }
        // Set default review if not provided
        if (!bookData.review) {
            bookData.review = ["Not needed"];
        }
        // Search for existing books with the same title and author
        const existingBooks = yield db_schema_book_1.model_Book.find({ title: bookData.title, author: bookData.author });
        if (existingBooks.length === 0) {
            // Create a new book if no existing book is found
            const newBook = new db_schema_book_1.model_Book(bookData);
            const savedBook = yield newBook.save(); // Save the new book
            console.log("Data Saved Successfully: ", savedBook); // Log success
            results.push({ action: 'created', data: savedBook }); // Store result
        }
        else {
            // Update the quantity of the existing book
            const updateResult = yield db_schema_book_1.model_Book.updateOne({ title: bookData.title, author: bookData.author }, { $inc: { quantity: bookData.quantity } } // Increment the quantity
            );
            console.log("Data Updated Successfully: ", updateResult); // Log success
            results.push({ action: 'updated', data: updateResult }); // Store result
        }
    }
    res.status(200).json(results); // Respond with the results array
}));
exports.setBook = setBook;
const deleteBook = (0, asyncErrorHanlder_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("deleteBook Called"); // Log function call
    const ISBN = req.params.ISBN || req.query.ISBN; // Handle both route and query parameters
    console.log("deleteBook called to delete book:\nISBN: ", ISBN); // Log the ISBN
    if (!ISBN) {
        return next(new customError_1.default("Missing required parameter: ISBN", 400));
    }
    // Find the book by ISBN
    const book = yield db_schema_book_1.model_Book.findOne({ ISBN });
    if (!book) {
        return next(new customError_1.default("Book Not Found", 404));
    }
    // Delete the book
    yield db_schema_book_1.model_Book.deleteOne({ ISBN });
    res.status(200).json({ message: "Book Deleted Successfully" }); // Respond with success message
}));
exports.deleteBook = deleteBook;
