import React, { useState } from 'react';
import api from '../api/axiosConfig';

const AdminAddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    imageUrl: '',
    barcode: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/admin/add-book', formData);

      setMessage(response.data);

      // Clear form after successful addition
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: '',
        imageUrl: '',
        barcode: ''
      });

    } catch (err) {
      console.error('Add book failed:', err);

      if (err.response) {
        setError(
          err.response.data || 'Failed to add book.'
        );
      } else {
        setError('Unable to connect to server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2>Add New Book</h2>

        {message && (
          <p style={successStyle}>{message}</p>
        )}

        {error && (
          <p style={errorStyle}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={formData.title}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="isbn"
            placeholder="ISBN"
            value={formData.isbn}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="imageUrl"
            placeholder="Book Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="barcode"
            placeholder="Barcode"
            value={formData.barcode}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? 'Adding Book...' : 'Add Book'}
          </button>

        </form>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '40px 20px'
};

const cardStyle = {
  width: '100%',
  maxWidth: '500px',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  backgroundColor: '#fff'
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px',
  marginBottom: '15px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '16px'
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#2563eb',
  color: 'white',
  fontSize: '16px',
  cursor: 'pointer'
};

const successStyle = {
  color: 'green',
  backgroundColor: '#e8f5e9',
  padding: '10px',
  borderRadius: '5px'
};

const errorStyle = {
  color: 'red',
  backgroundColor: '#ffebee',
  padding: '10px',
  borderRadius: '5px'
};

export default AdminAddBook;

