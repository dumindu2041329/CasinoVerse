import React, { useState, useEffect, type ReactNode } from 'react';
import type { User, AuthState } from '../types';
import { AuthContext } from './auth-context';
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('casinoUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('casinoUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call - In production, this would call your backend
    const storedUsers = localStorage.getItem('casinoUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    const foundUser = users.find((u: User & { password: string }) => 
      u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _unusedPassword, ...userWithoutPassword } = foundUser;
      void _unusedPassword;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('casinoUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const storedUsers = localStorage.getItem('casinoUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Check if user already exists
    const userExists = users.some((u: User) => u.email === email || u.username === username);
    if (userExists) {
      return false;
    }

    const newUser: User & { password: string } = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      password,
      balance: 1000, // Starting balance
      createdAt: new Date(),
    };

    users.push(newUser);
    localStorage.setItem('casinoUsers', JSON.stringify(users));

    const { password: _unusedPassword, ...userWithoutPassword } = newUser;
    void _unusedPassword;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('casinoUser', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('casinoUser');
  };

  const value: AuthState = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
