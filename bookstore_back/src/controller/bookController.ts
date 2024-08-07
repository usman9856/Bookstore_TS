import { IBook } from '../database/db_schema_book';
import { Request, Response } from 'express';



const books: IBook[] = [];

const getAllBooks = (req: Request, res: Response): void => {
    // Send a simple JSON response
    res.json({ message: "Hello, This Function is getAllBooks" });
};




const getBookById = (id: number): IBook | undefined => {
  return books.find(book => book.id === id);
};

const addBook = (book: IBook): IBook => {
  books.push(book);
  return book;
};

// const updateBook = (id: number, updatedBook: Partial<IBook>): IBook | undefined => {
// //   const bookIndex = books.findIndex(book => book.id === id);
// //   if (bookIndex === -1) return undefined;

// //   const existingBook = books[bookIndex];
// //   const newBook = { ...existingBook, ...updatedBook };
// //   books[bookIndex] = newBook;

// //   return newBook;
// };

const deleteBook = (id: number): boolean => {
  const bookIndex = books.findIndex(book => book.id === id);
  if (bookIndex === -1) return false;

  books.splice(bookIndex, 1);
  return true;
};

export {getAllBooks, getBookById, addBook, deleteBook };