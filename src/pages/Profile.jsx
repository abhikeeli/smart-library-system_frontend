import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import api from '../api/axiosConfig';

const Profile = () => {
  const { user ,refreshUser } = useContext(UserContext);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBooks = async () => {
    try {
    // We don't pass an ID because the backend uses Principal/Token
    const response = await api.get('/borrowing/my-books');
    setBorrowedBooks(response.data);
    } catch (err) {
    console.error("Error fetching profile books:", err);
    } finally {
    setLoading(false);
    }
  };

  const handleReturn = async (copyId) => {
    try {
        const response = await api.post(`/borrowing/return/${copyId}`);
        
        // Show the nice success message from the backend
        alert(response.data); 
        
        // Refresh the UI without a page reload
        fetchMyBooks();   // Updates the list of borrowed books
        await refreshUser();    // Updates the reputation score in the navbar
    } catch (err) {
        alert(err.response?.data || "Could not return book. Please try again.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyBooks();
    }
  }, [user,borrowedBooks]);

  if (!user) return <div style={containerStyle}>Please log in to view your profile.</div>;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2>Student Profile</h2>
        <div style={badgeStyle}>{user.membershipTier} Member</div>
      </div>

      <div style={infoGrid}>
        <div style={infoCard}>
          <small>Username</small>
          <p>{user.username}</p>
        </div>
        <div style={infoCard}>
          <small>Reputation Score</small>
          <p>{user.creditScore} pts</p>
        </div>
      </div>

      <h3 style={{ marginTop: '30px' }}>Your Borrowed Books</h3>
      {loading ? (
        <p>Loading your books...</p>
      ) : borrowedBooks.length > 0 ? (
        <div style={bookList}>
          {borrowedBooks.map(book => (
            <div key={book.id} style={bookItem}>
              <div>
                <strong>{book.book.title}</strong>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>barcode: {book.barcode}</p>
              </div>
              <button onClick ={() => handleReturn(book.id)} style={returnBtn}>Return</button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#666' }}>You currently have no borrowed books.</p>
      )}
    </div>
  );
};

/* --- Styles --- */
const containerStyle = { padding: '40px', maxWidth: '800px', margin: '0 auto' };
const headerStyle = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' };
const badgeStyle = { background: '#2563eb', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem' };
const infoGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const infoCard = { padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' };
const bookList = { marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' };
const bookItem = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #eee', borderRadius: '8px' };
const returnBtn = { background: 'none', border: '1px solid #dc2626', color: '#dc2626', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };

export default Profile;