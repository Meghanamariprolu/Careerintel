"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = ''; // Use relative paths for proxy/rewrites to work
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Helper to set the Auth header
    const setAuthHeader = (token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('careerintel_token');
            if (!token) {
                setIsLoading(false);
                return;
            }

            setAuthHeader(token);
            try {
                const { data } = await axios.get('/api/auth/profile');
                setUser(data);
            } catch (error) {
                console.error("Auth check failed:", error);
                localStorage.removeItem('careerintel_token');
                setUser(null);
                setAuthHeader(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const register = async (userData) => {
        try {
            const { data } = await axios.post('/api/auth/register', userData);
            const { token, ...userDetails } = data;
            
            localStorage.setItem('careerintel_token', token);
            setAuthHeader(token);
            setUser(userDetails);
            return userDetails;
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed";
            throw new Error(message);
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            const { token, ...userDetails } = data;
            
            localStorage.setItem('careerintel_token', token);
            setAuthHeader(token);
            setUser(userDetails);
            return userDetails;
        } catch (error) {
            const message = error.response?.data?.message || "Invalid email or password";
            throw new Error(message);
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
        } catch (e) {
            console.error("Logout error", e);
        } finally {
            localStorage.removeItem('careerintel_token');
            setUser(null);
            setAuthHeader(null);
            router.push('/login');
        }
    };

    const updateProfile = async (updatedData) => {
        try {
            const { data } = await axios.put('/api/auth/profile', updatedData);
            setUser(data);
            return data;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to update profile";
            throw new Error(message);
        }
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
