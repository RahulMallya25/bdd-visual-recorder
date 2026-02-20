import { useStore } from '../store/useStore';
import { useEffect, useRef, useState } from 'react';
import './BrowserPanel.css';

function BrowserPanel() {
  const { browserLaunched, socket } = useStore();
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isFocused, setIsFocused] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    const handleScreenshot = ({ screenshot }: { screenshot: string }) => {
      setScreenshot(screenshot);
    };

    socket.on('browser-screenshot', handleScreenshot);

    return () => {
      socket.off('browser-screenshot', handleScreenshot);
    };
  }, [socket]);

  useEffect(() => {
    if (screenshot && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        setCanvasSize({ width: img.width, height: img.height });
        ctx.drawImage(img, 0, 0);
        
        // Don't auto-focus - let user click to focus
      };
      img.src = screenshot;
    }
  }, [screenshot]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!socket || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate actual coordinates in the browser viewport
    const scaleX = canvasSize.width / rect.width;
    const scaleY = canvasSize.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    socket.emit('browser-click', { x, y });
    
    // Focus canvas only when user clicks on it
    canvas.focus();
    setIsFocused(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (!socket) return;
    
    e.preventDefault();
    
    // Handle special keys
    if (e.key.length === 1) {
      // Regular character
      socket.emit('browser-input', { text: e.key });
    } else {
      // Special keys like Enter, Tab, Backspace, etc.
      socket.emit('browser-keypress', { key: e.key });
    }
  };

  const handleCanvasBlur = () => {
    // Canvas lost focus - user can now interact with other UI elements
    setIsFocused(false);
  };

  return (
    <div className="browser-panel">
      <div className="panel-header">
        <h3>Browser Preview</h3>
        <div className="header-right">
          {isFocused && (
            <span className="focus-indicator">⌨️ Keyboard Active</span>
          )}
          <span className={`status ${browserLaunched ? 'active' : ''}`}>
            {browserLaunched ? '● Live' : '○ Not Connected'}
          </span>
        </div>
      </div>
      <div className="browser-content" ref={containerRef}>
        {!browserLaunched ? (
          <div className="empty-state">
            <div className="empty-icon">🌐</div>
            <p>Enter a URL and click Launch to start</p>
          </div>
        ) : (
          <div className="browser-frame">
            <div className="browser-viewport">
              <canvas 
                ref={canvasRef} 
                className="browser-canvas"
                onClick={handleCanvasClick}
                onKeyDown={handleKeyDown}
                onBlur={handleCanvasBlur}
                tabIndex={0}
                style={{ cursor: 'pointer' }}
              />
              {!screenshot && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                  <p>Loading browser...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowserPanel;
