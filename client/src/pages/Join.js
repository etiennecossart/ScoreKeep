import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Join.css';

function Join() {
  const [sessionCode, setSessionCode] = useState('');
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    
    if (!sessionCode.trim()) {
      alert('Please enter a session code');
      return;
    }

    // Navigate to lobby page with session code
    navigate(`/lobby/${sessionCode.trim().toUpperCase()}`);
  };

  return (
    <div className="join-container">
      <h2>Join Lobby</h2>
      <p className="subtitle">Enter the session code to join a game</p>

      <form onSubmit={handleJoin} className="join-form">
        <div className="form-group">
          <label htmlFor="sessionCode">Session Code</label>
          <input
            id="sessionCode"
            type="text"
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-character code"
            maxLength={6}
            autoFocus
            className="code-input"
          />
        </div>

        <button type="submit" className="join-button">
          Join Lobby
        </button>
      </form>

      <button 
        onClick={() => navigate('/')} 
        className="back-button"
      >
        ← Back to Home
      </button>
    </div>
  );
}

export default Join;

