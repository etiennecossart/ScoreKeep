const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const auth = require('../middleware/auth');
const { generateSessionCode } = require('../utils/sessionCode');

// ===== LOBBY ENDPOINTS (No auth required for anonymous lobbies) =====

// Create a new lobby session
router.post('/session', async (req, res) => {
  try {
    const { gameVariant = 'cricket', playerName } = req.body;
    
    // Generate unique session code
    let sessionCode;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      sessionCode = generateSessionCode();
      const existing = await Game.findOne({ sessionCode });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }
    
    if (!isUnique) {
      return res.status(500).json({ message: 'Failed to generate unique session code' });
    }
    
    // Create lobby game
    const game = new Game({
      name: `${gameVariant} Game - ${sessionCode}`,
      type: 'darts',
      status: 'lobby',
      sessionCode,
      isAnonymous: true,
      gameVariant,
      teams: { A: [], B: [] },
      turnOrder: []
    });
    
    // Add creator as first player
    if (playerName) {
      game.turnOrder.push(playerName);
      game.teams.A.push(playerName);
    }
    
    await game.save();
    
    res.status(201).json({
      gameId: game._id,
      sessionCode: game.sessionCode,
      gameVariant: game.gameVariant,
      players: game.turnOrder,
      teams: game.teams,
      status: game.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating lobby', error: error.message });
  }
});

// Join a lobby by session code
router.post('/session/join', async (req, res) => {
  try {
    const { sessionCode, playerName } = req.body;
    
    if (!sessionCode || !playerName) {
      return res.status(400).json({ message: 'Session code and player name are required' });
    }
    
    const game = await Game.findOne({ sessionCode, status: 'lobby' });
    
    if (!game) {
      return res.status(404).json({ message: 'Lobby not found or game has already started' });
    }
    
    // Check if player already in lobby
    if (game.turnOrder.includes(playerName)) {
      return res.status(400).json({ message: 'Player already in lobby' });
    }
    
    // Add player to lobby
    game.turnOrder.push(playerName);
    // Add to team A by default (can be reassigned later)
    game.teams.A.push(playerName);
    
    await game.save();
    
    res.json({
      gameId: game._id,
      sessionCode: game.sessionCode,
      gameVariant: game.gameVariant,
      players: game.turnOrder,
      teams: game.teams,
      status: game.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Error joining lobby', error: error.message });
  }
});

// Get lobby state by session code
router.get('/session/:sessionCode', async (req, res) => {
  try {
    const { sessionCode } = req.params;
    
    const game = await Game.findOne({ sessionCode });
    
    if (!game) {
      return res.status(404).json({ message: 'Lobby not found' });
    }
    
    res.json({
      gameId: game._id,
      sessionCode: game.sessionCode,
      gameVariant: game.gameVariant,
      players: game.turnOrder,
      teams: game.teams,
      status: game.status,
      activePlayer: game.activePlayer
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lobby', error: error.message });
  }
});

// ===== EXISTING GAME ENDPOINTS (Auth required) =====

// Create a new game
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, players, settings } = req.body;
    
    const game = new Game({
      name,
      type,
      players: [...players, req.user._id], // Include the creator
      settings
    });

    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error creating game', error: error.message });
  }
});

// Get all games for a user
router.get('/', auth, async (req, res) => {
  try {
    const games = await Game.find({
      players: req.user._id
    }).populate('players', 'username profilePicture');
    
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching games', error: error.message });
  }
});

// Get a specific game
router.get('/:id', auth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('players', 'username profilePicture')
      .populate('winner', 'username');
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game', error: error.message });
  }
});

// Add a score to a game
router.post('/:id/scores', auth, async (req, res) => {
  try {
    const { score, roundNumber } = req.body;
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    if (game.status !== 'active') {
      return res.status(400).json({ message: 'Game is not active' });
    }
    
    await game.addScore(req.user._id, score, roundNumber);
    
    // Check if game is complete
    if (game.checkGameComplete()) {
      game.status = 'completed';
      game.completedAt = new Date();
      
      // Find winner
      const winner = game.scores.reduce((prev, current) => 
        (prev.score > current.score) ? prev : current
      );
      game.winner = winner.player;
      
      // Update player stats
      for (const playerScore of game.scores) {
        const player = await User.findById(playerScore.player);
        player.gameStats.gamesPlayed += 1;
        if (playerScore.player.toString() === winner.player.toString()) {
          player.gameStats.gamesWon += 1;
        }
        player.gameStats.totalScore += playerScore.score;
        await player.save();
      }
    }
    
    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error adding score', error: error.message });
  }
});

// Cancel a game
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    if (game.status !== 'active') {
      return res.status(400).json({ message: 'Game is not active' });
    }
    
    game.status = 'cancelled';
    await game.save();
    
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling game', error: error.message });
  }
});

module.exports = router; 