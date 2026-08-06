import React from 'react';

const ThemeToggle = ({ isDark, onToggle }) => (
  <button onClick={onToggle} className="theme-toggle-btn">
    {isDark ? '☀️' : '🌙'}
  </button>
);

export default ThemeToggle;