import { Router } from 'express';
import { getAllBooks,setBook,getBook,updateBook } from '../controller/bookController';

const router = Router();

router.get('/',getAllBooks);
router.get('/:title', getBook);
router.put('/:title', updateBook);
router.post('/Add',setBook);

export default router;
