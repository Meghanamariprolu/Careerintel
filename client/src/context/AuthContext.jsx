"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = '';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000; // Increased to 30 seconds for reliability

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
        const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
                return;
            }

            setAuthHeader(token);
            try {
                const { data } = await axios.get('/api/auth/profile');
                setUser(data);
            } catch (error) {
                console.error("Auth check failed:", error?.message || error);
                // Don't clear token on timeout — backend might just be cold starting
                if (error?.response?.status === 401) {
                    localStorage.removeItem('token');
                    setUser(null);
                    setAuthHeader(null);
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const register = async (userData) => {
        try {
            const { data } = await axios.post('/api/auth/register', userData, {
                timeout: 15000,
            });
            const { token, ...userDetails } = data;

            localStorage.setItem('token', token);
            setAuthHeader(token);
            setUser(userDetails);
            return userDetails;
        } catch (error) {
            console.error("Registration error details:", {
                message: error.message,
                code: error.code,
                response: error.response?.data
            });
            let message = "Registration failed";
            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                message = "Server is starting up, please try again in a moment";
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            }
            throw new Error(message);
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password }, {
                timeout: 15000,
            });
            const { token, ...userDetails } = data;

            localStorage.setItem('token', token);
            setAuthHeader(token);
            setUser(userDetails);
            return userDetails;
        } catch (error) {
            console.error("Login error details:", {
                message: error.message,
                code: error.code,
                response: error.response?.data
            });
            let message = "Invalid email or password";
            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                message = "Server is starting up, please try again in a moment";
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            }
            throw new Error(message);
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout', {}, { timeout: 5000 });
        } catch (e) {
            console.error("Logout error", e);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            setAuthHeader(null);
            router.push('/login');
        }
    };

    const updateProfile = async (updatedData) => {
        try {
            const { data } = await axios.put('/api/auth/profile', updatedData, {
                timeout: 10000,
            });
            setUser(data);
            return data;
        } catch (error) {
            let message = "Failed to update profile";
            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                message = "Server is starting up, please try again in a moment";
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            }
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

