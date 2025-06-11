import { useEffect, useState } from 'react';

const fontSizes = {
  base: 'Default',
  sm: 'Compact',
  lg: 'Large',
};

const themes = {
  Light: 'Light',
  Dark: 'Dark',
  Emerald: 'Emerald',
  Pink: 'Pink',
};

export default function CustomizeView() {
  const [fontSize, setFontSize] = useState('base');
  const [compactMode, setCompactMode] = useState(false);
  const [theme, setTheme] = useState('Light');

  useEffect(() => {
    const storedFont = localStorage.getItem('fontSize') || 'base';
    const storedCompact = localStorage.getItem('compactMode') === 'true';
    const storedTheme = localStorage.getItem('theme') || 'Light';

    applyFontSize(storedFont);
    applyCompactMode(storedCompact);
    applyTheme(storedTheme);
  }, []);

  const applyFontSize = (size) => {
    document.body.classList.remove('text-sm', 'text-base', 'text-lg');
    document.body.classList.add(`text-${size}`);
    localStorage.setItem('fontSize', size);
    setFontSize(size);
  };

  const applyCompactMode = (enabled) => {
    document.body.classList.toggle('compact', enabled);
    localStorage.setItem('compactMode', enabled);
    setCompactMode(enabled);
  };

  const applyTheme = (selectedTheme) => {
    document.documentElement.setAttribute('data-theme', selectedTheme);
    localStorage.setItem('theme', selectedTheme);
    setTheme(selectedTheme);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl text-accent font-bold">Customize Your View</h2>

      {/* Font Size Selector */}
      <div className="form-control space-y-2">
        <label className="label font-semibold pr-3">Font Size</label>
        <select
          className="select select-bordered"
          value={fontSize}
          onChange={(e) => applyFontSize(e.target.value)}
        >
          {Object.entries(fontSizes).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Theme Selector */}
      <div className="form-control space-y-2">
        <label className="label font-semibold pr-3">Theme</label>
        <select
          className="select select-bordered"
          value={theme}
          onChange={(e) => applyTheme(e.target.value)}
        >
          {Object.entries(themes).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Compact Mode Toggle */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text font-semibold pr-2">Compact Mode</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={compactMode}
            onChange={() => applyCompactMode(!compactMode)}
          />
        </label>
        <p className="text-sm text-gray-500">
          Reduces spacing in table cells and card padding.
        </p>
      </div>
    </div>
  );
}
