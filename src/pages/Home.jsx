import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import BookCard from '../components/BookCard';
import api from '../api/axiosConfig';

const Home = () => {
  const { user } = useContext(UserContext);

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const url = search.trim()
        ? `/books/search?title=${search}`
        : `/books/all`;

      const response = await api.get(url);
      setBooks(response.data);

    } catch (err) {
      console.error("Database fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchBooks();

  const interval = setInterval(() => {
    fetchBooks();
  }, 10000); // every 10 seconds

  return () => clearInterval(interval);
}, [search]);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading Library...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>

      {/* Search Section */}
      <div
        style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      {/* User Section */}
      <div style={{ marginBottom: '20px' }}>

        {user ? (
          <>
            <p>
              Welcome, {user.username}! Reputation: {user.creditScore}
            </p>

            {/* ADMIN ONLY */}
            {user.role === 'ROLE_ADMIN' && (
              <Link to="/admin/add-book">
                <button style={buttonStyle}>
                  + Add Book
                </button>
              </Link>
            )}
          </>
        ) : (
          <p style={{ color: '#666' }}>
            Guest Mode: Login to access Tier 1-3 books.
          </p>
        )}

      </div>

      {/* THE BOOKS GRID */}
      <div style={gridStyle}>
  {books.length > 0 ? (
    books.map(book => {
      console.log("BOOK:", book);

      return (
        <BookCard
          key={book.id}
          book={book}
          user={
            user || {
              username: 'Guest',
              creditScore: 0
            }
          }
          onBorrowSuccess={fetchBooks}
        />
      );
    })
  ) : (
    <p>No books found in the database.</p>
  )}
</div>

    </div>
  );
};

/* Search input style */
const searchInputStyle = {
  width: '100%',
  maxWidth: '500px',
  padding: '12px 20px',
  borderRadius: '25px',
  border: '1px solid #ddd',
  fontSize: '1rem',
  outline: 'none',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};

/* Books grid */
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '25px',
  marginTop: '20px'
};

/* Admin button */
const buttonStyle = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#2563eb',
  color: 'white',
  fontSize: '15px',
  cursor: 'pointer'
};

export default Home;
