import React, { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <button 
      className="btn btn-secondary" 
      onClick={() => setIsDarkMode(!isDarkMode)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
    >
      <img 
        src={isDarkMode ? 'assets/icon--sun.svg' : 'assets/icon--moon.svg'} 
        width="20" 
        height="20" 
        alt={isDarkMode ? 'Sun Icon' : 'Moon Icon'} 
        className="btn-icon" 
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      <span>{isDarkMode ? 'Light Theme' : 'Dark Theme'}</span>
    </button>
  );
}
