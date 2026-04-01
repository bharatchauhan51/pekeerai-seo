'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, ApiUser } from '../lib/api';

interface User {
    id: string | number;
    email: string;
    name: string;
    plan: string;
    avatar: string;
    company?: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoggedIn: false,
    isLoading: true,
    login: async () => ({ success: false }),
    register: async () => ({ success: false }),
    logout: () => { },
    refreshUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

function apiUserToUser(u: ApiUser): User {
    return {
        id: u.id,
        email: u.email,
        name: u.name,
        plan: u.plan,
        avatar: u.avatar,
        company: u.company,
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On mount, check for existing session via token
    useEffect(() => {
        const token = localStorage.getItem('pekkerai_token');
        if (token) {
            authApi.me().then(({ data, error }) => {
                if (data?.user && !error) {
                    setUser(apiUserToUser(data.user));
                } else {
                    // Invalid/expired token
                    localStorage.removeItem('pekkerai_token');
                }
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        const { data, error } = await authApi.login(email, password);
        if (error || !data) {
            return { success: false, error: error || 'Login failed. Please try again.' };
        }
        localStorage.setItem('pekkerai_token', data.token);
        setUser(apiUserToUser(data.user));
        return { success: true };
    };

    const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        const { data, error } = await authApi.register(name, email, password);
        if (error || !data) {
            return { success: false, error: error || 'Registration failed. Please try again.' };
        }
        localStorage.setItem('pekkerai_token', data.token);
        setUser(apiUserToUser(data.user));
        return { success: true };
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
        localStorage.removeItem('pekkerai_token');
    };

    const refreshUser = async () => {
        const { data } = await authApi.me();
        if (data?.user) {
            setUser(apiUserToUser(data.user));
        }
    };

    const isLoggedIn = !!user;

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}
