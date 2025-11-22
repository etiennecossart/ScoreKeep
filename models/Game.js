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
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
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

module.exports = mongoose.model('Game', gameSchema); 