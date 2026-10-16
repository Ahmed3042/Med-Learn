import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/courses', icon: '📚', label: 'My Courses' },
  { to: '/progress', icon: '📈', label: 'Progress' },
  { to: '/bookmarks', icon: '🔖', label: 'Bookmarks' },
  { to: '/notes', icon: '✏️', label: 'Notes' },
];

const BOTTOM_ITEMS = [
  { to: '/profile', icon: '👤', label: 'Profile' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const initials = user?.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? '?';

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`} aria-label="Main navigation">
      {/* Logo / Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__logo" aria-hidden="true">
          <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
            <rect width="28" height="28" rx="8" fill="#4a90e2" />
            <path d="M14 6v16M6 14h16" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        {!collapsed && (
          <div className="sidebar__brand-text">
            <span className="sidebar__brand-name">Med-Learn</span>
            <span className="sidebar__brand-subtitle">Medical Education</span>
          </div>
        )}
        <button
          className="sidebar__toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            {collapsed
              ? <path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              : <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            }
          </svg>
        </button>
      </div>

      {/* Main Nav */}
      <nav className="sidebar__nav" aria-label="Primary navigation">
        <ul role="list">
          {NAV_ITEMS.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <span className="sidebar__link-icon" aria-hidden="true">{item.icon}</span>
                {!collapsed && <span className="sidebar__link-label">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__spacer" />

      {/* Bottom Nav */}
      <nav className="sidebar__bottom" aria-label="Secondary navigation">
        <ul role="list">
          {BOTTOM_ITEMS.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <span className="sidebar__link-icon" aria-hidden="true">{item.icon}</span>
                {!collapsed && <span className="sidebar__link-label">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* User section */}
        <div className="sidebar__user">
          <div className="sidebar__avatar" aria-hidden="true">{initials}</div>
          {!collapsed && (
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{user?.name}</span>
              <span className="sidebar__user-role">{user?.year}</span>
            </div>
          )}
          {!collapsed && (
            <button
              className="sidebar__logout"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
            >
              <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                <path d="M11 5l3 3-3 3M14 8H6M8 3H4a1 1 0 00-1 1v8a1 1 0 001 1h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
}
