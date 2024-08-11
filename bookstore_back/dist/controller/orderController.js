"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrder = exports.setOrder = exports.getAllOrder = void 0;
const db_schema_order_1 = require("../database/db_schema_order"); // Import the order model and interface
const db_schema_book_1 = require("../database/db_schema_book"); // Assuming the book model is imported like this
// Get All Orders
const getAllOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch orders and populate the 'book' field with full book data
        const orders = yield db_schema_order_1.model_Order.find()
            .populate({
            path: 'book',
            model: db_schema_book_1.model_Book // Ensure the correct model is used for population
        });
        // Format the orders if necessary
        const formattedOrders = orders.map(order => ({
            orderId: order.orderId,
            customerName: order.customerName,
            orderDate: order.orderDate,
            book: order.book,
            status: order.status,
            __v: order.__v
        }));
        return res.status(200).json(formattedOrders);
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});
exports.getAllOrder = getAllOrder;
// Set a New Order
const setOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure and validate required fields
        const { orderId, customerName, orderDate, bookId, status } = req.body;
        if (!orderId || !customerName || !orderDate || !bookId || !status) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        // Check if the book exists
        const book = yield db_schema_book_1.model_Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        // Create the order without specifying the type
        const newOrder = new db_schema_order_1.model_Order({
            orderId,
            customerName,
            orderDate,
            book: book._id, // Associate with the book ID
            status,
        });
        // Save the order to the database
        yield newOrder.save();
        // Respond with the created order
        return res.status(201).json(newOrder);
    }
    catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});
exports.setOrder = setOrder;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('getOrder Called');
    try {
        const { orderId } = req.params; // Extract orderId from request parameters
        console.log("Order Id: ", orderId);
        // Find the order by orderId and populate the 'book' field with full book data
        const order = yield db_schema_order_1.model_Order.findOne({ orderId }).populate({
            path: 'book',
            model: db_schema_book_1.model_Book, // Ensure the correct model is used for population
        });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        return res.status(200).json(order);
    }
    catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});
exports.getOrder = getOrder;
