export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'input' | 'observe';
  nextCondition?: 'automatic' | 'user-action' | 'manual';
  delay?: number;
  highlight?: boolean;
  modal?: boolean;
}

export interface TutorialFlow {
  id: string;
  name: string;
  description: string;
  category: 'garden' | 'studio' | 'inventory' | 'tasks' | 'general';
  steps: TutorialStep[];
  prerequisites?: string[];
  icon?: string;
  estimatedTime?: number;
}

export interface TutorialProgress {
  flowId: string;
  currentStep: number;
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
  skipped?: boolean;
}

export interface TutorialContextState {
  activeFlow: TutorialFlow | null;
  currentStep: number;
  isActive: boolean;
  canSkip: boolean;
  progress: TutorialProgress[];
  availableFlows: TutorialFlow[];
}