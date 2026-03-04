"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Load user from localStorage on mount (Client-side only)
        const savedUser = localStorage.getItem('careerintel_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse saved user", e);
                localStorage.removeItem('careerintel_user');
            }
        }
        setIsLoading(false);
    }, []);

    const register = (userData) => {
        const users = JSON.parse(localStorage.getItem('careerintel_all_users') || '[]');

        if (users.find(u => u.email === userData.email)) {
            throw new Error("User already exists");
        }

        const newUser = {
            ...userData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem('careerintel_all_users', JSON.stringify(updatedUsers));

        // Auto-login
        localStorage.setItem('careerintel_user', JSON.stringify(newUser));
        setUser(newUser);
        return newUser;
    };

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('careerintel_all_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error("Invalid email or password");
        }

        localStorage.setItem('careerintel_user', JSON.stringify(user));
        setUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem('careerintel_user');
        setUser(null);
        router.push('/login');
    };

    const updateProfile = (updatedData) => {
        if (!user) return;

        const updatedUser = { ...user, ...updatedData };

        // Update session
        setUser(updatedUser);
        localStorage.setItem('careerintel_user', JSON.stringify(updatedUser));

        // Update in all users list
        const users = JSON.parse(localStorage.getItem('careerintel_all_users') || '[]');
        const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
        localStorage.setItem('careerintel_all_users', JSON.stringify(updatedUsers));

        return updatedUser;
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, register, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
