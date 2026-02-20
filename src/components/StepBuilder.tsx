import { useState } from 'react';
import { Socket } from 'socket.io-client';
import { useStore } from '../store/useStore';
import StepRow from './StepRow';
import CodeModal from './CodeModal';
import './StepBuilder.css';

interface StepBuilderProps {
  socket: Socket;
}

function StepBuilder({ socket }: StepBuilderProps) {
  const { steps, addStep } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);

  const handleViewCode = (index: number) => {
    setSelectedStepIndex(index);
    setShowModal(true);
  };

  return (
    <div className="step-builder">
      <div className="panel-header">
        <h3>Step Builder</h3>
        <button onClick={addStep} className="btn-add-step">
          + Add Step
        </button>
      </div>
      <div className="steps-container">
        {steps.map((step, index) => (
          <StepRow
            key={index}
            step={step}
            index={index}
            socket={socket}
            onViewCode={() => handleViewCode(index)}
          />
        ))}
      </div>
      {showModal && selectedStepIndex !== null && (
        <CodeModal
          stepIndex={selectedStepIndex}
          onClose={() => setShowModal(false)}
          socket={socket}
        />
      )}
    </div>
  );
}

export default StepBuilder;
