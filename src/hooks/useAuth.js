import { useState, useEffect } from 'react';

const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data);
            setIsAuthenticated(true);
          } else if (response.status === 401 || response.status === 403) {
            // Only clear token on auth errors (401/403)
            console.error('Token invalid - clearing');
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          } else {
            // For other errors (500, etc), just log but keep token
            console.error('Verification failed with status:', response.status);
            // Still mark as authenticated if we have a token
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Verification fetch failed', error);
          // Keep token on network errors, just mark as authenticated
          setIsAuthenticated(true);
        }
      }
    };
    verifyToken();
  }, [token]);

  const signup = async (email, password) => {
    try {
      console.log('Attempting signup with:', { email, password });
      
      const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Signup response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        const contentType = response.headers.get('content-type');
        let errorMessage = `Signup failed: ${response.status} ${response.statusText}`;
        
        try {
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            console.error('Signup error response:', errorData);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            const text = await response.text();
            console.error('Signup error text:', text);
            errorMessage = text || errorMessage;
          }
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
        }
        
        return { success: false, error: { message: errorMessage } };
      }
    } catch (error) {
      console.error('Signup exception:', error);
      return { success: false, error: { message: error.message || 'Signup failed' } };
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        const contentType = response.headers.get('content-type');
        let errorMessage = `Login failed: ${response.status} ${response.statusText}`;
        
        try {
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            console.error('Login error response:', errorData);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            const text = await response.text();
            console.error('Login error text:', text);
            errorMessage = text || errorMessage;
          }
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
        }
        
        return { success: false, error: { message: errorMessage } };
      }
    } catch (error) {
      console.error('Login exception:', error);
      return { success: false, error: { message: error.message || 'Login failed' } };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return { token, user, isAuthenticated, signup, login, logout };
};

export default useAuth;
