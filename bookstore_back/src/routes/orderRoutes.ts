import { Router } from 'express';
import { getAllOrder, setOrder, getOrder, } from '../controller/orderController';

const router = Router();

router.get('/', getAllOrder); //Good
// router.get('/:orderId', getOrder ); //Good
router.get('/:email', getOrder ); //Good
router.post('/Buy', setOrder); //Good

export default router;
