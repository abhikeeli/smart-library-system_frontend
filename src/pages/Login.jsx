import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    // 1. Send request to Spring Boot
    const response = await api.post('/auth/login', credentials);
    
    // 2. Destructure the data (Match this to your Java Controller response)
    const { user, token } = response.data;
    
    // 3. Save to global Context (This unlocks the books!)
    login(user, token);
    
    // 4. Go to Library
    navigate('/');
  } catch (err) {
    console.error("Login failed", err);
    alert("Incorrect username or password. Is the backend running?");
  }
};

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Library Login</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Username" 
          onChange={(e) => setCredentials({...credentials, username: e.target.value})} 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer' }}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;