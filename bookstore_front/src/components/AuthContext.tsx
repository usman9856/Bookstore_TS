import React, { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
    isLoggedIn: boolean;
    isAdmin: boolean;
    setLoggedIn: (value: boolean) => void;
    setAdmin: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isAdmin, setAdmin] = useState(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, setLoggedIn, setAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
