'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    email: string;
    name: string;
    plan: string;
    avatar: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoggedIn: false,
    isLoading: true,
    login: async () => false,
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('pekkerai_user');
        if (stored) {
            try { setUser(JSON.parse(stored)); } catch { }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, _password: string): Promise<boolean> => {
        // Simulate API delay
        await new Promise(r => setTimeout(r, 1200));

        // Accept any email/password for demo purposes
        const newUser: User = {
            email,
            name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            plan: 'Pro',
            avatar: email.charAt(0).toUpperCase(),
        };
        setUser(newUser);
        localStorage.setItem('pekkerai_user', JSON.stringify(newUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pekkerai_user');
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
