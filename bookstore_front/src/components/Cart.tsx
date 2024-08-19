import React, { useEffect, useState } from "react";
import axios from "axios";

interface IBook {
    _id: string;
    ISBN: string;
    title: string;
    author: string;
    publishedYear: number;
    genre: string;
    price: number;
    inStock?: boolean;
    quantity: number;
    rating?: number;
    review: string[];
    quantity_buy: number;
}

export default function Cart(): JSX.Element {
    const [cartBooks, setCartBooks] = useState<IBook[]>([]);

    useEffect(() => {
        const getCartData = () => {
            const cartData = localStorage.getItem('cart');
            if (cartData) {
                const parsedCart = JSON.parse(cartData);

                // Aggregate books by their _id
                const aggregatedBooks: { [key: string]: IBook } = {};
                parsedCart.forEach((book: IBook) => {
                    if (aggregatedBooks[book._id]) {
                        aggregatedBooks[book._id].quantity_buy += 1;
                    } else {
                        aggregatedBooks[book._id] = { ...book, quantity_buy: 1 };
                    }
                });

                setCartBooks(Object.values(aggregatedBooks));
            }
        };
        getCartData();
    }, []);

    const setOrder = async () => {
        try {
            const userDataString = localStorage.getItem('user');
            if (!userDataString) {
                alert('User data not found in localStorage');
                return;
            }

            const userData = JSON.parse(userDataString);
            const { personId, firstName, lastName } = userData;
            const customerName = `${firstName} ${lastName}`;

            let allOrdersSuccessful = true;

            for (const book of cartBooks) {
                try {
                    const response = await axios.post('http://localhost:5000/Order/Buy', {
                        personId,
                        customerName,
                        bookISBN: book.ISBN,
                    });

                    console.log(`Order successful for book: ${book.title}`, response.data);
                } catch (error) {
                    allOrdersSuccessful = false;
                    console.error(`Failed to order book: ${book.title}`, error);
                }
            }

            if (allOrdersSuccessful) {
                alert('Order placed successfully!');
                localStorage.removeItem('cart'); // Clear cart after successful order
                setCartBooks([]); // Clear local state
            } else {
                alert('Some orders failed. Please check the console for details.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="container overflow-x-auto scroll-container rounded-t-xl rounded-r-xl rounded-l-xl shadow-lg shadow-gray-800 max-w-screen-lg">
                <div className="flex flex-row justify-between">
                    <h1 className="mx-10 my-5 text-5xl font-bold uppercase">Cart</h1>
                    <button onClick={setOrder} className="mx-10 my-5 text-lg font-bold rounded-xl px-4 bg-green-500 text-white hover:opacity-80">
                        Order
                    </button>
                </div>
                {cartBooks.length === 0 ? (
                    <p className="text-center mt-10">No books in your cart.</p>
                ) : (
                    <div className="space-y-5 py-10 px-2">
                        {cartBooks.map((book) => (
                            <div
                                key={book._id}
                                className="border p-4 rounded-md shadow-md flex justify-between items-center bg-gray-800"
                            >
                                <div>
                                    <h2 className="text-xl font-bold mb-2 text-white">{book.title}</h2>
                                    <p className="text-lg font-semibold mb-2 text-white">By: {book.author}</p>
                                    <p className="text-lg font-semibold mb-2 text-white">Quantity: {book.quantity_buy}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <p className="text-lg font-semibold text-white">${(book.price * book.quantity_buy).toFixed(2)}</p>
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                        Review
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
