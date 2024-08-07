"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.addBook = exports.getBookById = exports.getAllBooks = void 0;
const books = [];
const getAllBooks = (req, res) => {
    // Send a simple JSON response
    res.json({ message: "Hello, This Function is getAllBooks" });
};
exports.getAllBooks = getAllBooks;
const getBookById = (id) => {
    return books.find(book => book.id === id);
};
exports.getBookById = getBookById;
const addBook = (book) => {
    books.push(book);
    return book;
};
exports.addBook = addBook;
// const updateBook = (id: number, updatedBook: Partial<IBook>): IBook | undefined => {
// //   const bookIndex = books.findIndex(book => book.id === id);
// //   if (bookIndex === -1) return undefined;
// //   const existingBook = books[bookIndex];
// //   const newBook = { ...existingBook, ...updatedBook };
// //   books[bookIndex] = newBook;
// //   return newBook;
// };
const deleteBook = (id) => {
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex === -1)
        return false;
    books.splice(bookIndex, 1);
    return true;
};
exports.deleteBook = deleteBook;
