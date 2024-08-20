import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

interface IBook {
    _id: string;
    ISBN: string;
    title: string;
    author: string;
    publishedYear: number | null;
    genre: string;
    price: number | null;
    inStock: boolean;
    quantity: number | null;
    rating: number | null;
    review: string[];
}

interface AddBookPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddBookPopup: React.FC<AddBookPopupProps> = ({ isOpen, onClose }) => {
    const bookForm = useForm<IBook>({
        defaultValues: {
            ISBN: '',
            title: '',
            author: '',
            publishedYear: null,
            genre: '',
            price: null,
            inStock: false,
            quantity: null,
            rating: null,
            review: [],
        },
    });

    const { register: bookRegister, control: bookControl, handleSubmit: handleBookSubmit, formState: { errors: bookFormError } } = bookForm;

    const handleAddBookSubmit = async (data: IBook) => {
        try {
            const response = await axios.post("http://localhost:5000/Book/Add", [data]);
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <form onSubmit={handleBookSubmit(handleAddBookSubmit)} className="flex flex-col w-full max-w-lg">
                <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-bold mb-4">Add a New Book</h3>

                    <input
                        type="text"
                        placeholder="ISBN"
                        className="w-full p-2 border rounded-md mb-2"
                        {...bookRegister("ISBN", { required: "ISBN is required" })}
                    />
                    <p className='m-2 text-red-700'>{bookFormError.ISBN?.message}</p>

                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full p-2 border rounded-md mb-2"
                        {...bookRegister("title", { required: "Title is required" })}
                    />
                    <p className='m-2 text-red-700'>{bookFormError.title?.message}</p>

                    <input
                        type="text"
                        placeholder="Author"
                        className="w-full p-2 border rounded-md mb-2"
                        {...bookRegister("author", { required: "Author is required" })}
                    />
                    <p className='m-2 text-red-700'>{bookFormError.author?.message}</p>

                    <input
                        type="number"
                        placeholder="Published Year"
                        className="w-full p-2 border rounded-md mb-2"
                        {...bookRegister("publishedYear", { valueAsNumber: true, required: "Published Year is required" })}
                    />
                    <p className='m-2 text-red-700'>{bookFormError.publishedYear?.message}</p>

                    <input
                        type="text"
                        placeholder="Genre"
                        className="w-full p-2 border rounded-md mb-2"
                        {...bookRegister("genre", { required: "Genre is required" })}
                    />
                    <p className='m-2 text-red-700'>{bookFormError.genre?.message}</p>

                    <input
                        type="number"
                        placeholder="Price"
                        className="w-full p-2 border rounded-md mb-2"
                        {...bookRegister("price", { valueAsNumber: true, required: "Price is required" })}
                    />
                    <p className='m-2 text-red-700'>{bookFormError.price?.message}</p>

                    <input
                        type="number"
                        placeholder="Quantity"
                        className="w-full p-2 border rounded-md mb-2"
                        {...bookRegister("quantity", { valueAsNumber: true, required: "Quantity is required" })}
                    />
                    <p className='m-2 text-red-700'>{bookFormError.quantity?.message}</p>

                    <input
                        type="number"
                        step="0.1"
                        placeholder="Rating (out of 5)"
                        className="w-full p-2 border rounded-md mb-2"
                        {...bookRegister("rating", { valueAsNumber: true, required: "Rating is required" })}
                    />
                    <p className='m-2 text-red-700'>{bookFormError.rating?.message}</p>

                    <div className="flex justify-end mt-4">
                        <button
                            className="bg-green-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-green-700 transition duration-200"
                            type="submit"
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
            </form>
            <DevTool control={bookControl} />
        </div>
    );
};

export default AddBookPopup;
