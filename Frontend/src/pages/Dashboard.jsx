import { useState, useEffect } from 'react';
import { getCurrentUser, getAllUsers, getLogoutUrl } from '../api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUsers, setShowUsers] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Not authenticated. Redirecting to login...');
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000);
      });
  }, [navigate]);

  const fetchUsers = () => {
    setShowUsers(true);
    getAllUsers()
      .then(setUsers)
      .catch(() => setUsers([]));
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-msg">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <div className="nav-brand">E-Commerce Automation</div>
        <div className="nav-links">
          <button className="btn btn-outline" onClick={() => navigate('/')}>
            Home
          </button>
          <a href={getLogoutUrl()} className="btn btn-danger">
            Logout
          </a>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="profile-card">
          <img src={user.picture} alt={user.name} className="profile-pic" />
          <h2>{user.name}</h2>
          <p className="email">{user.email}</p>
          <span className="badge">Google OAuth2</span>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>0</h3>
            <p>Total Orders</p>
          </div>
          <div className="stat-card">
            <h3>0</h3>
            <p>Products</p>
          </div>
          <div className="stat-card">
            <h3>0</h3>
            <p>Automations</p>
          </div>
        </div>

        <section className="api-test-section">
          <h2>API Testing</h2>
          <div className="api-buttons">
            <button className="btn btn-primary" onClick={fetchUsers}>
              GET /api/users
            </button>
          </div>

          {showUsers && (
            <div className="api-result">
              <h4>Registered Users ({users.length})</h4>
              {users.length === 0 ? (
                <p className="muted">No users found.</p>
              ) : (
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.provider}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
