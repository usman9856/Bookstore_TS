import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

export default function Authentication(): JSX.Element {

    type LoginCreds = {
        loginEmail: string;
        loginPassword: string;
    };

    type SignupCreds = {
        firstName: string;
        lastName: string;
        signupEmail: string;
        signupPassword: string;
        confirmPassword: string;
    };

    const loginForm = useForm<LoginCreds>();
    const signupForm = useForm<SignupCreds>();
    const { register: loginRegister, control: loginControl, handleSubmit: handleLoginSubmit, formState: loginFormState } = loginForm;
    const { register: signupRegister, control: signupControl, handleSubmit: handleSignupSubmit, formState: signupFormState } = signupForm;

    const { errors: loginErrors } = loginFormState;
    const { errors: signupErrors } = signupFormState;

    const [globalError, setGlobalError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleLogin = async (loginData: LoginCreds) => {
        const { loginEmail, loginPassword } = loginData;
        try {
            const response = await axios.post("http://localhost:5000/Person/Login", { email: loginEmail, password: loginPassword });

            if (response.data) {
                localStorage.setItem("user", JSON.stringify(response.data.person));
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("isAdmin", response.data.person.access === 'admin' ? "true" : "false");

                navigate('/');
            } else {
                console.error("Invalid response data:", response.data);
                setGlobalError("Unexpected response data format. Please try again.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            setGlobalError("Login failed. Please check your credentials and try again.");
        }
    };

    const handleSignup = async (signupData: SignupCreds) => {
        const { firstName, lastName, signupEmail, signupPassword, confirmPassword } = signupData;

        if (signupPassword !== confirmPassword) {
            setGlobalError("Passwords do not match.");
            return;
        }

        setGlobalError(null); // Clear error message if passwords match

        try {
            const response = await axios.post("http://localhost:5000/Person/Signup", {
                firstName,
                lastName,
                email: signupEmail,
                password: signupPassword,
            });

            const userData = response.data;

            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("isAdmin", userData.access === 'admin' ? "true" : "false");

            navigate('/');
        } catch (error) {
            console.error("Signup failed:", error);
            setGlobalError("Signup failed. Please try again.");
            
        }
    };

    return (
        <div className="h-[100vh] w-full flex flex-col items-center justify-center border-2 border-black">

            {/* Global Error Message */}
            {globalError && (
                <div className="w-full bg-red-500 text-white text-center py-4">
                    {globalError}
                </div>
            )}

            <div className="flex flex-row justify-center w-full h-full">

                <div className="transition-transform transform hover:-translate-y-2 duration-200 p-6 flex flex-col justify-center items-center border-r-2 border-[#28281e] w-[50%] h-full bg-white">
                    <form className='flex flex-col w-80' onSubmit={handleLoginSubmit(handleLogin)}>
                        <h2 className="text-3xl bg-white px-5 py-2 font-semibold mb-6">Login</h2>

                        <input
                            type="email"
                            placeholder="Email"
                            {...loginRegister("loginEmail", {
                                required: "Email is required", 
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid Format"
                                }
                            })}
                            className=" p-3 border rounded-md shadow-sm w-full max-w-xs"
                        />
                        <p className='m-2 text-red-700'>{loginErrors.loginEmail?.message}</p>

                        <input
                            type="password"
                            placeholder="Password"
                            {...loginRegister("loginPassword", { required: "Password is required" })}
                            className=" p-3 border rounded-md shadow-sm w-full max-w-xs"
                        />
                        <p className='m-2 text-red-700'>{loginErrors.loginPassword?.message}</p>

                        <button className="p-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors duration-200">
                            Login
                        </button>
                    </form>
                </div>

                <div className="transition-transform transform hover:-translate-y-2 duration-200 p-6 flex flex-col justify-center items-center border-l-2 border-[#28281e] w-[50%] h-full bg-white">
                    <form className='flex flex-col w-80' onSubmit={handleSignupSubmit(handleSignup)}>
                        <h2 className="text-3xl bg-white px-5 py-2 font-semibold mb-6">Signup</h2>
                        <input
                            type="text"
                            placeholder="First Name"
                            {...signupRegister("firstName", { required: "First Name is required" })}
                            className=" p-3 border rounded-md shadow-sm w-full max-w-xs"
                        />
                        <p className='m-2 text-red-700'>{signupErrors.firstName?.message}</p>

                        <input
                            type="text"
                            placeholder="Last Name"
                            {...signupRegister("lastName", { required: "Last Name is required" })}
                            className=" p-3 border rounded-md shadow-sm w-full max-w-xs"
                        />
                        <p className='m-2 text-red-700'>{signupErrors.lastName?.message}</p>

                        <input
                            type="email"
                            placeholder="Email"
                            {...signupRegister("signupEmail", {
                                required: "Email is required", pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid Format"
                                }
                            })}
                            className=" p-3 border rounded-md shadow-sm w-full max-w-xs"
                        />
                        <p className='m-2 text-red-700'>{signupErrors.signupEmail?.message}</p>

                        <input
                            type="password"
                            placeholder="Password"
                            {...signupRegister("signupPassword", { required: "Password is required" })}
                            className=" p-3 border rounded-md shadow-sm w-full max-w-xs"
                        />
                        <p className='m-2 text-red-700'>{signupErrors.signupPassword?.message}</p>

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            {...signupRegister("confirmPassword")}
                            className="mb-6 p-3 border rounded-md shadow-sm w-full max-w-xs"
                        />
                        <p className='m-2 text-red-700'>{signupErrors.confirmPassword?.message}</p>

                        <button className="p-3 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition-colors duration-200">
                            Signup
                        </button>
                    </form>
                </div>

            </div>

        </div>
    );
}
