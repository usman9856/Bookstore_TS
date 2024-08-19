import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

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

export default function Library(): JSX.Element {
    const [libraryBooks, setLibraryBooks] = useState<IBook[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserDataAndLibraryBooks = async () => {
            try {
                const userDataString = localStorage.getItem('user');
                if (!userDataString) {
                    console.error("User data not found in localStorage.");
                    setError("User data not found in localStorage.");
                    setLoading(false);
                    return;
                }
                
                let userData = JSON.parse(userDataString);
                console.log("User data:", userData);
        
                if (!userData.personId) {
                    throw new Error("User ID not found.");
                }
        
                const userDataUpdated = await axios.get(`http://localhost:5000/Person/${userData.personId}`);
                userData = userDataUpdated.data.person;

                console.log("Fetched user data:", userData);

                if (!Array.isArray(userData.library)) {
                    alert("Your library is empty!");
                    setLoading(false);
                    return;
                }

                const uniqueLibrary: string[] = Array.from(new Set(userData.library));
                console.log("Unique library IDs:", uniqueLibrary);

                const bookPromises: Promise<AxiosResponse<IBook>>[] = uniqueLibrary.map((_id: string) =>
                    axios.get<IBook>(`http://localhost:5000/Book/${_id}`)
                );

                const bookResponses = await Promise.all(bookPromises);
                console.log("Fetched book responses:", bookResponses);

                const books = bookResponses.map(response => response.data);
                console.log("Fetched books:", books);

                // Remove duplicates using a more reliable method
                const uniqueBooksMap = new Map(books.map(book => [book._id, book]));
                const uniqueBooks = Array.from(uniqueBooksMap.values());

                console.log("Unique books:", uniqueBooks);

                setLibraryBooks(uniqueBooks);
            } catch (error: any) {
                console.error("Failed to fetch user data or library books:", error);
                setError("Failed to load books from your library.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDataAndLibraryBooks();
    }, []);

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (error) {
        return <p className="text-center mt-10 text-red-500">{error}</p>;
    }

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
