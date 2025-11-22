const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['darts', 'board_game', 'card_game', 'other']
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  scores: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: {
      type: Number,
      default: 0
    },
    rounds: [{
      roundNumber: Number,
      score: Number,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  status: {
    type: String,
    enum: ['lobby', 'active', 'completed', 'cancelled'],
    default: 'lobby'
  },
  // Lobby fields
  sessionCode: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
    index: true
  },
  isAnonymous: {
    type: Boolean,
    default: true
  },
  gameVariant: {
    type: String,
    enum: ['cricket', 'x01', 'other'],
    default: 'cricket'
  },
  teams: {
    A: [String], // Array of player identifiers (userId or anonymous name)
    B: [String]
  },
  activePlayer: {
    type: String // userId or anonymous player name
  },
  turnOrder: [String], // Array of player identifiers
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  settings: {
    maxRounds: Number,
    targetScore: Number,
    customRules: String
  }
});

// Method to add a score for a player
gameSchema.methods.addScore = async function(playerId, score, roundNumber) {
  const playerScore = this.scores.find(s => s.player.toString() === playerId.toString());
  
  if (playerScore) {
    playerScore.score += score;
    playerScore.rounds.push({
      roundNumber,
      score,
      timestamp: new Date()
    });
  } else {
    this.scores.push({
      player: playerId,
      score,
      rounds: [{
        roundNumber,
        score,
        timestamp: new Date()
      }]
    });
  }
  
  return this.save();
};

// Method to check if game is complete
gameSchema.methods.checkGameComplete = function() {
  if (this.settings.targetScore) {
    return this.scores.some(s => s.score >= this.settings.targetScore);
  }
  if (this.settings.maxRounds) {
    return this.scores[0]?.rounds.length >= this.settings.maxRounds;
  }
  return false;
};

// Method to randomize teams
gameSchema.methods.randomizeTeams = function() {
  const allPlayers = [...this.teams.A, ...this.teams.B];
  // Shuffle array
  const shuffled = allPlayers.sort(() => Math.random() - 0.5);
  // Split into two teams
  const mid = Math.ceil(shuffled.length / 2);
  this.teams.A = shuffled.slice(0, mid);
  this.teams.B = shuffled.slice(mid);
  return this.save();
};

// Method to advance turn to next player
gameSchema.methods.advanceTurn = function() {
  if (!this.turnOrder || this.turnOrder.length === 0) {
    return null;
  }
  const currentIndex = this.turnOrder.findIndex(p => p === this.activePlayer);
  const nextIndex = (currentIndex + 1) % this.turnOrder.length;
  this.activePlayer = this.turnOrder[nextIndex];
  return this.save();
};

module.exports = mongoose.model('Game', gameSchema); 