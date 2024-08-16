import React from "react";
import { Link } from "react-router-dom";

export default function AdminPage(): JSX.Element {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/AddBook" className="bg-blue-500 text-white p-6 rounded-lg shadow-lg hover:bg-blue-600">
                  <center>  Add Book</center>
                </Link>
                <Link to="/CreateUser" className="bg-green-500 text-white p-6 rounded-lg shadow-lg hover:bg-green-600">
                    <center>Create User</center>
                </Link>
                <Link to="/ViewOrders" className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg hover:bg-yellow-600">
                   <center> View Orders</center>
                </Link>
                <button onClick={() => localStorage.removeItem('user')} className="bg-red-500 text-white p-6 rounded-lg shadow-lg hover:bg-red-600">
                    Signout
                </button>
            </div>
        </div>
    );
}
