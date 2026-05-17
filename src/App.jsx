import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import Home from './pages/Home'; // Move your current Library code to a file named pages/Home.jsx
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function App() {
  const { user, logout } = useContext(UserContext);

  return (
    <Router>
      <nav style={{ padding: '20px', background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#000' }}>📚 smart library</Link>
        <div>
          {user ? (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <Link to="/profile" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>
                My Profile
              </Link>
              <button onClick={logout} style={logoutBtnStyle}>
                Logout ({user.username})
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <Link to="/login" style={{ textDecoration: 'none', color: '#2563eb' }}>
        Login
      </Link>
      <Link to="/register" style={{ 
        textDecoration: 'none', 
        backgroundColor: '#2563eb', 
        color: 'white', 
        padding: '8px 16px', 
        borderRadius: '6px' 
      }}>
        Register
      </Link>
    </div>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
const logoutBtnStyle = {
  cursor: 'pointer',
  padding: '6px 12px',
  backgroundColor: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  marginLeft: '10px'
};

export default App;