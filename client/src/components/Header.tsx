import React from 'react';
import { CheckSquare, Plus, Sun, Moon } from 'lucide-react';

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
        <div className="logo-icon-wrapper">
          <CheckSquare size={26} />
        </div>
        <div>
          <div className="logo-title">TaskPulse</div>
          <div className="logo-subtitle">
            {pendingCount === 0 ? '✨ All tasks completed!' : `⚡ ${pendingCount} pending task${pendingCount > 1 ? 's' : ''}`}
          </div>
        </div>
      </div>

      <div className="theme-controls">
        {/* Accent Color Palette Selector */}
        <div style={{ display: 'flex', gap: '6px', marginRight: '10px' }}>
          <div
            className={`accent-pill ${accent === 'cyan' ? 'active' : ''}`}
            style={{ background: '#06b6d4' }}
            onClick={() => onChangeAccent('cyan')}
            title="Cyber Cyan Theme"
          />
          <div
            className={`accent-pill ${accent === 'emerald' ? 'active' : ''}`}
            style={{ background: '#10b981' }}
            onClick={() => onChangeAccent('emerald')}
            title="Emerald Theme"
          />
          <div
            className={`accent-pill ${accent === 'rose' ? 'active' : ''}`}
            style={{ background: '#f43f5e' }}
            onClick={() => onChangeAccent('rose')}
            title="Rose Theme"
          />
          <div
            className={`accent-pill ${accent === 'amber' ? 'active' : ''}`}
            style={{ background: '#f59e0b' }}
            onClick={() => onChangeAccent('amber')}
            title="Amber Theme"
          />
        </div>

        {/* Light / Dark Mode Toggle */}
        <button
          className="btn-icon-toggle"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* New Task Button */}
        <button
          id="btn-create-task"
          className="btn-primary"
          onClick={onOpenModal}
        >
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
