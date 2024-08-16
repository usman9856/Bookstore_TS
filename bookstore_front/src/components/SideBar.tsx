import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Sidebar() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            // Check if the user has an admin role
            if (userData.role === 'admin') {
                setIsAdmin(true);
            }
            // Set the user ID
            setUserId(userData.userId); // Assuming userData contains a 'userId' field
        }
    }, []);

    const handleSignout = () => {
        localStorage.removeItem('user');
        localStorage.setItem('isSignedIn', 'false');
        navigate('/Authentication');
    };

    return (
        <div className="h-[100vh] w-60 bg-gray-800 text-white flex flex-col items-center py-6">
            <Link to="/"><h1 className="text-2xl font-bold mb-8">BookStore!</h1></Link>
            {/* Display the user ID here */}
            {userId && (
                <div className="mb-4">
                    <p className="text-sm font-mono">User ID: {userId}</p>
                </div>
            )}
            <nav className="flex flex-col space-y-4 items-start">
                {isAdmin ? (
                    <>
                        <Link to="/AddBook" className="text-xl font-mono hover:text-blue-400">Add Book</Link>
                        <Link to="/CreateUser" className="text-xl font-mono hover:text-blue-400">Create User</Link>
                        <Link to="/Order" className="text-xl font-mono hover:text-blue-400">View Orders</Link>
                    </>
                ) : (
                    <>
                        <Link to="/Library" className="text-xl font-mono hover:text-blue-400">Library</Link>
                        <Link to="/Order" className="text-xl font-mono hover:text-blue-400">Order</Link>
                        <Link to="/Cart" className="text-xl font-mono hover:text-blue-400">Cart</Link>
                    </>
                )}
                <button onClick={handleSignout} className="hover:text-blue-400 text-xl font-mono">Signout</button>
            </nav>
        </div>
    );
}
