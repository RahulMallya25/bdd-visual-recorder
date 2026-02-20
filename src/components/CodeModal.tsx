import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import Editor from '@monaco-editor/react';
import { useStore } from '../store/useStore';
import './CodeModal.css';

interface CodeModalProps {
  stepIndex: number;
  onClose: () => void;
  socket: Socket;
}

function CodeModal({ onClose, socket }: CodeModalProps) {
  const [activeTab, setActiveTab] = useState('gherkin');
  const [code, setCode] = useState({ gherkin: '', pageObject: '', stepDefinitions: '', playwrightCode: '' });
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  useEffect(() => {
    const state = useStore.getState();
    const scenarioData = {
      projectName: state.projectName,
      scenarioName: state.scenarioName,
      url: state.url,
      steps: state.steps
    };
    
    console.log('Generating code for scenario:', scenarioData);
    socket.emit('generate-code', { scenario: scenarioData });
    
    const handleCodeGenerated = (generatedCode: any) => {
      console.log('Code generated:', generatedCode);
      setCode(generatedCode);
    };
    
    socket.on('code-generated', handleCodeGenerated);

    return () => {
      socket.off('code-generated', handleCodeGenerated);
    };
  }, [socket]);

  const tabs = [
    { id: 'gherkin', label: 'Gherkin', language: 'gherkin' },
    { id: 'pageObject', label: 'Page Object', language: 'javascript' },
    { id: 'stepDefinitions', label: 'Step Definitions', language: 'javascript' },
    { id: 'playwrightCode', label: 'Raw Playwright', language: 'javascript' }
  ];

  const handleCopy = async (tabId: string) => {
    const textToCopy = code[tabId as keyof typeof code];
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedTab(tabId);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Generated Code</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="tabs">
          {tabs.map(tab => (
            <div key={tab.id} className="tab-wrapper">
              <button
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
              <button
                className={`copy-btn ${copiedTab === tab.id ? 'copied' : ''}`}
                onClick={() => handleCopy(tab.id)}
                title="Copy to clipboard"
              >
                {copiedTab === tab.id ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3 11V3C3 2.44772 3.44772 2 4 2H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="code-container">
          <Editor
            height="500px"
            language={tabs.find(t => t.id === activeTab)?.language}
            value={code[activeTab as keyof typeof code]}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CodeModal;
