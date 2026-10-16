import { useState, useRef, useEffect, useCallback } from 'react';
import type { Lesson } from '../types';
import { ProgressService } from '../services/ProgressService';
import { VideoService, type VideoSource } from '../services/VideoService';
import './VideoPlayer.css';

// VideoPlayer — V1 simulated playback implementation.
// Obtains source metadata via VideoService and persists progress to ProgressService.

interface VideoPlayerProps {
  lesson: Lesson;
  userId: string;
  courseId: string;
}

const SAVE_INTERVAL_MS = 5000;
const SEEK_STEP_SMALL = 10;
const SEEK_STEP_LARGE = 30;

export function VideoPlayer({ lesson, userId, courseId }: VideoPlayerProps) {
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const [duration, setDuration] = useState<number>(() =>
    lesson.durationMinutes ? lesson.durationMinutes * 60 : 1800
  );
  const [simSeconds, setSimSeconds] = useState<number>(() =>
    ProgressService.getVideoProgress(userId, courseId, lesson.id)
  );
  const [playing, setPlaying] = useState(false);
  const seekbarRef = useRef<HTMLDivElement>(null);

  // Load video source via VideoService
  useEffect(() => {
    let cancelled = false;
    VideoService.getVideoSource(lesson.id, courseId)
      .then(src => {
        if (cancelled) return;
        setVideoSource(src);
        if (src.durationSeconds) {
          setDuration(src.durationSeconds);
        }
      })
      .catch(err => {
        console.error('[VideoPlayer] Failed to load video source:', err);
      });

    return () => {
      cancelled = true;
    };
  }, [lesson.id, courseId]);

  // Use a ref to keep the latest simSeconds accessible inside intervals
  const simSecondsRef = useRef(simSeconds);
  useEffect(() => {
    simSecondsRef.current = simSeconds;
  }, [simSeconds]);

  // Playback tick: increments simSeconds once per second while playing
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setSimSeconds(prev => {
        const next = Math.min(prev + 1, duration);
        if (next >= duration) {
          setPlaying(false);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, duration]);

  // Persist progress every 5 seconds
  useEffect(() => {
    const id = setInterval(() => {
      const secs = simSecondsRef.current;
      if (secs > 0) {
        ProgressService.saveVideoProgress(userId, courseId, lesson.id, secs);
      }
    }, SAVE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [userId, courseId, lesson.id]);

  // Save on unmount or lesson change
  useEffect(() => {
    return () => {
      const secs = simSecondsRef.current;
      if (secs > 0) {
        ProgressService.saveVideoProgress(userId, courseId, lesson.id, secs);
      }
    };
  }, [userId, courseId, lesson.id]);

  const togglePlay = useCallback(() => setPlaying(p => !p), []);

  const seekTo = useCallback((targetSeconds: number) => {
    const clamped = Math.max(0, Math.min(duration, Math.round(targetSeconds)));
    setSimSeconds(clamped);
    ProgressService.saveVideoProgress(userId, courseId, lesson.id, clamped);
  }, [duration, userId, courseId, lesson.id]);

  const handleSeekClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekbarRef.current) return;
    const rect = seekbarRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(pct * duration);
  }, [duration, seekTo]);

  const handleSeekKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        seekTo(simSeconds + SEEK_STEP_SMALL);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        seekTo(simSeconds - SEEK_STEP_SMALL);
        break;
      case 'Home':
        e.preventDefault();
        seekTo(0);
        break;
      case 'End':
        e.preventDefault();
        seekTo(duration);
        break;
      case 'PageUp':
        e.preventDefault();
        seekTo(simSeconds + SEEK_STEP_LARGE);
        break;
      case 'PageDown':
        e.preventDefault();
        seekTo(simSeconds - SEEK_STEP_LARGE);
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        togglePlay();
        break;
    }
  }, [simSeconds, duration, seekTo, togglePlay]);

  const pct = duration > 0 ? (simSeconds / duration) * 100 : 0;

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  return (
    <div className="video-player">
      {/* Simulated Screen */}
      <div
        className="video-player__screen"
        onClick={togglePlay}
        role="button"
        tabIndex={0}
        aria-label={playing ? 'Pause video' : 'Play video'}
        onKeyDown={e => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            togglePlay();
          }
        }}
      >
        <div className="video-player__placeholder">
          <div className="video-player__icon-wrap" aria-hidden="true">
            <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
              <circle cx="40" cy="40" r="40" fill="rgba(74,144,226,0.15)" />
              <circle cx="40" cy="40" r="28" fill="rgba(74,144,226,0.2)" />
              {playing ? (
                <>
                  <rect x="28" y="26" width="9" height="28" rx="3" fill="white" />
                  <rect x="43" y="26" width="9" height="28" rx="3" fill="white" />
                </>
              ) : (
                <path d="M33 26l24 14-24 14V26z" fill="white" />
              )}
            </svg>
          </div>
          <div className="video-player__label">
            <div className="video-player__title">{videoSource?.title ?? lesson.title}</div>
            <div className="video-player__note">
              {playing ? '▶ Playing (simulated playback)' : '⏸ Paused (simulated playback) — click to play'}
            </div>
            <div className="video-player__v1-note">
              Simulated video playback · Progress saved locally
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="video-player__controls">
        <button
          className="video-player__play-btn"
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <rect x="3" y="2" width="4" height="12" rx="1" />
              <rect x="9" y="2" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M3 2l12 6L3 14V2z" />
            </svg>
          )}
        </button>

        <div className="video-player__time">{formatTime(simSeconds)}</div>

        {/* Seek bar */}
        <div
          ref={seekbarRef}
          className="video-player__seekbar"
          onClick={handleSeekClick}
          onKeyDown={handleSeekKeyDown}
          role="slider"
          aria-label="Video seek bar"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={simSeconds}
          aria-valuetext={`${formatTime(simSeconds)} of ${formatTime(duration)}`}
          tabIndex={0}
        >
          <div className="video-player__seekbar-track">
            <div className="video-player__seekbar-fill" style={{ width: `${pct}%` }} />
            <div className="video-player__seekbar-thumb" style={{ left: `${pct}%` }} />
          </div>
        </div>

        <div className="video-player__time video-player__time--end">{formatTime(duration)}</div>
      </div>
    </div>
  );
}
