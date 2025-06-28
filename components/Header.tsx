import React from 'react';
import { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

const NAV_LINKS = [
  { label: 'Crucible', href: '#conceptual-crucible' },
  { label: 'Sparks', href: '#sparks-muses' },
  { label: 'Lyrics', href: '#lyrical-workbench' },
  { label: 'Hooks', href: '#hook-lab' },
  { label: 'Music', href: '#musical-toolkit' },
  { label: 'Structure', href: '#song-structure-suggester' },
  { label: 'AI Draft', href: '#ai-draft-generator' },
  { label: 'Lessons', href: '#lessons-from-legends' },
  { label: 'Canvas', href: '#song-canvas-section' },
];

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="header flex flex-col sm:flex-row items-center justify-between">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="logo"> 
          SongForge
        </div>
        <div className="sm:hidden"> {/* Mobile controls - keep theme toggle visible */}
          <button
            onClick={onToggleTheme}
            className="theme-toggle" 
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
      
      <nav className="header-nav mt-2 sm:mt-0">
        <ul className="flex flex-wrap justify-center sm:justify-start gap-x-3 gap-y-1">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <a href={link.href} className="nav-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hidden sm:flex items-center space-x-2 md:space-x-3">
        <button
          onClick={onToggleTheme}
          className="theme-toggle" 
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? '☀️' : '🌙'}
        </button>
        <div 
          className="user-avatar flex items-center justify-center font-bold text-sm cursor-pointer"
          title="User (SF)"
        >
          SF
        </div>
      </div>
    </header>
  );
};

export default Header;
