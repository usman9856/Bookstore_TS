import { Router } from 'express';
import { getAllBooks, setBook, getBook, updateBook, deleteBook } from '../controller/bookController';

const router = Router();

router.get('/', getAllBooks); //Good
router.get('/:id', getBook); //Good
router.put('/Update/:id', updateBook); //Good
router.post('/Add', setBook); //Good
router.delete('/Delete/:id', deleteBook); //Good

export default router;
