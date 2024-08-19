import React, { useState } from 'react';
import axios from 'axios';

interface IUser {
    personId: string;
    firstName: string;
    lastName: string;
    access: string;
    email: string;
    library: string[];      // Ensure these are always arrays
    orderHistory: string[]; // Ensure these are always arrays
}

export default function AccessModification(): JSX.Element {
    const [userId, setUserId] = useState<string>('');
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setUser(null);
    
        try {
            const response = await axios.get<{ person: IUser }>(`http://localhost:5000/Person/${userId}`);
            console.log('Fetched User Data:', response.data); // Debugging line
            setUser(response.data.person); // Extract the `person` property and set it
            console.log("Set user data:", response.data.person?.firstName);
            console.log("Set user data first Name:", response.data.person!.personId!);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to fetch user data.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleSave = async () => {
        if (user) {
            setLoading(true);
            setError(null);

            try {
                await axios.put<IUser>(`http://localhost:5000/Person/${userId}`, user);
                alert('User updated successfully');
            } catch (error) {
                console.error('Error updating user data:', error);
                setError('Failed to update user data.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (user) {
            const { name, value } = e.target;
            // console.log(`Updating ${name} to ${value}`); // Debugging line
            setUser({
                ...user,
                [name]: value
            });
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Access Modification</h1>
            
            <div className="mb-4">
                <label htmlFor="userId" className="block text-lg font-semibold mb-2">Enter User ID:</label>
                <input
                    id="userId"
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="border border-gray-300 p-2 w-full rounded-md"
                    placeholder="User ID"
                />
                <button
                    onClick={handleSearch}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Search
                </button>
            </div>
            
            {loading && <p>Loading...</p>}
            
            {error && <p className="text-red-500">{error}</p>}
            
            {user && (
                <div className="mt-4 p-4 border border-gray-300 rounded-md">
                    <h2 className="text-xl font-bold mb-2">User Details</h2>
                    <div className="mb-4">
                        <label htmlFor="firstName" className="block text-lg font-semibold mb-2">First Name:</label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={user.firstName}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-lg font-semibold mb-2">Last Name:</label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={user.lastName}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="access" className="block text-lg font-semibold mb-2">Access:</label>
                        <input
                            id="access"
                            name="access"
                            type="text"
                            value={user.access}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-lg font-semibold mb-2">Email:</label>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            value={user.email}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded-md"
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
}
