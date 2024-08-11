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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getBook = exports.setBook = exports.getAllBooks = void 0;
const db_schema_book_1 = require("../database/db_schema_book");
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getAllBooks called");
    try {
        const existingBooks = yield db_schema_book_1.model_Book.find({});
        if (existingBooks.length > 0) {
            res.json(existingBooks);
        }
    }
    catch (error) {
        console.error('Error fetching menu data:', error);
        return []; // Return an empty array or handle the error as needed
    }
});
exports.getAllBooks = getAllBooks;
const setBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("setBook called");
    try {
        //check if incoming request is empty or not.
        if (!Array.isArray(req.body) || req.body.length === 0) {
            res.status(400).json({ error: "Request body should be a non-empty array" });
            return;
        }
        const results = [];
        //loop through the whole req.body 
        for (const bookData of req.body) {
            // Ensure bookData contains required fields
            if (!bookData.id || !bookData.title || !bookData.author || !bookData.publishedYear || !bookData.genre || !bookData.price || !bookData.quantity) {
                res.status(400).json({ error: `Missing required fields in entry: ${JSON.stringify(bookData)}` });
                return;
            }
            // Search for existing books with the given title and author
            const existingBooks = yield db_schema_book_1.model_Book.find({ title: bookData.title, author: bookData.author });
            if (existingBooks.length === 0) {
                // If no existing book is found, create a new book
                const newBook = new db_schema_book_1.model_Book(bookData);
                const savedBook = yield newBook.save();
                console.log("Data Saved Successfully: ", savedBook);
                results.push({ action: 'created', data: savedBook });
            }
            else {
                // If a book is found, update its quantity
                const updateResult = yield db_schema_book_1.model_Book.updateOne({ title: bookData.title, author: bookData.author }, { $inc: { quantity: bookData.quantity } } // Increment the quantity by the amount provided
                );
                console.log("Data Updated Successfully: ", updateResult);
                results.push({ action: 'updated', data: updateResult });
            }
        }
        res.status(200).json(results); // Respond with the array of results
    }
    catch (error) {
        console.error("Failed to add or update book:", error);
        res.status(500).json({ error: "Failed to add or update book in the database" });
    }
});
exports.setBook = setBook;
const getBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getBook Called");
    try {
        const { id } = req.params;
        console.log("getBook called to find book:\nID/ISBN: ", id);
        if (!id) {
            res.status(400).json({ error: "Missing required parameter: title" });
            return;
        }
        const book = yield db_schema_book_1.model_Book.findOne({ id });
        if (!book) {
            res.status(404).json({ error: "Book not found" });
            return;
        }
        res.status(200).json(book);
    }
    catch (error) {
        console.error("Failed to get book:", error);
        res.status(500).json({ error: "Failed to get book from the database" });
    }
});
exports.getBook = getBook;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Updating book function called");
    try {
        const { id } = req.params;
        const bookData = req.body; // Full book data should be provided in the request body
        console.log("id from params: ", id);
        console.log("Book data from body: ", bookData);
        if (!id) {
            res.status(400).json({ error: "Missing required parameter: id" });
            return;
        }
        if (!bookData || Object.keys(bookData).length === 0) {
            res.status(400).json({ error: "Missing book data in the request body" });
            return;
        }
        // Find the existing book
        const existingBook = yield db_schema_book_1.model_Book.findOne({ id });
        if (existingBook) {
            // If book exists, update the entire entry
            const updateResult = yield db_schema_book_1.model_Book.updateOne({ id }, { $set: bookData } // Replace the entire book entry with the new data
            );
            console.log("Data Updated Successfully: ", updateResult);
            res.status(200).json({ action: 'updated', data: updateResult });
        }
        else {
            // If book doesn't exist, create a new entry
            const newBook = new db_schema_book_1.model_Book(bookData);
            const savedBook = yield newBook.save();
            console.log("Data Saved Successfully: ", savedBook);
            res.status(201).json({ action: 'created', data: savedBook });
        }
    }
    catch (error) {
        console.error("Failed to add or update book:", error);
        res.status(500).json({ error: "Failed to add or update book in the database" });
    }
});
exports.updateBook = updateBook;
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("deleteBook Called");
    try {
        const id = req.params.id || req.query.id; // Handle both route and query parameters
        console.log("deleteBook called to delete book:\nid: ", id);
        if (!id) {
            return res.status(400).json({ error: "Missing required parameter: id" });
        }
        // Find the book by id
        const book = yield db_schema_book_1.model_Book.findOne({ id });
        if (!book) {
            return res.status(404).json({ error: "Book Not Found" });
        }
        // Delete the book
        yield db_schema_book_1.model_Book.deleteOne({ id });
        res.status(200).json({ message: "Book Deleted Successfully" });
    }
    catch (error) {
        console.error("Failed to delete book:", error);
        res.status(500).json({ error: "Failed to delete book from the database" });
    }
});
exports.deleteBook = deleteBook;
