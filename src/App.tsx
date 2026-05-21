import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

type TimerMode = 'focus' | 'break';
type TimerStatus = 'idle' | 'running' | 'paused';

interface Session {
  id: string;
  duration: number; // in seconds
  completedAt: Date;
  mode: TimerMode;
}

const App: React.FC = () => {
  // Timer configuration
  const [focusDuration, setFocusDuration] = useState<number>(25 * 60); // 25 minutes in seconds
  const [breakDuration, setBreakDuration] = useState<number>(5 * 60); // 5 minutes in seconds
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(focusDuration);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [sessions, setSessions] = useState<Session[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('pomodoroSessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      // Convert string dates back to Date objects
      const sessionsWithDates = parsedSessions.map((session: any) => ({
        ...session,
        completedAt: new Date(session.completedAt)
      }));
      setSessions(sessionsWithDates);
    }

    // Check if we need to reset for a new day
    checkAndResetForNewDay();
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pomodoroSessions', JSON.stringify(sessions));
  }, [sessions]);

  // Check if we need to reset sessions for a new day
  const checkAndResetForNewDay = () => {
    const lastResetDate = localStorage.getItem('pomodoroLastResetDate');
    const today = new Date().toDateString();
    
    if (lastResetDate !== today) {
      localStorage.setItem('pomodoroLastResetDate', today);
      setSessions([]);
    }
  };

  // Timer logic
  useEffect(() => {
    if (status === 'running' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completed
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, timeLeft, handleTimerComplete]);

  const handleTimerComplete = useCallback(() => {
    // Play sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }

    // Add session to history if it was a focus session
    if (mode === 'focus') {
      const newSession: Session = {
        id: Date.now().toString(),
        duration: focusDuration,
        completedAt: new Date(),
        mode: 'focus'
      };
      setSessions(prev => [newSession, ...prev]);
    }

    // Switch mode
    const nextMode = mode === 'focus' ? 'break' : 'focus';
    const nextDuration = nextMode === 'focus' ? focusDuration : breakDuration;
    
    setMode(nextMode);
    setTimeLeft(nextDuration);
    setStatus('idle');
  }, [mode, focusDuration, breakDuration]);

  const startTimer = () => {
    setStatus('running');
  };

  const pauseTimer = () => {
    setStatus('paused');
  };

  const resetTimer = () => {
    setStatus('idle');
    setTimeLeft(mode === 'focus' ? focusDuration : breakDuration);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFocusDurationChange = (minutes: number) => {
    const newDuration = minutes * 60;
    setFocusDuration(newDuration);
    if (mode === 'focus' && status === 'idle') {
      setTimeLeft(newDuration);
    }
  };

  const handleBreakDurationChange = (minutes: number) => {
    const newDuration = minutes * 60;
    setBreakDuration(newDuration);
    if (mode === 'break' && status === 'idle') {
      setTimeLeft(newDuration);
    }
  };

  // Filter sessions for today only
  const todaySessions = sessions.filter(session => {
    const sessionDate = new Date(session.completedAt).toDateString();
    const today = new Date().toDateString();
    return sessionDate === today;
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Pomodoro Timer</h1>
        <p className="app-subtitle">Focus. Break. Repeat.</p>
      </header>

      <main className="app-main">
        <div className="timer-container">
          <div className={`timer-display ${mode} ${status}`}>
            <div className="timer-mode">{mode === 'focus' ? 'Focus Time' : 'Break Time'}</div>
            <div className="timer-time">{formatTime(timeLeft)}</div>
            <div className="timer-progress">
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${((mode === 'focus' ? focusDuration : breakDuration) - timeLeft) / (mode === 'focus' ? focusDuration : breakDuration) * 100}%` 
                }}
              />
            </div>
            <div className="timer-status">
              {status === 'idle' && 'Ready to start'}
              {status === 'running' && 'Running...'}
              {status === 'paused' && 'Paused'}
            </div>
          </div>

          <div className="timer-controls">
            {status === 'running' ? (
              <button className="control-btn pause-btn" onClick={pauseTimer}>
                Pause
              </button>
            ) : (
              <button className="control-btn start-btn" onClick={startTimer}>
                Start
              </button>
            )}
            <button className="control-btn reset-btn" onClick={resetTimer}>
              Reset
            </button>
          </div>

          <div className="configuration">
            <div className="config-group">
              <label htmlFor="focus-duration">Focus Duration (minutes):</label>
              <div className="duration-controls">
                <button 
                  className="duration-btn"
                  onClick={() => handleFocusDurationChange(Math.max(1, focusDuration / 60 - 1))}
                  disabled={status === 'running'}
                >
                  -
                </button>
                <span className="duration-value">{focusDuration / 60}</span>
                <button 
                  className="duration-btn"
                  onClick={() => handleFocusDurationChange(focusDuration / 60 + 1)}
                  disabled={status === 'running'}
                >
                  +
                </button>
              </div>
            </div>

            <div className="config-group">
              <label htmlFor="break-duration">Break Duration (minutes):</label>
              <div className="duration-controls">
                <button 
                  className="duration-btn"
                  onClick={() => handleBreakDurationChange(Math.max(1, breakDuration / 60 - 1))}
                  disabled={status === 'running'}
                >
                  -
                </button>
                <span className="duration-value">{breakDuration / 60}</span>
                <button 
                  className="duration-btn"
                  onClick={() => handleBreakDurationChange(breakDuration / 60 + 1)}
                  disabled={status === 'running'}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="history-section">
          <h2 className="history-title">Today's Focus Sessions</h2>
          {todaySessions.length === 0 ? (
            <p className="no-sessions">No focus sessions completed today yet.</p>
          ) : (
            <ul className="sessions-list">
              {todaySessions.map(session => (
                <li key={session.id} className="session-item">
                  <span className="session-check">✓</span>
                  <span className="session-duration">{formatTime(session.duration)}</span>
                  <span className="session-mode">focus</span>
                  <span className="session-time">
                    — {new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="history-info">
            <p>Sessions are saved locally and reset daily at midnight.</p>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with React & TypeScript • Pomodoro Technique Timer</p>
      </footer>

      {/* Hidden audio element for timer completion sound */}
      <audio ref={audioRef} preload="auto">
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default App;