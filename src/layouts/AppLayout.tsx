import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { StorageService } from '../services/StorageService';
import './AppLayout.css';

const SIDEBAR_COLLAPSED_KEY = 'ui:sidebar:collapsed';

export function AppLayout() {
  // Restore sidebar state from localStorage via StorageService (namespaced)
  const [collapsed, setCollapsed] = useState<boolean>(
    () => StorageService.get<boolean>(SIDEBAR_COLLAPSED_KEY) ?? false
  );

  function toggleSidebar() {
    setCollapsed(prev => {
      const next = !prev;
      StorageService.set(SIDEBAR_COLLAPSED_KEY, next);
      return next;
    });
  }

  return (
    <div className="app-layout" data-sidebar-collapsed={collapsed}>
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
