import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/StorageService';
import './SettingsPage.css';

const THEME_KEY = 'settings:theme';
const FONT_SIZE_KEY = 'settings:fontSize';

type Theme = 'light' | 'dark' | 'system';
type FontSize = 'small' | 'normal' | 'large';

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

function applyFontSize(size: FontSize) {
  const map: Record<FontSize, string> = { small: '14px', normal: '16px', large: '18px' };
  document.documentElement.style.fontSize = map[size];
}

export function SettingsPage() {
  const [theme, setTheme] = useState<Theme>(() => StorageService.get<Theme>(THEME_KEY) ?? 'light');
  const [fontSize, setFontSize] = useState<FontSize>(() => StorageService.get<FontSize>(FONT_SIZE_KEY) ?? 'normal');
  // Two-step clear confirmation — avoids window.confirm() which is unreliable in Tauri/WebView2
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    applyTheme(theme);
    StorageService.set(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    applyFontSize(fontSize);
    StorageService.set(FONT_SIZE_KEY, fontSize);
  }, [fontSize]);

  const handleClearData = useCallback(() => {
    if (!confirmClear) {
      setConfirmClear(true);
      // Auto-cancel after 4 seconds if the user doesn't confirm
      setTimeout(() => setConfirmClear(false), 4000);
      return;
    }
    StorageService.clear();
    window.location.reload();
  }, [confirmClear]);

  return (
    <div className="settings-page animate-fade-in">
      <div className="page-header">
        <h1>Settings</h1>
        <p className="page-header__subtitle">Customize your Med-Learn experience</p>
      </div>

      <div className="page-content">
        {/* Appearance */}
        <div className="card settings-section">
          <h2 className="settings-section__title">Appearance</h2>

          <div className="settings-row">
            <div className="settings-row__label">
              <span>Theme</span>
              <p>Choose between light, dark, or system-matched theme</p>
            </div>
            <div className="settings-row__control">
              <div className="theme-picker" role="group" aria-label="Select theme">
                {(['light', 'dark', 'system'] as Theme[]).map(t => (
                  <button
                    key={t}
                    className={`theme-picker__btn ${theme === t ? 'theme-picker__btn--active' : ''}`}
                    onClick={() => setTheme(t)}
                    aria-pressed={theme === t}
                  >
                    <span>{t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '🖥'}</span>
                    <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row__label">
              <span>Text Size</span>
              <p>Adjust the base font size for readability</p>
            </div>
            <div className="settings-row__control">
              <div className="font-size-picker" role="group" aria-label="Select font size">
                {(['small', 'normal', 'large'] as FontSize[]).map(s => (
                  <button
                    key={s}
                    className={`font-size-picker__btn ${fontSize === s ? 'font-size-picker__btn--active' : ''}`}
                    onClick={() => setFontSize(s)}
                    aria-pressed={fontSize === s}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card settings-section">
          <h2 className="settings-section__title">About</h2>
          {[
            { label: 'Application', value: 'Med-Learn Desktop' },
            { label: 'Version', value: '0.1.0 (V1 Demo)' },
            { label: 'Platform', value: 'Tauri 2 + React + TypeScript' },
            { label: 'Data storage', value: 'Local (localStorage) — V1 demo' },
            { label: 'Backend status', value: 'Supabase / Cloudflare — not yet integrated' },
          ].map(row => (
            <div key={row.label} className="settings-info-row">
              <span className="settings-info-row__label">{row.label}</span>
              <span className="settings-info-row__value">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Danger Zone */}
        <div className="card settings-section settings-section--danger">
          <h2 className="settings-section__title">Data</h2>
          <div className="settings-row">
            <div className="settings-row__label">
              <span>Clear Local Data</span>
              <p>Remove all progress, bookmarks, and notes stored locally. This is irreversible.</p>
            </div>
            <div className="settings-row__control">
              {confirmClear ? (
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-danger)' }}>Are you sure? This cannot be undone.</span>
                  <button
                    className="btn btn--sm"
                    onClick={handleClearData}
                    style={{ background: 'var(--color-danger)', color: 'white', borderColor: 'var(--color-danger)' }}
                  >
                    Yes, clear everything
                  </button>
                  <button className="btn btn--ghost btn--sm" onClick={() => setConfirmClear(false)}>Cancel</button>
                </div>
              ) : (
                <button
                  className="btn btn--secondary"
                  onClick={handleClearData}
                  style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger-subtle)' }}
                >
                  🗑 Clear All Data
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Future sections placeholder */}
        <div className="card settings-section settings-section--future">
          <h2 className="settings-section__title">Coming in future versions</h2>
          {[
            '🔐 Account security settings',
            '📧 Email notification preferences',
            '🌐 Language and locale',
            '🔔 Study reminders',
            '📱 Mobile app download',
            '🎓 Certificate and achievement settings',
          ].map(item => (
            <div key={item} className="settings-future-item">{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
