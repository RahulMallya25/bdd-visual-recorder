import { Socket } from 'socket.io-client';
import { useStore } from '../store/useStore';
import './Header.css';

interface HeaderProps {
  socket: Socket;
}

function Header({ socket }: HeaderProps) {
  const { 
    projectName, 
    scenarioName, 
    url, 
    browserLaunched,
    setProjectName, 
    setScenarioName, 
    setUrl 
  } = useStore();

  const handleLaunch = () => {
    if (url) {
      console.log('Launching browser with URL:', url);
      socket.emit('launch-browser', { url });
    } else {
      alert('Please enter a URL first');
    }
  };

  const handleSave = () => {
    const state = useStore.getState();
    const scenario = {
      projectName: state.projectName,
      scenarioName: state.scenarioName,
      url: state.url,
      steps: state.steps
    };
    localStorage.setItem('scenario', JSON.stringify(scenario));
    alert('Scenario saved to browser storage!');
  };

  const handleExport = () => {
    const state = useStore.getState();
    const scenario = {
      projectName: state.projectName,
      scenarioName: state.scenarioName,
      url: state.url,
      steps: state.steps
    };
    console.log('Exporting scenario:', scenario);
    socket.emit('export-framework', { scenario });
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-inputs">
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="header-input"
          />
          <input
            type="text"
            placeholder="Scenario Name"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            className="header-input"
          />
          <input
            type="url"
            placeholder="Enter URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="header-input url-input"
          />
        </div>
        <div className="header-actions">
          <button 
            onClick={handleLaunch} 
            className="btn btn-primary"
            disabled={!url}
          >
            {browserLaunched ? '🔄 Relaunch' : '🚀 Launch'}
          </button>
          <button onClick={handleSave} className="btn btn-secondary">
            💾 Save
          </button>
          <button onClick={handleExport} className="btn btn-success">
            📦 Export
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
