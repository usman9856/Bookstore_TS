import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface IBook {
    _id: string;
    title: string;
    author: string;
    price: number;
    quantity_buy: number;
}

interface IOrder {
    orderId: string;
    customerName: string;
    email: string;
    orderDate: Date;
    book: IBook;
    status: string;
}

export default function Order(): JSX.Element {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userDataString = localStorage.getItem('user');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    const email = userData.email;
                    if (email) {
                        const response = await axios.get(`http://localhost:5000/Order/${email}`);
                        setOrders(response.data);
                    } else {
                        setError('Email not found in user data');
                    }
                } else {
                    setError('User data not found in localStorage');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Error fetching orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex justify-center items-center">
            <div className="container overflow-x-auto scroll-container rounded-t-xl rounded-r-xl rounded-l-xl shadow-lg shadow-gray-800 max-w-screen-lg">
                <div className="flex flex-row justify-between">
                    <h1 className="mx-10 my-5 text-5xl font-bold uppercase">Orders</h1>
                </div>
                {orders.length === 0 ? (
                    <p className="text-center mt-10">No orders found.</p>
                ) : (
                    <div className="space-y-5 py-10 px-2">
                        {orders.map((order) => (
                            <div
                                key={order.orderId}
                                className="border p-4 rounded-md shadow-md flex flex-col bg-gray-800 text-white"
                            >
                                <div className="mb-4">
                                    <h2 className="text-2xl font-bold mb-2">Order ID: {order.orderId}</h2>
                                    <p className="text-lg font-semibold mb-2">Customer: {order.customerName}</p>
                                    <p className="text-lg mb-2">Email: {order.email}</p>
                                    <p className="text-lg mb-2">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                    <p className="text-lg mb-2">Status: {order.status}</p>
                                </div>
                                <div className="border-t pt-4 mt-4">
                                    <h3 className="text-xl font-bold mb-2">Book Details</h3>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="text-lg font-semibold">{order.book.title}</h4>
                                            <p className="text-md">By: {order.book.author}</p>
                                            <p className="text-md">Price: ${order.book.price.toFixed(2)}</p>
                                            <p className="text-md">Quantity: {order.book.quantity_buy}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <p className="text-lg font-semibold">${(order.book.price * order.book.quantity_buy).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
