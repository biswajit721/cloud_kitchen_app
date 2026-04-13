import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session on page load (kept exactly as your original) ──────────
  useEffect(() => {
    const storedUser  = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  // FIX: Your original only accepted (email, password) and always sent
  //      { email, password } — so phone login NEVER worked.
  //
  // Now accepts (identifier, password, method)
  //   method = "email"  →  sends { email, password, method }
  //   method = "phone"  →  sends { phone, password, method }
  //
  // Your authController.js loginUser() checks:
  //   if (method === 'phone' && phone)  → User.findOne({ phone })
  //   else if (email)                   → User.findOne({ email })
  // ──────────────────────────────────────────────────────────────────────────
  const login = async (identifier, password, method = 'email') => {
    try {
      // Build the correct request body based on login method
      const body = method === 'phone'
        ? { phone: identifier.replace(/\s/g, ''), password, method }
        : { email: identifier.trim().toLowerCase(), password, method };

      const response = await fetch('http://localhost:8000/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data));
      setUser(data);
      return { success: true };

    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // ── REGISTER ───────────────────────────────────────────────────────────────
  // FIX: Your original only sent (name, email, password).
  //      Now also sends phone if provided (optional field in your User model).
  // ──────────────────────────────────────────────────────────────────────────
  const register = async (name, email, password, phone) => {
    try {
      const body = { name, email, password };

      // Only include phone if the user actually filled it in
      if (phone && phone.replace(/\s/g, '').length > 0) {
        body.phone = phone.replace(/\s/g, '');
      }

      const response = await fetch('http://localhost:8000/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data));
      setUser(data);
      return { success: true };

    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // ── LOGOUT (kept exactly as your original) ─────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);