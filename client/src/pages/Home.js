import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lobbyAPI } from '../api/client';
import './Home.css';

function Home() {
  const [playerName, setPlayerName] = useState('');
  const [gameVariant, setGameVariant] = useState('cricket');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateLobby = async (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const lobby = await lobbyAPI.createLobby(gameVariant, playerName.trim());
      // Navigate to lobby page with session code
      navigate(`/lobby/${lobby.sessionCode}`, { 
        state: { 
          lobby, 
          playerName: playerName.trim() 
        } 
      });
    } catch (err) {
      setError(err.message || 'Failed to create lobby');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h1>ScoreKeep</h1>
      <p className="subtitle">Keep track of game scores with friends</p>

      <form onSubmit={handleCreateLobby} className="lobby-form">
        <div className="form-group">
          <label htmlFor="playerName">Your Name</label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            disabled={loading}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="gameVariant">Game Type</label>
          <select
            id="gameVariant"
            value={gameVariant}
            onChange={(e) => setGameVariant(e.target.value)}
            disabled={loading}
          >
            <option value="cricket">Cricket (Darts)</option>
            <option value="x01">X01 (Darts)</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="create-button">
          {loading ? 'Creating...' : 'Create Lobby'}
        </button>
      </form>

      <div className="join-section">
        <p>Or join an existing lobby:</p>
        <button 
          onClick={() => navigate('/join')} 
          className="join-button"
          disabled={loading}
        >
          Join Lobby
        </button>
      </div>
    </div>
  );
}

export default Home;

