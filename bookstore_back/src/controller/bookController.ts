// Import necessary types and models from Express and database schema
import { Request, Response, NextFunction } from 'express'; // Request and Response types for Express
import { model_Book, IBook } from '../database/db_schema_book'; // Book model and schema
import mongoose from 'mongoose';
import CustomError from '../error_manager/customError';
import asyncErrorHandler from '../error_manager/asyncErrorHanlder';


// Function to get all books from the database with pagination
const getAllBooks = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const page: number = Number(req.query.p ?? 0); // Current page number
  const booksPerPage: number = 4; // Number of books per page

  console.log('Page:', page, 'Books Per Page:', booksPerPage, 'Skip:', page * booksPerPage);

  // Fetch books with pagination
  const existingBooks = await model_Book.find({})
    .skip(page * booksPerPage)
    .limit(booksPerPage);

  // Fetch the total count of books
  const totalBooks = await model_Book.countDocuments({});

  if (existingBooks.length > 0) {
    // Respond with paginated books and total count
    res.status(200).json({
      books: existingBooks,
      totalBooks: totalBooks,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / booksPerPage)
    });
  } else {
    // Use CustomError and pass it to the error-handling middleware
    next(new CustomError('No books found for this page.', 404));
  }
});

// Function to get a single book by ISBN
const getBook = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log("getBook Called"); // Log function call

  const { ISBN } = req.params; // Extract the identifier from request parameters
  console.log("getBook called to find book:\nIdentifier: ", ISBN); // Log the identifier

  if (!ISBN) {
    // Use CustomError to handle missing ISBN
    return next(new CustomError('Missing required parameter: ISBN or ID', 400));
  }

  // Determine if the identifier is an _id (assumed to be 24-character long) or an ISBN
  const isObjectId = ISBN.length === 24;

  // Find book by either _id or ISBN
  const query = isObjectId ? { _id: ISBN } : { ISBN: ISBN };
  const book = await model_Book.findOne(query); // Find the book using the appropriate query

  if (!book) {
    // Use CustomError for book not found
    return next(new CustomError('Book not found', 404));
  }

  res.status(200).json(book); // Respond with the book data
});

// Function to update or create a book by ISBN
// Function to update or create a book by ISBN
const updateBook = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log("Updating book function called");

  const { ISBN } = req.params; // Extract the identifier from request parameters
  const bookData = req.body;

  console.log("Identifier from params: ", ISBN);
  console.log("Book data from body: ", bookData);

  if (!ISBN) {
    // Use CustomError to handle missing ISBN
    return next(new CustomError('Missing required parameter: ISBN or ID', 400));
  }

  // Determine if the identifier is an _id (assumed to be 24-character long) or an ISBN
  const isObjectId = ISBN.length === 24;

  // Find book by either _id or ISBN
  const query = isObjectId ? { _id: ISBN } : { ISBN: ISBN };
  const existingBook = await model_Book.findOne(query);

  if (existingBook) {  // Check if the book exists
    let updateFields: object = {};

    if (bookData.review && Array.isArray(bookData.review)) {
      updateFields = {
        $push: { review: { $each: bookData.review } },
      };
    }

    console.log("Query:", query);
    console.log("Update Fields:", updateFields);

    const updateResult = await model_Book.updateOne(query, updateFields);
    console.log("Data Updated Successfully: ", updateResult);

    if (updateResult.matchedCount === 0) {
      return next(new CustomError('Book not found for update', 404));
    }

    if (updateResult.modifiedCount > 0) {
      res.status(200).json({ action: 'updated', data: updateResult });
    } else {
      // If no changes were made, respond with a success status but indicate no changes were necessary
      res.status(200).json({ action: 'no_changes', message: 'No changes were made to the book data because it was already up-to-date.' });
    }
  } else {
    // Use CustomError for book not found
    return next(new CustomError('Book not found', 404));
  }
});


const setBook = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log("setBook called"); // Log function call

  // Validate request body
  if (!Array.isArray(req.body) || req.body.length === 0) {
    return next(new CustomError('Request body should be a non-empty array', 400)); // Use CustomError for invalid body
  }

  const results = []; // Array to store results

  // Loop through each book data in the request body
  for (const bookData of req.body) {
    // Generate a new _id
    const newId = new mongoose.Types.ObjectId();

    // Add _id to bookData
    bookData._id = newId;

    // Check for required fields in each book data
    if (!bookData.ISBN || !bookData.title || !bookData.author || !bookData.publishedYear || !bookData.genre || !bookData.price || !bookData.quantity) {
      return next(new CustomError(`Missing required fields in entry: ${JSON.stringify(bookData)}`, 400)); // Use CustomError for missing fields
    }

    // Set default review if not provided
    if (!bookData.review) {
      bookData.review = ["Not needed"];
    }

    // Search for existing books with the same title and author
    const existingBooks = await model_Book.find({ title: bookData.title, author: bookData.author });

    if (existingBooks.length === 0) {
      // Create a new book if no existing book is found
      const newBook = new model_Book(bookData);
      const savedBook = await newBook.save(); // Save the new book
      console.log("Data Saved Successfully: ", savedBook); // Log success
      results.push({ action: 'created', data: savedBook }); // Store result
    } else {
      // Update the quantity of the existing book
      const updateResult = await model_Book.updateOne(
        { title: bookData.title, author: bookData.author },
        { $inc: { quantity: bookData.quantity } } // Increment the quantity
      );
      console.log("Data Updated Successfully: ", updateResult); // Log success
      results.push({ action: 'updated', data: updateResult }); // Store result
    }
  }

  res.status(200).json(results); // Respond with the results array
});

const deleteBook = asyncErrorHandler(async (req: Request, res: Response, next:NextFunction) => {
  console.log("deleteBook Called"); // Log function call
  const ISBN = req.params.ISBN || req.query.ISBN; // Handle both route and query parameters
  console.log("deleteBook called to delete book:\nISBN: ", ISBN); // Log the ISBN
  if (!ISBN) {
    return next(new CustomError("Missing required parameter: ISBN", 400));
  }
  // Find the book by ISBN
  const book = await model_Book.findOne({ ISBN });
  if (!book) {
    return next(new CustomError("Book Not Found", 404));
  }
  // Delete the book
  await model_Book.deleteOne({ ISBN });
  res.status(200).json({ message: "Book Deleted Successfully" }); // Respond with success message

});

// Export functions for use in routes
export { getAllBooks, setBook, getBook, updateBook, deleteBook };
