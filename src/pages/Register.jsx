import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'ROLE_STUDENT' // Default role
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
        const response = await api.post('/auth/register', formData);


        alert("Registration Successful! Please login.");
        navigate('/login');

    } catch (err) {
        console.error("Registration error:", err);

        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Response:", err.response.data);

            alert(
                `Registration failed.\nStatus: ${err.response.status}\n` +
                `Error: ${JSON.stringify(err.response.data)}`
            );
        } else if (err.request) {
            console.error("No response received:", err.request);

            alert("Registration failed: No response from backend.");
        } else {
            console.error("Request error:", err.message);

            alert(`Registration failed: ${err.message}`);
        }
    }
  };

  return (
    <div style={formContainer}>
      <form onSubmit={handleRegister} style={formCard}>
        <h2>Student Registration</h2>
        <input 
          type="text" 
          placeholder="Username" 
          required
          onChange={(e) => setFormData({...formData, username: e.target.value})} 
          style={inputField}
        />
        <input 
          type="password" 
          placeholder="Password" 
          required
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          style={inputField}
        />
        <button type="submit" style={submitBtn}>Create Account</button>
        <p style={{textAlign: 'center'}}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

/* Styles */
const formContainer = { display: 'flex', justifyContent: 'center', marginTop: '50px' };
const formCard = { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '350px', display: 'flex', flexDirection: 'column', gap: '15px' };
const inputField = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd' };
const submitBtn = { padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default Register;