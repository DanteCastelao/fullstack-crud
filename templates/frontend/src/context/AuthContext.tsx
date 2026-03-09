import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { axiosInstance } from '../axios';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface User {
    role: 'admin' | 'user';
    entityId?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

// ─── Context ────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Hook to access authentication state and actions */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// ─── Provider ───────────────────────────────────────────────────────────────────

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async (): Promise<void> => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const [roleRes, entityRes] = await Promise.all([
                    axiosInstance.get<{ data: { role: User['role'] } }>('/api/auth/role'),
                    axiosInstance.get<{ data: { entityId?: string } }>('/api/users/entity'),
                ]);

                setUser({
                    role: roleRes.data.data.role,
                    entityId: entityRes.data.data.entityId,
                });
            } catch {
                localStorage.removeItem('token');
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = useCallback(async (username: string, password: string): Promise<void> => {
        const response = await axiosInstance.post<{ data: { token: string } }>(
            '/api/auth/login',
            { username, password }
        );

        localStorage.setItem('token', response.data.data.token);

        const [roleRes, entityRes] = await Promise.all([
            axiosInstance.get<{ data: { role: User['role'] } }>('/api/auth/role'),
            axiosInstance.get<{ data: { entityId?: string } }>('/api/users/entity'),
        ]);

        setUser({
            role: roleRes.data.data.role,
            entityId: entityRes.data.data.entityId,
        });
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        try {
            await axiosInstance.post('/api/auth/logout');
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, []);

    const value = useMemo(
        () => ({ user, isLoading, login, logout }),
        [user, isLoading, login, logout]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
