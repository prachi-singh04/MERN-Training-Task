

import React, { useState } from 'react';
import './App.css';
import heroBg from './assets/hero-bg.svg';

function App() {
  const [view, setView] = useState('search');
  
  return (
    <div className="scroll-bg">
      <img src={heroBg} alt="background" className="hero-bg" />
      
      {/* Modern Navigation Bar */}
      <nav className="main-navbar">
        <div className="logo-row">
          <span className="logo-icon">🩸</span>
          <span className="brand-title">Blood Donor Search</span>
        </div>
        <div className="nav-actions">
          <button 
            className={view === 'login' ? "active" : ''} 
            onClick={() => setView('login')}
          >
            Login
          </button>
          <button 
            className={view === 'register' ? "active" : ''} 
            onClick={() => setView('register')}
          >
            Sign Up
          </button>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Find & Connect with Blood Donors</h1>
        <p className="hero-text">
          Search, register, and help save lives. Your donation can make a difference!
        </p>
        <button className="cta-btn" onClick={() => setView('register')}>
          Become a Donor
        </button>
      </section>
      
      {/* Main Content */}
      <main className="main-content">
        <div className="fadein">
          {view === 'login' && (
            <div className="card">
              <div className="card-header">
                <h2>Welcome Back</h2>
                <p>Sign in to your account to continue</p>
              </div>
              <LoginForm onSuccess={() => setView('search')} />
            </div>
          )}
          
          {view === 'register' && (
            <div className="card">
              <div className="card-header">
                <h2>Join Our Community</h2>
                <p>Register as a blood donor and help save lives</p>
              </div>
              <RegisterForm onSuccess={() => setView('login')} />
            </div>
          )}
          
          {view === 'search' && (
            <div className="card">
              <div className="card-header">
                <h2>Search Blood Donors</h2>
                <p>Find donors in your area by applying filters</p>
              </div>
              <DonorSearch />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      localStorage.setItem('token', data.token);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && (
        <div className="alert error">
          <span>⚠️</span>
          {error}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
}

function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: '', 
    email: '', 
    mobile: '', 
    gender: '', 
    bloodGroup: '', 
    city: '', 
    aadharnumber: '', 
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      setSuccess('Registration successful! Please login.');
      setTimeout(onSuccess, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && (
        <div className="alert error">
          <span>⚠️</span>
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert success">
          <span>✅</span>
          {success}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          placeholder="Enter your full name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="mobile">Mobile Number</label>
        <input
          id="mobile"
          name="mobile"
          placeholder="Enter your mobile number"
          value={form.mobile}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="bloodGroup">Blood Group</label>
        <select
          id="bloodGroup"
          name="bloodGroup"
          value={form.bloodGroup}
          onChange={handleChange}
          required
        >
          <option value="">Select blood group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="city">City</label>
        <input
          id="city"
          name="city"
          placeholder="Enter your city"
          value={form.city}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="aadharnumber">Aadhar Number</label>
        <input
          id="aadharnumber"
          name="aadharnumber"
          placeholder="Enter your Aadhar number"
          value={form.aadharnumber}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}

function DonorSearch() {
  const [filters, setFilters] = useState({ gender: '', city: '', bloodGroup: '' });
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });
  
  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    
    try {
      let query = Object.entries(filters)
        .filter(([k, v]) => v)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&');
      
      const res = await fetch(`/api/donors/search?${query}`);
      const data = await res.json();
      setDonors(data);
    } catch (error) {
      console.error('Search failed:', error);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };
  
  const hasFilters = Object.values(filters).some(value => value);
  
  return (
    <div className="search-section">
      <div className="filters">
        <select name="gender" value={filters.gender} onChange={handleChange}>
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        
        <input 
          name="city" 
          placeholder="Enter city name" 
          value={filters.city} 
          onChange={handleChange} 
        />
        
        <select name="bloodGroup" value={filters.bloodGroup} onChange={handleChange}>
          <option value="">All Blood Groups</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
        
        <button 
          onClick={handleSearch} 
          disabled={loading || !hasFilters}
        >
          {loading ? 'Searching...' : 'Search Donors'}
        </button>
      </div>
      
      <div className="results">
        {loading ? (
          <p>🔍 Searching for donors...</p>
        ) : hasSearched && donors.length === 0 ? (
          <p>😔 No donors found matching your criteria.</p>
        ) : hasSearched && donors.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Blood Group</th>
                <th>City</th>
                <th>Mobile</th>
              </tr>
            </thead>
            <tbody>
              {donors.map(d => (
                <tr key={d._id}>
                  <td>{d.name}</td>
                  <td>{d.gender}</td>
                  <td>
                    <span style={{
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {d.bloodGroup}
                    </span>
                  </td>
                  <td>{d.city}</td>
                  <td>{d.mobile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>👆 Use the filters above to search for blood donors in your area.</p>
        )}
      </div>
    </div>
  );
}

export default App;
