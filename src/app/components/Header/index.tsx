import * as React from 'react';
import { Link } from 'react-router';

const style = require('./style.css');

export const Header = () => (
  <nav className={style.Nav}>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/conduct">Conduct</Link></li>
      <li><Link to="/review">Review</Link></li>
      <li><Link to="/settings">Settings</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  </nav>
);
