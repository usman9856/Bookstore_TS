import React, { useEffect, useState } from "react";
import axios from "axios";
import AddBookPopup from "./AddBookPopup"; // Adjust the import based on your file structure
import BookDetailsPopup from "./BookDetailPopup"; // Adjust the import based on your file structure

export interface IBook {
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
    const [isAdmin, setIsAdmin] = useState(true); // State to track if the user is an admin
    const [isAddBookPopupOpen, setIsAddBookPopupOpen] = useState(false); // State to track if the add book popup is open

    const [localCart, setLocalCart] = useState<IBook[]>(() => {
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
        setIsPopupOpen(true); // Open the book details popup
    };

    const handleReviewSubmit = async (reviewText: string) => {
        if (selectedBook) {
            try {
                const response = await axios.put(`http://localhost:5000/Book/Update/${selectedBook.ISBN}`, {
                    review: [reviewText],
                });
                if (response.status === 200) {
                    // Update the book list after review submission
                    setBooks(books.map(book =>
                        book.ISBN === selectedBook.ISBN
                            ? { ...book, review: [...book.review, reviewText] }
                            : book
                    ));
                } else {
                    alert("Failed to submit review. Please try again.");
                }
            } catch (error) {
                alert("Error submitting review: " + error);
            }
            setIsPopupOpen(false);
        } else {
            alert("No selected book to submit a review for.");
        }
    };

    const addToCart = (book: IBook) => {
        const updatedCart = [...localCart, book];
        setLocalCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const toggleAddBookPopup = () => {
        setIsAddBookPopupOpen(prevState => !prevState);
    };

    return (
        <div className="p-6">
            <div className="flex flex-row justify-between mx-4">
                <h1 className="text-2xl font-bold mb-4">Library</h1>
                {isAdmin && (
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-lg hover:bg-blue-600 transition duration-200"
                        onClick={toggleAddBookPopup}
                    >
                        Add New Book
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                {books.map(book => (
                    <div
                        key={book._id}
                        className="border rounded-lg p-4 shadow-lg cursor-pointer hover:shadow-xl transition duration-200"
                        onClick={() => handleBookClick(book)}
                    >
                        <img
                            src="https://via.placeholder.com/150"
                            alt={book.title}
                            className="w-full h-48 object-cover mb-4"
                        />
                        <h2 className="text-lg font-semibold">{book.title}</h2>
                        <p className="text-gray-600">By {book.author}</p>
                        <p className="text-lg font-bold">${book.price.toFixed(2)}</p>
                        <button
                            className="bg-green-500 text-white py-1 px-3 rounded-md shadow-lg hover:bg-green-600 transition duration-200 mt-2"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent event from bubbling up
                                addToCart(book);
                            }}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            {selectedBook && (
                <BookDetailsPopup
                    book={selectedBook}
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    onReviewSubmit={handleReviewSubmit} // Pass the callback to the popup
                />
            )}

            <AddBookPopup
                isOpen={isAddBookPopupOpen}
                onClose={toggleAddBookPopup}
            />
        </div>
    );
}
