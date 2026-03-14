import { useState, useEffect } from 'react';
import { getGoogleLoginUrl, checkAuthStatus } from '../api';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus()
      .then((data) => setAuthenticated(data.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  return (
    <div className="home">
      <nav className="navbar">
        <div className="nav-brand">E-Commerce Automation</div>
        <div className="nav-links">
          {authenticated ? (
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          ) : (
            <a href={getGoogleLoginUrl()} className="btn btn-primary">
              Sign In
            </a>
          )}
        </div>
      </nav>

      <section className="hero">
        <h1>E-Commerce Automation Platform</h1>
        <p>Manage your orders, products, and automations all in one place.</p>
        {authenticated ? (
          <button className="btn btn-large" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        ) : (
          <a href={getGoogleLoginUrl()} className="btn btn-large">
            Get Started — Sign in with Google
          </a>
        )}
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Order Management</h3>
          <p>Track and manage orders from multiple platforms in one dashboard.</p>
        </div>
        <div className="feature-card">
          <h3>Analytics</h3>
          <p>Get insights into your sales, revenue, and customer behavior.</p>
        </div>
        <div className="feature-card">
          <h3>Automation</h3>
          <p>Automate repetitive tasks and focus on growing your business.</p>
        </div>
      </section>
    </div>
  );
}
