// src/hooks/useInitTheme.js
import { useEffect } from 'react';

export function useInitTheme() {
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const theme = stored || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);
}
