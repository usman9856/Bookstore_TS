import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();

    const handleSignout = () => {
        // Remove user data from localStorage or sessionStorage
        localStorage.removeItem('user');  // Assuming 'user' is the key for user data
        localStorage.setItem('isSignedIn', 'false'); // Update sign-in status
        navigate('/Authentication'); // Redirect to the Authentication page
    };

    return (
        <div className="h-[100vh] w-60  bg-gray-800 text-white flex flex-col items-center py-6">
            <Link to="/"><h1 className="text-2xl font-bold mb-8">BookStore!</h1></Link>
            <nav className="flex flex-col space-y-4">
                <Link to="/Library" className="text-xl font-mono hover:text-blue-400">Library</Link>
                <Link to="/Order" className="text-xl font-mono hover:text-blue-400">Order</Link>
                <Link to="/Order" className="text-xl font-mono hover:text-blue-400">Cart</Link>
                <button onClick={handleSignout} className="hover:text-blue-400 text-xl font-mono">Signout</button>
            </nav>
        </div>
    );
}
