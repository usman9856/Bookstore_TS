// Import necessary modules and models
import { Request, Response, NextFunction } from 'express'; // Request and Response types for Express
import { model_Order } from '../database/db_schema_order'; // Order model
import { model_Book } from '../database/db_schema_book'; // Book model
import model_person from '../database/db_schema_person'; // Person model
import mongoose, { ObjectId } from 'mongoose'; // Mongoose and ObjectId types
import CustomError from '../error_manager/customError';
import asyncErrorHandler from '../error_manager/asyncErrorHanlder';


// Initialize variables for generating unique order IDs
let orderNumber: number = 0; // Counter for order numbers
let lastGeneratedDate: string = '20240101'; // Last generated date for order IDs

// Function to get all orders
const getAllOrder = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log('getAllOrder Called'); // Log function entry
    const page: number = Number(req.query.p ?? 0);
    const ordersPerPage: number = 2;
    console.log(`Pagination details - Page: ${page}, Orders per Page: ${ordersPerPage}, Skipping: ${page * ordersPerPage} orders`);
    try {
        console.log('Fetching orders from the database...'); // Log start of fetch operation
        // Fetch all orders and populate the 'book' field with book data
        const orders = await model_Order.find()
            .populate({
                path: 'book',
                model: model_Book, // Populate with the book model
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
    } catch (error) {
        console.error('Error fetching orders:', error); // Log the error details
        return next(new CustomError("Unable to fetch the orders", 500)); // Handle the error
    }
});



// Function to get a specific order by email with pagination
const getOrder = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log('getOrder Called'); // Log function call
    try {
        // Extract and handle pagination parameters
        const page: number = Number(req.query.p ?? 0);
        const ordersPerPage: number = 2;
        console.log('Page, ordersPerPage, skip:', page, ordersPerPage, page * ordersPerPage);
        // Extract email from request parameters
        const { email } = req.params;
        console.log("Email:", email); // Log the email
        // Find orders by email and populate the 'book' field with pagination
        const orders = await model_Order.find({ email })
            .populate({
                path: 'book',
                model: model_Book, // Populate with the book model
            })
            .skip(page * ordersPerPage)
            .limit(ordersPerPage);
        // Get the total count of orders for the given email
        const totalOrders = await model_Order.countDocuments({ email });
        if (orders.length === 0) {
            console.log('No orders found for this email');
            return next(new CustomError('No orders found for this email', 404));
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
    } catch (error) {
        return next(new CustomError('Order Could not be fetched', 500));
    }
});


const setOrder = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("Set Order Called, req.body: ", req.body); // Log function call
    try {
        // Extract necessary data from request body
        const { personId, customerName, bookISBN } = req.body;
        const person = await model_person.findOne({ person_id: personId });
        const book = await model_Book.findOne({ ISBN: bookISBN });
        const today = new Date(); // Get current date
        const orderDate: string = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`; // Format order date
        // Validate required fields
        if (!customerName || !orderDate || !bookISBN) {
            return next(new CustomError('Missing required fields', 400))
            // return res.status(400).json({ message: 'Missing required fields' }); // Respond with validation error
        }
        // Check if the book exists and is in stock
        if (!book) {
            return next(new CustomError('Book Not Found', 404))
        }
        else if (book.quantity <= 0) {
            return next(new CustomError('Book is out of stock', 400))
        }
        else if (!person!.library.includes(book._id as ObjectId)) {
            person!.library.push(book._id as ObjectId);
        } else {
            return next(new CustomError('Book already in library', 400))
        }
        // Check if the person exists
        if (!person) {
            return next(new CustomError('User Id not Found', 404));
        }
        // Generate a new order ID
        const orderId = generateOrderId(); // Call function to generate order ID
        const status: string = 'Processing'; // Set initial order status
        // Create the new order
        const newOrder = new model_Order({
            orderId,
            customerName,
            email: person.email, // Use email from person
            orderDate: new Date(), // Set order date
            book: book._id as ObjectId, // Set book reference
            status
        });
        // Save the new order to the database
        await newOrder.save();
        // Update the book's quantity
        book.quantity -= 1;
        await book.save();
        // Add the book to the person's library and order history
        person.library.push(book._id as ObjectId);
        person.orderHistory.push(newOrder._id as ObjectId);
        await person.save();
        // Respond with success message
        res.status(201).json({ message: 'Order set successfully', order: newOrder });
    } catch (error) {
        return next(new CustomError('Internal server error', 500));
    }
})

// Function to generate a unique order ID
const generateOrderId = (): string => {
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

// Export functions for use in routes
export { getAllOrder, setOrder, getOrder };
