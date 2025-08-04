export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  showSkip?: boolean;
}

export interface TourState {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
}