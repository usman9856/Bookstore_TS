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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrder = exports.setOrder = exports.getAllOrder = void 0;
const db_schema_order_1 = require("../database/db_schema_order"); // Order model
const db_schema_book_1 = require("../database/db_schema_book"); // Book model
const db_schema_person_1 = __importDefault(require("../database/db_schema_person")); // Person model
// Initialize variables for generating unique order IDs
let orderNumber = 0; // Counter for order numbers
let lastGeneratedDate = '20240101'; // Last generated date for order IDs
// Function to get all orders
const getAllOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all orders and populate the 'book' field with book data
        const orders = yield db_schema_order_1.model_Order.find()
            .populate({
            path: 'book',
            model: db_schema_book_1.model_Book // Populate with the book model
        });
        // Format the orders if necessary
        const formattedOrders = orders.map(order => ({
            orderId: order.orderId,
            customerName: order.customerName,
            orderDate: order.orderDate,
            book: order.book,
            status: order.status,
            __v: order.__v // Optional: version key for Mongoose
        }));
        return res.status(200).json(formattedOrders); // Respond with formatted orders
    }
    catch (error) {
        console.error('Error fetching orders:', error); // Log error if fetching fails
        return res.status(500).json({ error: 'Server error' }); // Respond with server error
    }
});
exports.getAllOrder = getAllOrder;
// Function to get a specific order by orderId
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('getOrder Called'); // Log function call
    try {
        const { orderId } = req.params; // Extract orderId from request parameters
        console.log("Order Id: ", orderId); // Log the orderId
        // Find the order by orderId and populate the 'book' field
        const order = yield db_schema_order_1.model_Order.findOne({ orderId }).populate({
            path: 'book',
            model: db_schema_book_1.model_Book, // Populate with the book model
        });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' }); // Respond with not found error
        }
        return res.status(200).json(order); // Respond with the order data
    }
    catch (error) {
        console.error('Error fetching order:', error); // Log error if fetching fails
        return res.status(500).json({ error: 'Server error' }); // Respond with server error
    }
});
exports.getOrder = getOrder;
// Function to set (create) a new order
const setOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Set Order Called"); // Log function call
    try {
        // Extract necessary data from request body
        const { personId, customerName, bookISBN } = req.body;
        const person = yield db_schema_person_1.default.findOne({ person_id: personId });
        const book = yield db_schema_book_1.model_Book.findOne({ ISBN: bookISBN });
        const today = new Date(); // Get current date
        const orderDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`; // Format order date
        // Validate required fields
        if (!customerName || !orderDate || !bookISBN) {
            return res.status(400).json({ message: 'Missing required fields' }); // Respond with validation error
        }
        // Check if the book exists and is in stock
        if (!book) {
            return res.status(404).json({ message: 'Book not found' }); // Respond with not found error
        }
        else if (book.quantity <= 0) {
            return res.status(400).json({ message: 'Book is out of stock' }); // Respond with out of stock error
        } ////////////////////////////////////////// Test this code snippet for future additions of books
        else if (!person.library.includes(book._id)) {
            person.library.push(book._id);
        }
        else {
            console.log("Book already exists in the library.");
        }
        // Check if the person exists
        if (!person) {
            return res.status(404).json({ message: 'Person not found' }); // Respond with not found error
        }
        // Generate a new order ID
        const orderId = generateOrderId(); // Call function to generate order ID
        const status = 'Processing'; // Set initial order status
        // Create the new order
        const newOrder = new db_schema_order_1.model_Order({
            orderId,
            customerName,
            email: person.email, // Use email from person
            orderDate: new Date(), // Set order date
            book: book._id, // Set book reference
            status
        });
        // Save the new order to the database
        yield newOrder.save();
        // Update the book's quantity
        book.quantity -= 1;
        yield book.save();
        // Add the book to the person's library and order history
        person.library.push(book._id);
        person.orderHistory.push(newOrder._id);
        yield person.save();
        // Respond with success message
        res.status(201).json({ message: 'Order set successfully', order: newOrder });
    }
    catch (error) {
        console.error('Error setting order:', error); // Log error if setting fails
        res.status(500).json({ message: 'Internal server error' }); // Respond with server error
    }
});
exports.setOrder = setOrder;
// Function to generate a unique order ID
const generateOrderId = () => {
    const today = new Date(); // Get current date
    const formattedDate = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`; // Format date
    // Reset orderNumber if the date has changed
    if (formattedDate !== lastGeneratedDate) {
        orderNumber = 0;
        lastGeneratedDate = formattedDate;
    }
    orderNumber += 1;
    const orderId = `${formattedDate}${String(orderNumber).padStart(4, '0')}`; // Generate order ID
    return orderId;
};
