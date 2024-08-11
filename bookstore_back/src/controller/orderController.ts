import { Request, Response } from 'express';
import { model_Order, IOrder } from '../database/db_schema_order'; // Import the order model and interface
import { model_Book } from '../database/db_schema_book'; // Assuming the book model is imported like this

// Get All Orders

const getAllOrder = async (req: Request, res: Response) => {
    try {
        // Fetch orders and populate the 'book' field with full book data
        const orders = await model_Order.find()
            .populate({
                path: 'book',
                model: model_Book // Ensure the correct model is used for population
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
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Set a New Order
const setOrder = async (req: Request, res: Response) => {
    try {
        // Destructure and validate required fields
        const { orderId, customerName, orderDate, bookId, status } = req.body;
        if (!orderId || !customerName || !orderDate || !bookId || !status) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the book exists
        const book = await model_Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Create the order without specifying the type
        const newOrder = new model_Order({
            orderId,
            customerName,
            orderDate,
            book: book._id,  // Associate with the book ID
            status,
        });

        // Save the order to the database
        await newOrder.save();

        // Respond with the created order
        return res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const getOrder = async (req: Request, res: Response) => {
    console.log('getOrder Called');
    try {
        const { orderId } = req.params; // Extract orderId from request parameters
        console.log("Order Id: ", orderId);
        // Find the order by orderId and populate the 'book' field with full book data
        const order = await model_Order.findOne({ orderId }).populate({
            path: 'book',
            model: model_Book, // Ensure the correct model is used for population
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};


export { getAllOrder, setOrder, getOrder };
