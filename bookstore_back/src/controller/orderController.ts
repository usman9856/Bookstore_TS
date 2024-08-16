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
    try {
        // Fetch all orders and populate the 'book' field with book data
        const orders = await model_Order.find()
            .populate({
                path: 'book',
                model: model_Book // Populate with the book model
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
    } catch (error) {
        console.error('Error fetching orders:', error); // Log error if fetching fails
        return res.status(500).json({ error: 'Server error' }); // Respond with server error
    }
};

// Function to get a specific order by orderId
const getOrder = async (req: Request, res: Response) => {
    console.log('getOrder Called'); // Log function call
    try {
        const { email } = req.params; // Extract email from request parameters
        console.log("Email: ", email); // Log the email

        // Find orders by email and populate the 'book' field
        const orders = await model_Order.find({ email }).populate({
            path: 'book',
            model: model_Book, // Populate with the book model
        });

        if (orders.length === 0) {
            return res.status(404).json({ error: 'No orders found for this email' }); // Respond with not found error
        }

        return res.status(200).json(orders); // Respond with the orders data
    } catch (error) {
        console.error('Error fetching orders:', error); // Log error if fetching fails
        return res.status(500).json({ error: 'Server error' }); // Respond with server error
    }
};

// const getOrder = async (req: Request, res: Response) => {
//     console.log('getOrder Called'); // Log function call
//     try {
//         const { orderId } = req.params; // Extract orderId from request parameters
//         console.log("Order Id: ", orderId); // Log the orderId

//         // Find the order by orderId and populate the 'book' field
//         const order = await model_Order.findOne({ orderId }).populate({
//             path: 'book',
//             model: model_Book, // Populate with the book model
//         });

//         if (!order) {
//             return res.status(404).json({ error: 'Order not found' }); // Respond with not found error
//         }

//         return res.status(200).json(order); // Respond with the order data
//     } catch (error) {
//         console.error('Error fetching order:', error); // Log error if fetching fails
//         return res.status(500).json({ error: 'Server error' }); // Respond with server error
//     }
// };

// Function to set (create) a new order
const setOrder = async (req: Request, res: Response) => {
    console.log("Set Order Called"); // Log function call
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
