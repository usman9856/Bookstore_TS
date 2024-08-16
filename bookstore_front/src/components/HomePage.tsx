import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the TypeScript interface for the Book document
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
}

export default function HomePage(): JSX.Element {
    const [books, setBooks] = useState<IBook[]>([]);
    const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [localCart, setLocalCart] = useState<IBook[]>(() => {
        // Initialize cart from localStorage if it exists
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get("http://localhost:5000/Book/");
                setBooks(response.data);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
        fetchBooks();
    }, []);

    const handleBookClick = (book: IBook) => {
        setSelectedBook(book);
    };

    const togglePopup = () => {
        const userDataString = localStorage.getItem("user");

        if (userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                if (Array.isArray(userData.library) && userData.library.includes(selectedBook?._id)) {
                    setIsPopupOpen(prevState => !prevState);
                } else {
                    alert("You do not have the book in the library!\nOnly reviews are accepted if the book is bought!");
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        } else {
            alert("No user data found. Please log in.");
        }
    };

    const handleSubmit = async () => {
        if (selectedBook && reviewText) {
            try {
                const response = await axios.put(`http://localhost:5000/Book/Update/${selectedBook.ISBN}`, {
                    review: [reviewText],
                });
                if (response.status !== 200) {
                    alert("Failed to submit review. Please try again.");
                }
                window.location.reload();
            } catch (error) {
                alert("Error submitting review: " + error);
            }

            setReviewText("");
            togglePopup();
        } else {
            alert("No selected book or review text provided.");
        }
    };

    const addToCart = (book: IBook) => {
        // Update the local cart state
        const updatedCart = [...localCart, book];
        setLocalCart(updatedCart);

        // Set the updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    return (
        <div className="flex items-center justify-center flex-col">
            <center><h1>Buy Your Book</h1></center>
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg relative w-[500px] h-[400px]">
                        <h3 className="text-xl font-bold mb-4">Add a Review</h3>
                        <textarea
                            className="w-full p-2 border rounded-md mb-4 resize-none h-[200px]"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Write your review here..."
                        ></textarea>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-green-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-green-700 transition duration-200"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        </div>
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                            onClick={togglePopup}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <div className="container overflow-x-auto scroll-container rounded-t-xl rounded-r-xl rounded-l-xl shadow-lg shadow-gray-800 max-w-screen-lg">
                {books.length === 0 ? (
                    <p className="text-center text-white mt-10">No books available.</p>
                ) : (
                    <div className="flex space-x-5 py-10 px-2">
                        {books.map((book) => (
                            <div
                                key={book.ISBN}
                                className="border p-4 rounded-md shadow-md text-center flex-none w-52 bg-gray-800 cursor-pointer h-48 p-4"
                                onClick={() => handleBookClick(book)}
                            >
                                <h2 className="text-xl font-bold mb-2 p-4 text-white h-[50%]">{book.title}</h2>
                                <p className="text-lg font-semibold mb-2 text-white">${book.price.toFixed(2)}</p>
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                                    onClick={() => addToCart(book)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-10 p-10 overflow-y-auto h-[400px] container scroll-container rounded-b-xl rounded-r-xl rounded-l-xl shadow-lg shadow-gray-800 max-w-screen-lg">
                {selectedBook ? (
                    <div>
                        <div className="flex flex-row justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">{selectedBook.title}</h2>
                            <button
                                className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-blue-700 transition duration-200"
                                onClick={togglePopup}
                            >
                                Review
                            </button>
                        </div>
                        <p><strong>Author:</strong> {selectedBook.author}</p>
                        <p><strong>ISBN:</strong> {selectedBook.ISBN}</p>
                        <p><strong>Published Year:</strong> {selectedBook.publishedYear}</p>
                        <p><strong>Genre:</strong> {selectedBook.genre}</p>
                        <p><strong>Price:</strong> ${selectedBook.price.toFixed(2)}</p>
                        <p>
                            <strong>In Stock:</strong>
                            {selectedBook.quantity > 10 ? ' Yes' : selectedBook.quantity > 0 ? ' Yes (Low Quantity)' : ' No'}
                        </p>
                        <p><strong>Quantity:</strong> {selectedBook.quantity}</p>
                        <p><strong>Rating:</strong> {typeof selectedBook.rating === 'number' ? selectedBook.rating.toFixed(1) : 'N/A'}</p>
                        <p><strong>Reviews:</strong></p>
                        <ol className="list-disc pl-5 space-y-2">
                            {selectedBook.review.map((review, index) => (
                                <li key={index} className="p-2 border-spacing-5 border-b-2 mx-[-10px] list-inside list-decimal border-gray-800">
                                    {review}
                                </li>
                            ))}
                        </ol>
                    </div>
                ) : (
                    <p className="text-center">Select a book to see its details.</p>
                )}
            </div>
        </div>
    );
}
