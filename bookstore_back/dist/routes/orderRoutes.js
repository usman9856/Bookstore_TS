"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controller/orderController");
const router = (0, express_1.Router)();
router.get('/', orderController_1.getAllOrder); //Good
router.get('/:orderId', orderController_1.getOrder); //Good
router.post('/Buy', orderController_1.setOrder); //Good
exports.default = router;
