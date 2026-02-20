import { Socket } from 'socket.io-client';
import { useStore } from '../store/useStore';
import './StepRow.css';

interface Step {
  keyword: string;
  text: string;
  actions: any[];
  isRecording: boolean;
}

interface StepRowProps {
  step: Step;
  index: number;
  socket: Socket;
  onViewCode: () => void;
}

const keywords = ['Given', 'When', 'Then', 'And'];

function StepRow({ step, index, socket, onViewCode }: StepRowProps) {
  const { updateStep, deleteStep, setStepRecording, browserLaunched } = useStore();

  const handleStartRecording = () => {
    console.log('Starting recording for step:', index);
    setStepRecording(index, true);
    socket.emit('start-recording', { stepIndex: index });
  };

  const handleStopRecording = () => {
    console.log('Stopping recording for step:', index);
    setStepRecording(index, false);
    socket.emit('stop-recording', { stepIndex: index });
  };

  return (
    <div className={`step-row ${step.isRecording ? 'recording' : ''}`}>
      <select
        value={step.keyword}
        onChange={(e) => updateStep(index, 'keyword', e.target.value)}
        className="keyword-select"
      >
        {keywords.map(kw => (
          <option key={kw} value={kw}>{kw}</option>
        ))}
      </select>

      <input
        type="text"
        value={step.text}
        onChange={(e) => updateStep(index, 'text', e.target.value)}
        placeholder="Enter step description..."
        className="step-input"
      />

      <button
        onClick={step.isRecording ? handleStopRecording : handleStartRecording}
        className={`btn-record ${step.isRecording ? 'recording' : ''}`}
        disabled={!browserLaunched}
        title={!browserLaunched ? 'Launch browser first' : step.isRecording ? 'Stop recording' : 'Start recording'}
      >
        {step.isRecording ? '⏹ Stop Recording' : '⏺ Record'}
      </button>

      <button
        onClick={onViewCode}
        className="btn-view"
        disabled={!step.actions || step.actions.length === 0}
        title={!step.actions || step.actions.length === 0 ? 'Record some actions first' : 'View generated code'}
      >
        👁 View {step.actions && step.actions.length > 0 && `(${step.actions.length})`}
      </button>

      <button
        onClick={() => deleteStep(index)}
        className="btn-delete"
      >
        🗑
      </button>
    </div>
  );
}

export default StepRow;
