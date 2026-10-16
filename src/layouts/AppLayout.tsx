import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { StorageService } from '../services/StorageService';
import './AppLayout.css';

const SIDEBAR_COLLAPSED_KEY = 'ui:sidebar:collapsed';

export function AppLayout() {
  // Restore desktop sidebar collapsed state
  const [collapsed, setCollapsed] = useState<boolean>(
    () => StorageService.get<boolean>(SIDEBAR_COLLAPSED_KEY) ?? false
  );
  // Mobile: whether the drawer is open
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleSidebar() {
    setCollapsed(prev => {
      const next = !prev;
      StorageService.set(SIDEBAR_COLLAPSED_KEY, next);
      return next;
    });
  }

  const closeMobileMenu = useCallback(() => setMobileOpen(false), []);

  // Close drawer and navigate — passed through context isn't needed; NavLink
  // clicks already close the drawer via the overlay or we can add a handler.
  function handleNavClick() {
    setMobileOpen(false);
  }

  return (
    <div
      className="app-layout"
      data-sidebar-collapsed={collapsed}
      data-mobile-open={mobileOpen}
    >
      {/* Mobile top bar with hamburger */}
      <header className="app-topbar">
        <button
          className="app-menu-btn"
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="app-sidebar"
        >
          {/* Animated hamburger → ✕ */}
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true">
            {mobileOpen ? (
              <path fillRule="evenodd" clipRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            ) : (
              <path fillRule="evenodd" clipRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              />
            )}
          </svg>
        </button>
        <span className="app-topbar__brand">Med-Learn</span>
      </header>

      {/* Scrim overlay — clicking closes the drawer */}
      <div
        className="app-sidebar-overlay"
        aria-hidden="true"
        onClick={closeMobileMenu}
      />

      <Sidebar
        id="app-sidebar"
        collapsed={collapsed}
        onToggle={toggleSidebar}
        onNavClick={handleNavClick}
      />

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
