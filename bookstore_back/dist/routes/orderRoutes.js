"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controller/orderController");
const router = (0, express_1.Router)();
router.get('/', orderController_1.getAllOrder); //Working
router.get('/:orderId', orderController_1.getOrder); //Working
router.post('/Add', orderController_1.setOrder); //Working
// router.delete('/Delete/:orderId', deleteOrder); //Working
exports.default = router;
