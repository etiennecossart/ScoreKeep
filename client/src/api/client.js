/**
 * API Client for ScoreKeep
 * Handles all API calls to the backend
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiCall(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Lobby API calls
export const lobbyAPI = {
  // Create a new lobby
  createLobby: async (gameVariant = 'cricket', playerName) => {
    return apiCall('/games/session', {
      method: 'POST',
      body: JSON.stringify({ gameVariant, playerName }),
    });
  },

  // Join a lobby by session code
  joinLobby: async (sessionCode, playerName) => {
    return apiCall('/games/session/join', {
      method: 'POST',
      body: JSON.stringify({ sessionCode, playerName }),
    });
  },

  // Get lobby state
  getLobby: async (sessionCode) => {
    return apiCall(`/games/session/${sessionCode}`);
  },
};

// Auth API calls (if needed)
export const authAPI = {
  login: async (email, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (username, email, password) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },
};

