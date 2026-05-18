import React from 'react';
import { getRequiredScoreForTier } from '../utils/tierLogic';
import api from '../api/axiosConfig';
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';
const BookCard = ({ book, user ,onBorrowSuccess}) => {
  const minScore = getRequiredScoreForTier(book.requiredTier);
  const isLocked = user.creditScore < minScore;
  const { refreshUser } = useContext(UserContext);
  const handleBorrow = async () => {
    // 1. Safety Check: Is the user logged in?
    console.log("Current User Object:", user);
    if (!user || !user.id) {
      alert("You must be logged in to borrow books.");
      return;
    }

    try {
      // 2. Construct the BorrowerRequest body
      const borrowerRequest = {
        bookId: book.id,
        userId: user.id
      };

      // 3. Send the POST request
      const response = await api.post('/borrowing/issue', borrowerRequest);
      console.log(response)
      await refreshUser();
      alert(`${response.data}`);
      // OPTIONAL: Reload to show updated reputation or book status
      if (onBorrowSuccess) {
        onBorrowSuccess(); 
      }
    } catch (err) {
      console.error("Borrow error:", err);
      alert(err.response?.data?.message || "Failed to borrow book. Check backend logs.");
    }
  };

  return (
    <div style={cardStyle(isLocked)}>
      {isLocked && <div style={lockBadge}>🔒 Restricted</div>}
      <h3>{book.title}</h3>
      <h5>author : {book.author} </h5>
      <p> category :{book.category}</p>
      <p>Tier: {book.requiredTier} | Req: {minScore} pts</p>
      <p>Availble: {book.availableCopies}</p>
      {isLocked ? (
        <p style={{ color: 'red' }}>Need {minScore - user.creditScore} more points</p>
      ) : (
        <button onClick={handleBorrow} style={btnStyle}>Borrow Now</button>
      )}
    </div>
  );
};

/* Simple Styles */
const cardStyle = (locked) => ({
  border: `2px solid ${locked ? '#ddd' : '#2563eb'}`,
  padding: '15px',
  borderRadius: '10px',
  opacity: locked ? 0.7 : 1,
  background: 'white',
  textAlign: 'left'
});

const lockBadge = {
  background: 'red',
  color: 'white',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  display: 'inline-block'
};

const btnStyle = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  padding: '8px 15px',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default BookCard;