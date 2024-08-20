// Import necessary types and models from Express and database schema
import { Request, Response } from 'express'; // Request and Response types for Express
import { model_Book, IBook } from '../database/db_schema_book'; // Book model and schema
import mongoose from 'mongoose';


// Function to get all books from the database
// Function to get all books from the database with pagination
const getAllBooks = async (req: Request, res: Response) => {
  const page: number = Number(req.query.p ?? 0); // Current page number
  const bookPerPage: number = 4; // Number of books per page

  console.log('Page, bookPerPage, skip:', page, bookPerPage, page * bookPerPage);

  try {
    // Fetch books with pagination
    const existingBooks = await model_Book.find({})
      .skip(page * bookPerPage)
      .limit(bookPerPage);

    // Fetch the total count of books
    const totalBooks = await model_Book.countDocuments({});

    if (existingBooks.length > 0) {
      // Respond with paginated books and total count
      res.status(200).json({
        books: existingBooks,
        totalBooks: totalBooks,
        currentPage: page,
        totalPages: Math.ceil(totalBooks / bookPerPage)
      });
    } else {
      res.status(404).json({ message: "No books found for this page." });
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: "Error fetching books from the database" });
  }
};




// Function to get a single book by ISBN
const getBook = async (req: Request, res: Response): Promise<void> => {
  console.log("getBook Called"); // Log function call
  try {
    const { ISBN } = req.params; // Extract the identifier from request parameters
    console.log("getBook called to find book:\nIdentifier: ", ISBN); // Log the identifier

    if (!ISBN) {
      res.status(400).json({ error: "Missing required parameter: ISBN or ID" }); // Respond with error if identifier is missing
      return;
    }

    // Determine if the identifier is an _id (assumed to be 24-character long) or an ISBN
    const isObjectId = ISBN.length === 24;

    // Find book by either _id or ISBN
    const query = isObjectId ? { _id: ISBN } : { ISBN: ISBN };
    const book = await model_Book.findOne(query); // Find the book using the appropriate query

    if (!book) {
      res.status(404).json({ error: "Book not found" }); // Respond with error if book not found
      return;
    }

    res.status(200).json(book); // Respond with the book data
  } catch (error) {
    console.error("Failed to get book:", error); // Log error if getting book fails
    res.status(500).json({ error: "Failed to get book from the database" }); // Respond with error
  }
};

// Function to update or create a book by ISBN
const updateBook = async (req: Request, res: Response): Promise<void> => {
  console.log("Updating book function called");

  try {
    const { ISBN } = req.params; // Extract the identifier from request parameters
    const bookData = req.body;

    console.log("Identifier from params: ", ISBN);
    console.log("Book data from body: ", bookData);

    if (!ISBN) {
      res.status(400).json({ error: "Missing required parameter: ISBN or ID" }); // Respond with error if identifier is missing
      return;
    }

    // Determine if the identifier is an _id (assumed to be 24-character long) or an ISBN
    const isObjectId = ISBN.length === 24;

    // Find book by either _id or ISBN
    const query = isObjectId ? { _id: ISBN } : { ISBN: ISBN };
    const existingBook = await model_Book.findOne(query);

    if (existingBook) {
      let updateFields: any = {};

      if (bookData.review && Array.isArray(bookData.review)) {
        updateFields = {
          $push: { review: { $each: bookData.review } },
        };
      }

      console.log("Query:", query);
      console.log("Update Fields:", updateFields);

      const updateResult = await model_Book.updateOne(query, updateFields);
      console.log("Data Updated Successfully: ", updateResult);

      if (updateResult.acknowledged) {
        res.status(200).json({ action: 'updated', data: updateResult });
      } else {
        res.status(500).json({ error: "Update not acknowledged by MongoDB" });
      }
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    console.error("Failed to update book:", error);
    res.status(500).json({ error: "Failed to update book in the database" });
  }
};


// Function to add or update books in the database
const setBook = async (req: Request, res: Response): Promise<void> => {
  console.log("setBook called"); // Log function call
  try {
    // Validate request body
    if (!Array.isArray(req.body) || req.body.length === 0) {
      res.status(400).json({ error: "Request body should be a non-empty array" }); // Respond with error if invalid
      return;
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
        res.status(400).json({ error: `Missing required fields in entry: ${JSON.stringify(bookData)}` }); // Respond with error if missing fields
        return;
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
  } catch (error) {
    console.error("Failed to add or update book:", error); // Log error if adding or updating fails
    res.status(500).json({ error: "Failed to add or update book in the database" }); // Respond with error
  }
};



const deleteBook = async (req: Request, res: Response) => {
  console.log("deleteBook Called"); // Log function call
  try {
    const ISBN = req.params.ISBN || req.query.ISBN; // Handle both route and query parameters
    console.log("deleteBook called to delete book:\nISBN: ", ISBN); // Log the ISBN
    if (!ISBN) {
      return res.status(400).json({ error: "Missing required parameter: ISBN" }); // Respond with error if ISBN is missing
    }
    // Find the book by ISBN
    const book = await model_Book.findOne({ ISBN });
    if (!book) {
      return res.status(404).json({ error: "Book Not Found" }); // Respond with error if book not found
    }
    // Delete the book
    await model_Book.deleteOne({ ISBN });
    res.status(200).json({ message: "Book Deleted Successfully" }); // Respond with success message
  } catch (error) {
    console.error("Failed to delete book:", error); // Log error if deleting fails
    res.status(500).json({ error: "Failed to delete book from the database" }); // Respond with error
  }
};

// Export functions for use in routes
export { getAllBooks, setBook, getBook, updateBook, deleteBook };
