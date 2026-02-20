import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Header from './components/Header';
import BrowserPanel from './components/BrowserPanel';
import StepBuilder from './components/StepBuilder';
import { useStore } from './store/useStore';
import './App.css';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isRemote, setIsRemote] = useState(false);
  const { setBrowserLaunched, updateStepActions, setSocket: setStoreSocket } = useStore();

  useEffect(() => {
    // Detect if we're running through a tunnel or on a different host
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    setIsRemote(!isLocalhost);
    
    // Use environment variable for backend URL, fallback to localhost
    // If VITE_BACKEND_URL is not set, default to localhost (for local dev and initial build)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    
    console.log('Attempting to connect to backend:', backendUrl);
    console.log('Running in', isLocalhost ? 'LOCAL' : 'REMOTE', 'mode');
    
    const newSocket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      timeout: 5000,
      reconnectionAttempts: 3
    });

    let connectionTimeout: NodeJS.Timeout | undefined;

    newSocket.on('connect', () => {
      console.log('Connected to backend');
      if (connectionTimeout) clearTimeout(connectionTimeout);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Backend connection error:', error);
      if (!isLocalhost) {
        console.warn('Running in remote mode - backend features disabled');
        // Don't show error for remote users, just log it
      }
    });

    newSocket.on('browser-launched', ({ success }) => {
      console.log('Browser launched:', success);
      setBrowserLaunched(success);
      if (success) {
        alert('Browser launched successfully!');
      }
    });

    newSocket.on('action-captured', ({ stepIndex, actions }) => {
      console.log('Actions captured for step', stepIndex, ':', actions);
      updateStepActions(stepIndex, actions);
    });

    newSocket.on('recording-started', ({ stepIndex }) => {
      console.log('Recording started for step:', stepIndex);
    });

    newSocket.on('recording-stopped', ({ stepIndex, actions }) => {
      console.log('Recording stopped for step', stepIndex, ':', actions);
      updateStepActions(stepIndex, actions);
    });

    newSocket.on('recording-error', ({ error }) => {
      console.error('Recording error:', error);
      alert('Recording error: ' + error);
    });

    newSocket.on('code-generated', (code) => {
      console.log('Code generated:', code);
    });

    newSocket.on('framework-exported', ({ success, path, error }) => {
      if (success) {
        alert(`Framework exported successfully to: ${path}`);
      } else {
        alert(`Export failed: ${error}`);
      }
    });

    setSocket(newSocket);
    setStoreSocket(newSocket);

    return () => {
      if (connectionTimeout) clearTimeout(connectionTimeout);
      newSocket.disconnect();
    };
  }, [setBrowserLaunched, updateStepActions, setStoreSocket]);

  // Show loading state
  if (!socket) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ fontSize: '2rem' }}>🔄</div>
        <div>Connecting to server...</div>
      </div>
    );
  }

  return (
    <div className="app">
      {isRemote && (
        <div style={{
          background: 'linear-gradient(90deg, #ff9800, #ff5722)',
          color: 'white',
          padding: '0.75rem 1.5rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          fontWeight: '500',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          ⚠️ Viewing in Demo Mode - Backend features are disabled. 
          For full functionality, see <a href="https://github.com/your-repo" style={{ color: 'white', textDecoration: 'underline' }}>setup instructions</a>.
        </div>
      )}
      <Header socket={socket} />
      <div className="main-layout">
        <BrowserPanel />
        <StepBuilder socket={socket} />
      </div>
    </div>
  );
}

export default App;
