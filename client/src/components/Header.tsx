import React from 'react';
import { Layers, Plus, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onOpenModal: () => void;
  pendingCount?: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  accent: 'cyan' | 'emerald' | 'rose' | 'amber';
  onChangeAccent: (accent: 'cyan' | 'emerald' | 'rose' | 'amber') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenModal,
  pendingCount = 0,
  theme,
  onToggleTheme,
  accent,
  onChangeAccent,
}) => {
  return (
    <header className="app-header glass-card">
      <div className="logo-container">
        <div className="logo-icon-wrapper" aria-hidden="true">
          <Layers size={18} />
        </div>
        <div>
          <h1 className="logo-title">TaskPulse</h1>
          <div className="logo-subtitle">
            {pendingCount === 0 ? 'All tasks completed' : `${pendingCount} active task${pendingCount === 1 ? '' : 's'} remaining`}
          </div>
        </div>
      </div>

      <div className="theme-controls">
        {/* Accent Color Palette Selector */}
        <div className="accent-capsule" role="group" aria-label="Accent color presets">
          <button
            type="button"
            className={`accent-pill ${accent === 'cyan' ? 'active' : ''}`}
            style={{ background: '#0284c7' }}
            onClick={() => onChangeAccent('cyan')}
            title="Cerulean accent"
            aria-label="Cerulean accent"
          />
          <button
            type="button"
            className={`accent-pill ${accent === 'emerald' ? 'active' : ''}`}
            style={{ background: '#059669' }}
            onClick={() => onChangeAccent('emerald')}
            title="Emerald accent"
            aria-label="Emerald accent"
          />
          <button
            type="button"
            className={`accent-pill ${accent === 'rose' ? 'active' : ''}`}
            style={{ background: '#e11d48' }}
            onClick={() => onChangeAccent('rose')}
            title="Rose accent"
            aria-label="Rose accent"
          />
          <button
            type="button"
            className={`accent-pill ${accent === 'amber' ? 'active' : ''}`}
            style={{ background: '#d97706' }}
            onClick={() => onChangeAccent('amber')}
            title="Amber accent"
            aria-label="Amber accent"
          />
        </div>

        {/* Light / Dark Mode Toggle */}
        <button
          type="button"
          className="btn-icon-toggle"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* New Task Button */}
        <button
          id="btn-create-task"
          type="button"
          className="btn-primary header-action-btn"
          onClick={onOpenModal}
        >
          <Plus size={15} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
