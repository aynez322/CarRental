import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData) {
          // Handle structured error response
          const message = errorData.message || errorData.error || 'Login failed';
          const error = new Error(message);
          error.attemptsRemaining = errorData.attemptsRemaining;
          error.retryAfterSeconds = errorData.retryAfterSeconds;
          throw error;
        }
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      }));
      
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      });

      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData) {
          const message = errorData.message || errorData.error || 'Registration failed';
          throw new Error(message);
        }
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
      }

      const data = await response.json();
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      }));
      
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      });

      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
