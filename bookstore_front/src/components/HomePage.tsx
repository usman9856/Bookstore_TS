import React, { useEffect, useState } from "react";
import axios from "axios";
import AddBookPopup from "./AddBookPopup";
import BookDetailsPopup from "./BookDetailPopup";

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
    const [isAdmin, setIsAdmin] = useState(false); // Default to false
    const [isAddBookPopupOpen, setIsAddBookPopupOpen] = useState(false);

    const [localCart, setLocalCart] = useState<IBook[]>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [currentPage, setCurrentPage] = useState<number>(1); // Current page
    const [totalPages, setTotalPages] = useState<number>(1); // Total pages
    const booksPerPage = 4; // Number of books per page

    useEffect(() => {
        // Fetch books from API with pagination
        const fetchBooks = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/Book/?page=${currentPage}&limit=${booksPerPage}`);
                setBooks(response.data.books); // Assuming the response has `books` and `totalBooks`
                setTotalPages(Math.ceil(response.data.totalBooks / booksPerPage));
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        // Fetch user data and check admin status
        const checkAdminStatus = () => {
            const adminStatus = localStorage.getItem('isAdmin');
            adminStatus === 'true' ? setIsAdmin(true) : setIsAdmin(false);
            console.log("Admin Status", adminStatus);
        };

        fetchBooks();
        checkAdminStatus(); // Check admin status when the component mounts
    }, [currentPage]);

    const handleBookClick = (book: IBook) => {
        setSelectedBook(book);
        setIsPopupOpen(true);
    };

    const handleReviewSubmit = async (reviewText: string) => {
        const userDataString = localStorage.getItem('user');
        if (!userDataString) {
            alert("You must be logged in to submit a review.");
            return;
        }

        const userData = JSON.parse(userDataString);
        const library = userData.library || [];

        if (selectedBook && library.includes(selectedBook.ISBN)) {
            try {
                const response = await axios.put(`http://localhost:5000/Book/Update/${selectedBook.ISBN}`, {
                    review: [reviewText],
                });

                if (response.status === 200) {
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
            alert("You can only review books that are in your library.");
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-6">
            <div className="flex flex-row justify-between mx-4">
                <h1 className="text-2xl font-bold mb-4">BookStore</h1>
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
                                e.stopPropagation();
                                addToCart(book);
                            }}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-5 space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {selectedBook && (
                <BookDetailsPopup
                    book={selectedBook}
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    onReviewSubmit={handleReviewSubmit}
                />
            )}

            <AddBookPopup
                isOpen={isAddBookPopupOpen}
                onClose={toggleAddBookPopup}
            />
        </div>
    );
}
