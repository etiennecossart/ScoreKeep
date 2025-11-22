import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider } from './Auth/AuthContext';
import Login from './Auth/Login';
import Register from './Auth/Register';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <nav>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<div>Welcome to ScoreKeep!</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
