import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './login.css';

const LoginScreen: React.FC = () => {
  return (
    <div className="auth-form-container">
      <h1 className="auth-form-title">Login</h1>
      <div className="auth-form">
        <form>
          <div className="auth-form-field">
            <label className="auth-form-label" htmlFor="email">
              Email
            </label>
            <input className="auth-form-input" type="email" id="email" />
          </div>
          <div className="auth-form-field">
            <label className="auth-form-label" htmlFor="password">
              Password
            </label>
            <input className="auth-form-input" type="password" id="password" />
          </div>
          <button className="auth-form-button">Login</button>
        </form>
      </div>
      <p className="auth-form-text">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
      <p className="auth-form-text">
        <Link to="/">Go back to Home</Link>
      </p>
    </div>
  );
};

export default LoginScreen;
