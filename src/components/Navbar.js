import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <h2>RBAC Dashboard</h2>
      <ul className="nav-links">
        <li><Link to="/users">👤 User Management</Link></li>
        <li><Link to="/roles">🛡️ Role Management</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;