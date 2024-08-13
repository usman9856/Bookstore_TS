"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookController_1 = require("../controller/bookController");
const router = (0, express_1.Router)();
// Route to get all books
router.get('/', bookController_1.getAllBooks); // Good
// Route to get a specific book by ISBN
router.get('/:ISBN', bookController_1.getBook); // Good
// Route to update a specific book by ISBN=
router.put('/Update/:ISBN', bookController_1.updateBook); // Good
// Route to add a new book
router.post('/Add', bookController_1.setBook); // Good
// Route to delete a specific book by ISBN
router.delete('/Delete/:ISBN', bookController_1.deleteBook); // Good
exports.default = router;
