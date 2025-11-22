import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { lobbyAPI } from '../api/client';
import './Lobby.css';

function Lobby() {
  const { sessionCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [lobby, setLobby] = useState(location.state?.lobby || null);
  const [playerName, setPlayerName] = useState(location.state?.playerName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [polling, setPolling] = useState(true);

  // Fetch lobby state
  const fetchLobby = async () => {
    try {
      const data = await lobbyAPI.getLobby(sessionCode);
      setLobby(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch lobby');
      setPolling(false);
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    if (!lobby && sessionCode) {
      fetchLobby();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionCode]);

  // Poll for lobby updates every 2 seconds
  useEffect(() => {
    if (!polling || !sessionCode) return;

    const interval = setInterval(() => {
      fetchLobby();
    }, 2000);

    return () => clearInterval(interval);
  }, [polling, sessionCode]);

  const handleJoinLobby = async (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await lobbyAPI.joinLobby(sessionCode, playerName.trim());
      setLobby(data);
      setPlayerName(playerName.trim());
      setPolling(true);
    } catch (err) {
      setError(err.message || 'Failed to join lobby');
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = () => {
    // TODO: Implement start game functionality
    navigate(`/game/${lobby.gameId}`);
  };

  if (!lobby && !error) {
    return (
      <div className="lobby-container">
        <div className="loading">Loading lobby...</div>
      </div>
    );
  }

  // If user hasn't joined yet, show join form
  if (lobby && !lobby.players.includes(playerName)) {
    return (
      <div className="lobby-container">
        <div className="lobby-header">
          <h2>Join Lobby</h2>
          <div className="session-code">
            <span className="code-label">Session Code:</span>
            <span className="code-value">{sessionCode}</span>
          </div>
        </div>

        <form onSubmit={handleJoinLobby} className="join-form">
          <div className="form-group">
            <label htmlFor="joinPlayerName">Your Name</label>
            <input
              id="joinPlayerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="join-button">
            {loading ? 'Joining...' : 'Join Lobby'}
          </button>
        </form>

        <div className="current-players">
          <h3>Players in Lobby ({lobby.players.length})</h3>
          <ul>
            {lobby.players.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // User is in lobby, show lobby state
  return (
    <div className="lobby-container">
      <div className="lobby-header">
        <h2>Game Lobby</h2>
        <div className="session-code">
          <span className="code-label">Session Code:</span>
          <span className="code-value">{sessionCode}</span>
        </div>
        <div className="game-variant">
          Game: <strong>{lobby.gameVariant.toUpperCase()}</strong>
        </div>
      </div>

      <div className="players-section">
        <h3>Players ({lobby.players.length})</h3>
        <ul className="players-list">
          {lobby.players.map((player, index) => (
            <li key={index} className={player === playerName ? 'current-player' : ''}>
              {player}
              {player === playerName && <span className="you-badge">You</span>}
            </li>
          ))}
        </ul>
      </div>

      {lobby.players.length >= 2 && (
        <button 
          onClick={handleStartGame} 
          className="start-game-button"
        >
          Start Game
        </button>
      )}

      {lobby.players.length < 2 && (
        <div className="waiting-message">
          Waiting for more players... (Need at least 2)
        </div>
      )}
    </div>
  );
}

export default Lobby;

