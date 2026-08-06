import { useState, useEffect } from 'react';

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark-mode', isDark);
  }, [isDark]);

  const toggle = () => setIsDark(!isDark);
  return [isDark, toggle];
};

export default useDarkMode;