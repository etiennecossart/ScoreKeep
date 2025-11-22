# ScoreKeep

A modern web application for keeping track of game scores and competitions between friends.

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: MongoDB with Mongoose
- Authentication: JWT (JSON Web Tokens)
- Password Security: bcryptjs for password hashing

## What's Been Implemented

### Backend (✅ Completed)

**Authentication System:**

- User registration with email, username, and password validation
- User login with JWT token generation
- Password hashing using bcryptjs (salt rounds: 10)
- JWT-based authentication middleware for protecting routes
- User model with profile picture support and game statistics tracking

**Game Management API:**

- Create new game sessions with multiple players
- Get all games for a logged-in user
- Get specific game details with populated player information
- Add scores to games with round tracking
- Automatic game completion detection based on target score or max rounds
- Game cancellation functionality
- Winner determination and automatic player statistics updates

**Database Models:**

- **User Model**: Stores username, email, hashed password, profile picture, and game statistics (games played, won, total score)
- **Game Model**: Supports multiple game types (darts, board_game, card_game, other), player management, score tracking per round, game status (active/completed/cancelled), and configurable game settings

**Server Setup:**

- Express server with CORS enabled
- MongoDB connection with error handling
- Environment variable configuration
- Error handling middleware
- Concurrent development server setup (backend + frontend)

### Frontend (✅ Completed)

**Authentication UI:**

- Login component with email and password
- Register component with username, email, and password
- React Router setup for navigation
- AuthContext for global authentication state management
- Token persistence in localStorage
- Basic navigation between login and register pages

**Application Structure:**

- React app initialized with Create React App
- Component-based architecture
- Context API for state management

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/scorekeep
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```
4. Start the development servers:
   ```bash
   npm run dev:full
   ```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
scorekeep/
├── client/             # React frontend
│   └── src/
│       ├── Auth/      # Authentication components and context
│       └── App.js     # Main application component
├── models/            # MongoDB models (User, Game)
├── routes/            # API routes (auth, games)
├── middleware/        # Custom middleware (auth)
├── server.js         # Express server
└── package.json
```

## Next Steps - TODO

### High Priority

- [ ] **Fix Missing Scores Route**: Remove or implement the `/api/scores` route referenced in `server.js` (currently doesn't exist)
- [ ] **Dashboard/Home Page**: Create a main dashboard that users see after logging in, showing their active games and recent activity
- [ ] **Game List Component**: Build UI to display all games the user is involved in, with filtering and sorting options
- [ ] **Game Creation Form**: Create a form component for users to create new games with player selection and game settings
- [ ] **Score Entry Interface**: Build the UI for entering and tracking scores during an active game
- [ ] **Protected Routes**: Implement route protection on the frontend to redirect unauthenticated users to login

### Medium Priority

- [ ] **Game Detail View**: Create a comprehensive game detail page showing all players, scores, rounds, and game progress
- [ ] **User Profile Page**: Display user statistics (games played, games won, total score) and allow profile picture upload
- [ ] **Game History**: Show completed games with winners and final scores
- [ ] **API Integration**: Connect frontend components to backend API endpoints with proper error handling
- [ ] **Loading States**: Add loading indicators for async operations (API calls, form submissions)
- [ ] **Error Handling**: Implement comprehensive error handling and user-friendly error messages throughout the app

### Low Priority / Enhancements

- [ ] **Real-time Updates**: Integrate WebSockets or Socket.io for real-time score updates during games
- [ ] **Material-UI Integration**: Add Material-UI components as mentioned in the original plan for a polished UI
- [ ] **Responsive Design**: Ensure the application works well on mobile devices
- [ ] **Player Search/Invite**: Allow users to search and invite other players to games
- [ ] **Game Statistics Charts**: Add visual charts/graphs for game statistics and trends
- [ ] **Game Rules Customization**: Enhance the game settings UI to allow detailed rule configuration
- [ ] **Notifications**: Add notifications for game invitations, completed games, and achievements
- [ ] **Social Features**: Add friend lists, leaderboards, and social sharing capabilities
