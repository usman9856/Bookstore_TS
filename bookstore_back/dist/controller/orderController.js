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
const customError_1 = __importDefault(require("../error_manager/customError"));
const asyncErrorHanlder_1 = __importDefault(require("../error_manager/asyncErrorHanlder"));
// Initialize variables for generating unique order IDs
let orderNumber = 0; // Counter for order numbers
let lastGeneratedDate = '20240101'; // Last generated date for order IDs
// Function to get all orders
const getAllOrder = (0, asyncErrorHanlder_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('getAllOrder Called'); // Log function entry
    const page = Number((_a = req.query.p) !== null && _a !== void 0 ? _a : 0);
    const ordersPerPage = 2;
    console.log(`Pagination details - Page: ${page}, Orders per Page: ${ordersPerPage}, Skipping: ${page * ordersPerPage} orders`);
    try {
        console.log('Fetching orders from the database...'); // Log start of fetch operation
        // Fetch all orders and populate the 'book' field with book data
        const orders = yield db_schema_order_1.model_Order.find()
            .populate({
            path: 'book',
            model: db_schema_book_1.model_Book, // Populate with the book model
        })
            .skip(page * ordersPerPage)
            .limit(ordersPerPage);
        console.log(`Fetched ${orders.length} orders from the database`); // Log the number of fetched orders
        // Format the orders if necessary
        const formattedOrders = orders.map(order => ({
            orderId: order.orderId,
            customerName: order.customerName,
            orderDate: order.orderDate,
            book: order.book,
            status: order.status,
        }));
        console.log('Formatting completed, sending response to client'); // Log formatting and response
        // Respond with formatted orders
        res.status(200).json(formattedOrders);
        console.log('Response sent successfully'); // Log success of the response
    }
    catch (error) {
        console.error('Error fetching orders:', error); // Log the error details
        return next(new customError_1.default("Unable to fetch the orders", 500)); // Handle the error
    }
}));
exports.getAllOrder = getAllOrder;
// Function to get a specific order by email with pagination
const getOrder = (0, asyncErrorHanlder_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('getOrder Called'); // Log function call
    try {
        // Extract and handle pagination parameters
        const page = Number((_a = req.query.p) !== null && _a !== void 0 ? _a : 0);
        const ordersPerPage = 2;
        console.log('Page, ordersPerPage, skip:', page, ordersPerPage, page * ordersPerPage);
        // Extract email from request parameters
        const { email } = req.params;
        console.log("Email:", email); // Log the email
        // Find orders by email and populate the 'book' field with pagination
        const orders = yield db_schema_order_1.model_Order.find({ email })
            .populate({
            path: 'book',
            model: db_schema_book_1.model_Book, // Populate with the book model
        })
            .skip(page * ordersPerPage)
            .limit(ordersPerPage);
        // Get the total count of orders for the given email
        const totalOrders = yield db_schema_order_1.model_Order.countDocuments({ email });
        if (orders.length === 0) {
            console.log('No orders found for this email');
            return next(new customError_1.default('No orders found for this email', 404));
        }
        // Optionally, format the orders data if necessary
        const formattedOrders = orders.map(order => ({
            orderId: order.orderId,
            customerName: order.customerName,
            orderDate: order.orderDate,
            book: order.book,
            status: order.status,
        }));
        // Respond with the paginated orders data
        res.status(200).json({
            orders: formattedOrders,
            totalOrders: totalOrders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / ordersPerPage)
        });
    }
    catch (error) {
        return next(new customError_1.default('Order Could not be fetched', 500));
    }
}));
exports.getOrder = getOrder;
const setOrder = (0, asyncErrorHanlder_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Set Order Called, req.body: ", req.body); // Log function call
    try {
        // Extract necessary data from request body
        const { personId, customerName, bookISBN } = req.body;
        const person = yield db_schema_person_1.default.findOne({ person_id: personId });
        const book = yield db_schema_book_1.model_Book.findOne({ ISBN: bookISBN });
        const today = new Date(); // Get current date
        const orderDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`; // Format order date
        // Validate required fields
        if (!customerName || !orderDate || !bookISBN) {
            return next(new customError_1.default('Missing required fields', 400));
            // return res.status(400).json({ message: 'Missing required fields' }); // Respond with validation error
        }
        // Check if the book exists and is in stock
        if (!book) {
            return next(new customError_1.default('Book Not Found', 404));
        }
        else if (book.quantity <= 0) {
            return next(new customError_1.default('Book is out of stock', 400));
        }
        else if (!person.library.includes(book._id)) {
            person.library.push(book._id);
        }
        else {
            return next(new customError_1.default('Book already in library', 400));
        }
        // Check if the person exists
        if (!person) {
            return next(new customError_1.default('User Id not Found', 404));
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
        return next(new customError_1.default('Internal server error', 500));
    }
}));
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
