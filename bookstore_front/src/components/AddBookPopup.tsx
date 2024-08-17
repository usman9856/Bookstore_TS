// AddBookPopup.tsx

import React, { useState } from "react";
import axios from "axios";
import { IBook } from "./HomePage"; // Adjust the import based on your file structure

interface AddBookPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddBookPopup: React.FC<AddBookPopupProps> = ({ isOpen, onClose }) => {
    const [newBook, setNewBook] = useState<IBook>({
        _id: '',
        ISBN: '',
        title: '',
        author: '',
        publishedYear: 0,
        genre: '',
        price: 0,
        inStock: false,
        quantity: 0,
        rating: 0,
        review: [],
    });



    const handleAddBookSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:5000/Book/Add", [newBook]);
            if (response.status === 200) {
                alert("Book added successfully!");
                onClose(); // Close the popup after successful submission
                window.location.reload(); // Reload the page to update the book list
            } else {
                alert("Failed to add the book. Please try again.");
            }
        } catch (error) {
            alert("Error adding book: " + error);
        }
    };
    const handleAddBookChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewBook(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-[600px] h-[580px]">
                <h3 className="text-xl font-bold mb-4">Add a New Book</h3>

                <input
                    type="text"
                    name="ISBN"
                    placeholder="ISBN"
                    className="w-full p-2 border rounded-md mb-2"
                    value={newBook.ISBN}
                    onChange={handleAddBookChange}
                />

                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    className="w-full p-2 border rounded-md mb-2"
                    value={newBook.title}
                    onChange={handleAddBookChange}
                />

                <input
                    type="text"
                    name="author"
                    placeholder="Author"
                    className="w-full p-2 border rounded-md mb-2"
                    value={newBook.author}
                    onChange={handleAddBookChange}
                />

                <input
                    type="number"
                    name="publishedYear"
                    placeholder="Published Year"
                    className="w-full p-2 border rounded-md mb-2"
                    value={newBook.publishedYear}
                    onChange={handleAddBookChange}
                />

                <input
                    type="text"
                    name="genre"
                    placeholder="Genre"
                    className="w-full p-2 border rounded-md mb-2"
                    value={newBook.genre}
                    onChange={handleAddBookChange}
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    className="w-full p-2 border rounded-md mb-2"
                    value={newBook.price}
                    onChange={handleAddBookChange}
                />

                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    className="w-full p-2 border rounded-md mb-2"
                    value={newBook.quantity}
                    onChange={(e) => {
                        const newQuantity = parseInt(e.target.value, 10);
                        setNewBook((prevState) => ({
                            ...prevState,
                            quantity: newQuantity,
                            inStock: newQuantity > 0,
                        }));
                    }}
                />

                <label className="flex items-center space-x-3 mb-2">
                    <input
                        type="checkbox"
                        name="inStock"
                        className="form-checkbox h-5 w-5 text-green-600"
                        checked={newBook.inStock}
                        onChange={(e) =>
                            setNewBook((prevState) => ({
                                ...prevState,
                                inStock: prevState.quantity > 0 && e.target.checked,
                            }))
                        }
                    />
                    <span>In Stock</span>
                </label>

                <input
                    type="number"
                    step="0.1"
                    name="rating"
                    placeholder="Rating (out of 5)"
                    className="w-full p-2 border rounded-md mb-2"
                    value={newBook.rating ?? ''}
                    onChange={handleAddBookChange}
                />

                <div className="flex justify-end mt-4">
                    <button
                        className="bg-green-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-green-700 transition duration-200"
                        onClick={handleAddBookSubmit}
                    >
                        Submit
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

export default AddBookPopup;
