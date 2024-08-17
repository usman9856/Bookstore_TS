import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext"; // Adjust the import path

export default function AdminPage(): JSX.Element {
    const { isLoggedIn, isAdmin } = useAuth();
    const navigate = useNavigate();

    // Check if the user is not logged in or not an admin
    if (!isLoggedIn || !isAdmin) {
        // Redirect to the login page or another appropriate page
        navigate("/login"); // Adjust the path as needed
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/" className="bg-blue-500 text-white p-6 rounded-lg shadow-lg hover:bg-blue-600">
                    <center>Add Book</center>
                </Link>
                <Link to="/CreateUser" className="bg-green-500 text-white p-6 rounded-lg shadow-lg hover:bg-green-600">
                    <center>Create User</center>
                </Link>
                <Link to="/Order" className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg hover:bg-yellow-600">
                    <center>View Orders</center>
                </Link>
                <button onClick={() => localStorage.removeItem('user')} className="bg-red-500 text-white p-6 rounded-lg shadow-lg hover:bg-red-600">
                    Signout
                </button>
            </div>
        </div>
    );
}
