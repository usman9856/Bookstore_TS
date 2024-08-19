import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Sidebar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            setUserId(userData.personId);
            setIsLoggedIn(true);
            setIsAdmin(userData.access === 'admin');
        }
    }, []); // No need to add dependencies here since it's only reading from localStorage

    const handleSignout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate('/Authentication');
    };

    return (
        <div className="h-[100vh] w-60 bg-gray-800 text-white flex flex-col items-center py-6">
            <Link to="/"><h1 className="text-2xl font-bold mb-8">BookStore!</h1></Link>
            {isLoggedIn && userId && (
                <div className="mb-4">
                    <p className="text-sm font-mono">User ID: {userId}</p>
                </div>
            )}
            <nav className="flex flex-col space-y-4 items-start">
                {isLoggedIn ? (
                    isAdmin ? (
                        <>
                            <Link to="/Admin/User" className="text-xl font-mono hover:text-blue-400">User</Link>
                            <Link to="/Order" className="text-xl font-mono hover:text-blue-400">View Orders</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/Library" className="text-xl font-mono hover:text-blue-400">Library</Link>
                            <Link to="/Order" className="text-xl font-mono hover:text-blue-400">Order</Link>
                            <Link to="/Cart" className="text-xl font-mono hover:text-blue-400">Cart</Link>
                        </>
                    )
                ) : (
                    <Link to="/Authentication" className="text-xl font-mono hover:text-blue-400">Sign In</Link>
                )}
                {isLoggedIn && (
                    <button onClick={handleSignout} className="hover:text-blue-400 text-xl font-mono">Signout</button>
                )}
            </nav>
        </div>
    );
}
