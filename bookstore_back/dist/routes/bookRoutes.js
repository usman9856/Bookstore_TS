"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookController_1 = require("../controller/bookController");
const router = (0, express_1.Router)();
router.get('/', bookController_1.getAllBooks); //Good
router.get('/:id', bookController_1.getBook); //Good
router.put('/Update/:id', bookController_1.updateBook); //Good
router.post('/Add', bookController_1.setBook); //Good
router.delete('/Delete/:id', bookController_1.deleteBook); //Good
exports.default = router;
