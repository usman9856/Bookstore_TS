// BookDetailsPopup.tsx
import React, { useState } from "react";
import { IBook } from "./HomePage"; // Import the IBook interface

interface BookDetailsPopupProps {
    book: IBook;
    isOpen: boolean;
    onClose: () => void;
    onReviewSubmit: (reviewText: string) => void; // Callback for submitting a review
}

const BookDetailsPopup: React.FC<BookDetailsPopupProps> = ({ book, isOpen, onClose, onReviewSubmit }) => {
    const [reviewText, setReviewText] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (reviewText) {
            onReviewSubmit(reviewText); // Call the parent function to submit review
            setReviewText(""); // Clear the review input
        } else {
            alert("Please enter a review before submitting.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-[600px] h-[580px]">
                <h3 className="text-xl font-bold mb-4">{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Published Year:</strong> {book.publishedYear}</p>
                <p><strong>Genre:</strong> {book.genre}</p>
                <p><strong>Price:</strong> ${book.price.toFixed(2)}</p>
                <p><strong>Quantity:</strong> {book.quantity}</p>
                <p><strong>Reviews:</strong></p>
                <ul>
                    {book.review.map((rev, index) => (
                        <li key={index}>"{rev}"</li>
                    ))}
                </ul>
                <textarea
                    className="w-full p-2 border rounded-md mb-4 h-32 my-10"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review here..."
                />
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-green-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-green-700 transition duration-200"
                        onClick={handleSubmit}
                    >
                        Submit Review
                    </button>
                </div>
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default BookDetailsPopup;
