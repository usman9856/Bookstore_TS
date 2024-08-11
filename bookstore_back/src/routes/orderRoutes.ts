import { Router } from 'express';
import { getAllOrder, setOrder, getOrder } from '../controller/orderController';

const router = Router();

router.get('/', getAllOrder); //Working
router.get('/:orderId', getOrder ); //Working
router.post('/Add', setOrder); //Working
// router.delete('/Delete/:orderId', deleteOrder); //Working

export default router;
