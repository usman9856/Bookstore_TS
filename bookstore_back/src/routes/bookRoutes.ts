import { Router } from 'express';
import { getAllBooks, setBook, getBook, updateBook, deleteBook } from '../controller/bookController';

const router = Router();

// Route to get all books
router.get('/', getAllBooks); // Good

// Route to get a specific book by ISBN
router.get('/:ISBN', getBook); // Good

// Route to update a specific book by ISBN=
router.put('/Update/:ISBN', updateBook); // Good

// Route to add a new book
router.post('/Add', setBook); // Good

// Route to delete a specific book by ISBN
router.delete('/Delete/:ISBN', deleteBook); // Good

export default router;
