// Import necessary modules and models
import { Request, Response } from 'express'; // Request and Response types for Express
import { model_Order } from '../database/db_schema_order'; // Order model
import { model_Book } from '../database/db_schema_book'; // Book model
import model_person from '../database/db_schema_person'; // Person model
import mongoose, { ObjectId } from 'mongoose'; // Mongoose and ObjectId types

// Initialize variables for generating unique order IDs
let orderNumber: number = 0; // Counter for order numbers
let lastGeneratedDate: string = '20240101'; // Last generated date for order IDs

// Function to get all orders
const getAllOrder = async (req: Request, res: Response) => {
    console.log('getAllOrder Called'); // Log function call

    try {
        const page: number = Number(req.query.p ?? 0);
        const ordersPerPage: number = 2;
        console.log('Page, ordersPerPage, skip:', page, ordersPerPage, page * ordersPerPage);

        // Fetch all orders and populate the 'book' field with book data
        const orders = await model_Order.find()
            .populate({
                path: 'book',
                model: model_Book // Populate with the book model
            })
            .skip(page * ordersPerPage)
            .limit(ordersPerPage);

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
    } catch (error) {
        console.error('Error fetching orders:', error); // Log error if fetching fails
        return res.status(500).json({ error: 'Server error' }); // Respond with server error
    }
};

// Function to get a specific order by orderId

// Function to get a specific order by email with pagination
const getOrder = async (req: Request, res: Response) => {
    console.log('getOrder Called'); // Log function call

    try {
        // Extract and handle pagination parameters
        const page: number = Number(req.query.p ?? 0);
        const ordersPerPage: number = 2;
        console.log('Page, ordersPerPage, skip:', page, ordersPerPage, page * ordersPerPage);

        // Extract email from request parameters
        const { email } = req.params;
        console.log("Email:", email); // Log the email

        // Find orders by email and populate the 'book' field
        const orders = await model_Order.find({ email })
            .populate({
                path: 'book',
                model: model_Book, // Populate with the book model
            })
            .skip(page * ordersPerPage)
            .limit(ordersPerPage);

        if (orders.length === 0) {
            console.log('No orders found for this email');
            return res.status(404).json({ error: 'No orders found for this email' });
        }

        // Optionally, format the orders data if necessary
        const formattedOrders = orders.map(order => ({
            orderId: order.orderId,
            customerName: order.customerName,
            orderDate: order.orderDate,
            book: order.book,
            status: order.status,
            __v: order.__v // Optional: version key for Mongoose
        }));

        return res.status(200).json(formattedOrders); // Respond with the formatted orders data
    } catch (error) {
        console.error('Error fetching orders:', error); // Log error if fetching fails
        return res.status(500).json({ error: 'Server error' });
    }
};

const setOrder = async (req: Request, res: Response) => {
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
            return res.status(400).json({ message: 'Missing required fields' }); // Respond with validation error
        }

        // Check if the book exists and is in stock
        if (!book) {
            return res.status(404).json({ message: 'Book not found' }); // Respond with not found error
        }
        else if (book.quantity <= 0) {
            return res.status(400).json({ message: 'Book is out of stock' }); // Respond with out of stock error
        }////////////////////////////////////////// Test this code snippet for future additions of books
        else if (!person!.library.includes(book._id as ObjectId)) {
            person!.library.push(book._id as ObjectId);
        } else {
            console.log("Book already exists in the library.");
        }
        // Check if the person exists
        if (!person) {
            return res.status(404).json({ message: 'Person not found' }); // Respond with not found error
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
        console.error('Error setting order:', error); // Log error if setting fails
        res.status(500).json({ message: 'Internal server error' }); // Respond with server error
    }
};




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
