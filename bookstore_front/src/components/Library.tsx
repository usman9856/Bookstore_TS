import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

export default function Library(): JSX.Element {
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

    const [libraryBooks, setLibraryBooks] = useState<IBook[]>([]);

    useEffect(() => {
        const fetchLibraryBooks = async () => {
            try {
                const userDataString = localStorage.getItem("user");
                if (userDataString) {
                    const userData = JSON.parse(userDataString);

                    if (Array.isArray(userData.library)) {
                        // Remove duplicates
                        const uniqueLibrary: string[] = Array.from(new Set(userData.library));

                        // Fetch all books in parallel
                        const bookPromises: Promise<AxiosResponse<IBook>>[] = uniqueLibrary.map((_id: string) =>
                            axios.get<IBook>(`http://localhost:5000/Book/${_id}`)
                        );

                        const bookResponses = await Promise.all(bookPromises);
                        const books = bookResponses.map(response => response.data);

                        // Remove duplicates from the fetched books
                        const uniqueBooks = Array.from(new Set(books.map(book => book._id)))
                            .map(id => books.find(book => book._id === id));

                        // Update state with unique books
                        setLibraryBooks(uniqueBooks as IBook[]);
                    } else {
                        alert("Library is empty!");
                    }
                }
            } catch (error) {
                console.error("Failed to fetch library books:", error);
                alert("Failed to load books from your library.");
            }
        };

        fetchLibraryBooks();
    }, []);

    return (
        <div className="flex justify-center items-center">
            <div className="container overflow-x-auto scroll-container rounded-t-xl rounded-r-xl rounded-l-xl shadow-lg shadow-gray-800 max-w-screen-lg">
                <center><h1 className="mx-10 my-5 text-5xl font-bold uppercase">Library</h1></center>
                {libraryBooks.length === 0 ? (
                    <p className="text-center mt-10">No books in your library.</p>
                ) : (
                    <div className="space-y-5 py-10 px-2">
                        {libraryBooks.map((book) => (
                            <div
                                key={book._id}
                                className="border p-4 rounded-md shadow-md flex justify-between items-center bg-gray-800"
                            >
                                <div>
                                    <h2 className="text-xl font-bold mb-2 text-white">{book.title}</h2>
                                    <p className="text-lg font-semibold mb-2 text-white">By: {book.author}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <p className="text-lg font-semibold text-white">${book.price.toFixed(2)}</p>
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
