import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Authentication(): JSX.Element {
    // Login state
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Signup state
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [access, setAccess] = useState("user");
    const [error, setError] = useState(""); // State to handle error messages
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const data = { email: loginEmail, password: loginPassword };
            const response = await axios.post("http://localhost:5000/Person/Login", data);

            // Check if the response contains the expected data
            if (response.data && typeof response.data === 'object') {
                // Store the user data in local storage
                localStorage.setItem("user", JSON.stringify(response.data.person));
                console.log("User data stored:", response.data); // Debugging statement

                // Navigate to the home page
                navigate('/');
            } else {
                console.error("Invalid response data:", response.data);
                alert("Unexpected response data format. Please try again.");
            }
        } catch (error) {
            // Log the error and show an alert to the user
            console.error("Login failed:", error);
            alert("Login failed. Please check your credentials and try again.");
        }
    };


    const handleSignup = async () => {
        if (signupPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return; // Stop execution if passwords do not match
        }
        setError(""); // Clear error message if passwords match
        try {
            const response = await axios.post("http://localhost:5000/Person/Signup", {
                firstName,
                lastName,
                access,
                email: signupEmail,
                password: signupPassword,
            });
            localStorage.setItem("user", JSON.stringify(response.data));
            navigate('/');
        } catch (error) {
            console.error("Signup failed:", error);
            setError("Signup failed. Please try again.");
        }
    };

    return (
        <div className="h-[100vh] w-full flex flex-row justify-center border-2 border-black">
            <div className="transition-transform transform hover:-translate-y-2 duration-200 p-6 flex flex-col justify-center items-center border-r-2 border-[#28281e] w-[50%] h-full bg-white">
                <h2 className="text-3xl bg-white px-5 py-2 font-semibold mb-6">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="mb-4 p-3 border rounded-md shadow-sm w-full max-w-xs"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="mb-6 p-3 border rounded-md shadow-sm w-full max-w-xs"
                />
                <button onClick={handleLogin} className="p-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors duration-200">
                    Login
                </button>
            </div>
            <div className="transition-transform transform hover:-translate-y-2 duration-200 p-6 flex flex-col justify-center items-center border-l-2 border-[#28281e] w-[50%] h-full bg-white">
                <h2 className="text-3xl bg-white px-5 py-2 font-semibold mb-6">Signup</h2>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mb-4 p-3 border rounded-md shadow-sm w-full max-w-xs"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mb-4 p-3 border rounded-md shadow-sm w-full max-w-xs"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="mb-4 p-3 border rounded-md shadow-sm w-full max-w-xs"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="mb-4 p-3 border rounded-md shadow-sm w-full max-w-xs"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mb-6 p-3 border rounded-md shadow-sm w-full max-w-xs"
                />
                {error && <p className="text-red-500 mb-4 bg-white">{error}</p>} {/* Display error message */}
                <button onClick={handleSignup} className="p-3 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition-colors duration-200">
                    Signup
                </button>
            </div>
        </div>
    );
}
