import { Router } from 'express';
import { getAllBooks, getBookById, addBook, deleteBook  } from '../controller/bookController';

const router = Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', addBook);
// router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;