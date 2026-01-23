import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const rolePermissions: Record<UserRole, string[]> = {
  'System Admin': ['*'], // All modules
  'Sales Manager': ['dashboard', 'deals', 'reports', 'leads', 'contacts', 'accounts', 'tasks', 'communications'],
  'Sales Executive': ['dashboard', 'leads', 'contacts', 'accounts', 'deals', 'tasks', 'communications'],
  'Marketing Executive': ['dashboard', 'campaigns', 'leads', 'reports'],
  'Support Executive': ['dashboard', 'contacts', 'accounts', 'communications'],
  'Customer': ['dashboard', 'tickets']
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('crm_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('crm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('crm_user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crm_user');
  };

  const hasPermission = (module: string): boolean => {
    if (!user) return false;
    const permissions = rolePermissions[user.role];
    return permissions.includes('*') || permissions.includes(module);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
