import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('agriguard_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyUser() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token expired or invalid
          localStorage.removeItem('agriguard_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.warn('Auth verify network error, retaining offline session:', err);
      } finally {
        setLoading(false);
      }
    }

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      localStorage.setItem('agriguard_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const register = async ({ name, email, password, confirmPassword, farmName }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword, farmName })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register account');
      }

      localStorage.setItem('agriguard_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const loginAsDemo = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ramesh@farm.com', password: 'password123' })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('agriguard_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return;
      }
    } catch (_) {}
    const demoUser = {
      id: 'usr_ramesh',
      name: 'Ramesh Patel',
      email: 'ramesh@farm.com',
      farmName: 'Green Valley Farm'
    };
    setUser(demoUser);
  };

  const logout = () => {
    localStorage.removeItem('agriguard_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      loginAsDemo,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
