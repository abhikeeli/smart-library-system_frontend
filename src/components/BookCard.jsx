import React, { useContext } from 'react';
import { getRequiredScoreForTier } from '../utils/tierLogic';
import api from '../api/axiosConfig';
import { UserContext } from '../context/UserContext';

const BookCard = ({ book, user, onBorrowSuccess }) => {
  const minScore = getRequiredScoreForTier(book.requiredTier);
  const isLocked = user.creditScore < minScore;

  const { refreshUser } = useContext(UserContext);

  const handleBorrow = async () => {
    console.log("Current User Object:", user);

    if (!user || !user.id) {
      alert("You must be logged in to borrow books.");
      return;
    }

    try {
      const borrowerRequest = {
        bookId: book.id,
        userId: user.id
      };

      const response = await api.post(
        '/borrowing/issue',
        borrowerRequest
      );

      console.log(response);

      await refreshUser();

      alert(`${response.data}`);

      if (onBorrowSuccess) {
        onBorrowSuccess();
      }

    } catch (err) {
      console.error("Borrow error:", err);

      alert(
        err.response?.data?.message ||
        "Failed to borrow book. Check backend logs."
      );
    }
  };

  return (
    <div style={cardStyle(isLocked)}>

      {/* Lock badge */}
      {isLocked && (
        <span style={lockBadge}>
          🔒 Restricted
        </span>
      )}

      {/* BOOK IMAGE */}
      <img
        src={book.imageUrl}
        alt={book.title}
        style={imageStyle}
        onError={(e) => {
          e.target.src =
            'https://via.placeholder.com/300x400?text=No+Image';
        }}
      />

      {/* BOOK DETAILS */}
      <h3>{book.title}</h3>

      <p>
        <strong>Author:</strong> {book.author}
      </p>

      <p>
        <strong>Category:</strong> {book.category}
      </p>

      <p>
        <strong>Tier:</strong> {book.requiredTier}
        {' | '}
        <strong>Req:</strong> {minScore} pts
      </p>

      <p>
        <strong>Available:</strong> {book.availableCopies}
      </p>

      {/* BORROW SECTION */}
      {isLocked ? (
        <p style={{ color: 'red' }}>
          Need {minScore - user.creditScore} more points
        </p>
      ) : (
        <button
          onClick={handleBorrow}
          style={btnStyle}
        >
          Borrow Now
        </button>
      )}

    </div>
  );
};

/* Card style */
const cardStyle = (locked) => ({
  border: `2px solid ${locked ? '#ddd' : '#2563eb'}`,
  padding: '15px',
  borderRadius: '10px',
  opacity: locked ? 0.7 : 1,
  background: 'white',
  textAlign: 'left'
});

/* Book image */
const imageStyle = {
  width: '100%',
  height: '250px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginBottom: '12px'
};

/* Lock badge */
const lockBadge = {
  background: 'red',
  color: 'white',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  display: 'inline-block',
  marginBottom: '10px'
};

/* Borrow button */
const btnStyle = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  padding: '8px 15px',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default BookCard;
