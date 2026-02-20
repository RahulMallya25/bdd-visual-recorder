import { create } from 'zustand';
import { Socket } from 'socket.io-client';

interface Action {
  type: string;
  selector?: string;
  value?: string;
  url?: string;
}

interface Step {
  keyword: string;
  text: string;
  actions: Action[];
  isRecording: boolean;
}

interface ScenarioState {
  projectName: string;
  scenarioName: string;
  url: string;
  steps: Step[];
  browserLaunched: boolean;
  socket: Socket | null;
  setProjectName: (name: string) => void;
  setScenarioName: (name: string) => void;
  setUrl: (url: string) => void;
  addStep: () => void;
  updateStep: (index: number, field: string, value: any) => void;
  deleteStep: (index: number) => void;
  setStepRecording: (index: number, isRecording: boolean) => void;
  updateStepActions: (index: number, actions: Action[]) => void;
  setBrowserLaunched: (launched: boolean) => void;
  setSocket: (socket: Socket | null) => void;
}

export const useStore = create<ScenarioState>((set) => ({
  projectName: '',
  scenarioName: '',
  url: '',
  steps: [
    { keyword: 'Given', text: '', actions: [], isRecording: false }
  ],
  browserLaunched: false,
  socket: null,

  setProjectName: (name) => set({ projectName: name }),
  setScenarioName: (name) => set({ scenarioName: name }),
  setUrl: (url) => set({ url }),
  
  addStep: () => set((state) => ({
    steps: [...state.steps, { keyword: 'And', text: '', actions: [], isRecording: false }]
  })),

  updateStep: (index, field, value) => set((state) => ({
    steps: state.steps.map((step, i) => 
      i === index ? { ...step, [field]: value } : step
    )
  })),

  deleteStep: (index) => set((state) => ({
    steps: state.steps.filter((_, i) => i !== index)
  })),

  setStepRecording: (index, isRecording) => set((state) => ({
    steps: state.steps.map((step, i) => 
      i === index ? { ...step, isRecording } : step
    )
  })),

  updateStepActions: (index, actions) => set((state) => ({
    steps: state.steps.map((step, i) => 
      i === index ? { ...step, actions } : step
    )
  })),

  setBrowserLaunched: (launched) => set({ browserLaunched: launched }),
  
  setSocket: (socket) => set({ socket })
}));
