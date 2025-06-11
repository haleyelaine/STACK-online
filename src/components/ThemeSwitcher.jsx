import React from 'react';

const themes = ['Light', 'Dark', 'Emerald', 'Pink'];

export default function ThemeSwitcher() {
  const current = localStorage.getItem('theme') || 'light';

  const handleChange = (e) => {
    const theme = e.target.value;
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  return (
    <div className="mb-4">
      <label htmlFor="theme-select" className="block text-fg mb-1 font-semibold">Select Theme:</label>
      <select
        id="theme-select"
        defaultValue={current}
        onChange={handleChange}
        className="border border-gray-300 p-2 rounded bg-bg text-fg"
      >
        {themes.map((theme) => (
          <option key={theme} value={theme}>{theme}</option>
        ))}
      </select>
    </div>
  );
}
