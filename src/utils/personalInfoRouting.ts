import { PersonalInfoProgress } from '../services/personalInfo';

export interface StepInfo {
  step: string;
  title: string;
  description: string;
  route: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export const PERSONAL_INFO_STEPS = [
  {
    key: 'basic_info',
    title: 'Basic Information',
    description: 'Personal details and identification',
    route: '/personal-info/basic'
  },
  {
    key: 'current_status',
    title: 'Immigration Status',
    description: 'Current visa and immigration status',
    route: '/personal-info/status'
  },
  {
    key: 'current_address',
    title: 'Current Address',
    description: 'Where you currently live',
    route: '/personal-info/address'
  },
  {
    key: 'family_life',
    title: 'Family Life',
    description: 'Marital status and family information',
    route: '/personal-info/family'
  },
  {
    key: 'spouse_info',
    title: 'Spouse Information',
    description: 'Details about your spouse (if married)',
    route: '/personal-info/spouse'
  },
  {
    key: 'children_info',
    title: 'Children Information',
    description: 'Details about your children',
    route: '/personal-info/children'
  },
  {
    key: 'immigration_history',
    title: 'Immigration History',
    description: 'Previous visas and immigration history',
    route: '/personal-info/immigration-history'
  },
  {
    key: 'past_us_visits',
    title: 'Past US Visits',
    description: 'Previous visits to the United States',
    route: '/personal-info/past-visits'
  },
  {
    key: 'occupation',
    title: 'Current Occupation',
    description: 'Current job and employer information',
    route: '/personal-info/occupation'
  },
  {
    key: 'employment_history',
    title: 'Employment History',
    description: 'Previous work experience',
    route: '/personal-info/employment-history'
  }
];

export class PersonalInfoRouter {
  static getCurrentStep(progress: PersonalInfoProgress | null): string {
    if (!progress) return 'basic_info';
    return progress.currentStep;
  }

  static getNextStep(currentStep: string): string | null {
    const currentIndex = PERSONAL_INFO_STEPS.findIndex(step => step.key === currentStep);
    if (currentIndex === -1 || currentIndex === PERSONAL_INFO_STEPS.length - 1) {
      return null; // No next step or invalid current step
    }
    return PERSONAL_INFO_STEPS[currentIndex + 1].key;
  }

  static getPreviousStep(currentStep: string): string | null {
    const currentIndex = PERSONAL_INFO_STEPS.findIndex(step => step.key === currentStep);
    if (currentIndex <= 0) {
      return null; // No previous step or invalid current step
    }
    return PERSONAL_INFO_STEPS[currentIndex - 1].key;
  }

  static getStepInfo(progress: PersonalInfoProgress | null): StepInfo[] {
    const currentStep = this.getCurrentStep(progress);
    const completedSections = progress?.completedSections || [];

    return PERSONAL_INFO_STEPS.map(step => ({
      step: step.key,
      title: step.title,
      description: step.description,
      route: step.route,
      isCompleted: completedSections.includes(step.key),
      isCurrent: step.key === currentStep
    }));
  }

  static getCompletionPercentage(progress: PersonalInfoProgress | null): number {
    if (!progress) return 0;
    return Math.round((progress.completedSteps / progress.totalSteps) * 100);
  }

  static getRouteForStep(step: string): string {
    const stepInfo = PERSONAL_INFO_STEPS.find(s => s.key === step);
    return stepInfo?.route || '/personal-info';
  }

  static shouldRedirectToCurrentStep(
    currentRoute: string, 
    progress: PersonalInfoProgress | null
  ): { shouldRedirect: boolean; redirectTo?: string } {
    if (!progress) {
      return { shouldRedirect: false };
    }

    const currentStep = this.getCurrentStep(progress);
    const expectedRoute = this.getRouteForStep(currentStep);

    // If user is on a different route than their current step, redirect them
    if (currentRoute !== expectedRoute && currentStep !== 'completed') {
      return {
        shouldRedirect: true,
        redirectTo: expectedRoute
      };
    }

    return { shouldRedirect: false };
  }

  static isStepAccessible(step: string, progress: PersonalInfoProgress | null): boolean {
    if (!progress) return step === 'basic_info'; // Only basic info accessible if no progress

    const stepIndex = PERSONAL_INFO_STEPS.findIndex(s => s.key === step);
    const currentStepIndex = PERSONAL_INFO_STEPS.findIndex(s => s.key === progress.currentStep);

    // Step is accessible if:
    // 1. It's completed
    // 2. It's the current step
    // 3. It's before the current step (allow going back)
    return (
      progress.completedSections.includes(step) ||
      step === progress.currentStep ||
      stepIndex <= currentStepIndex
    );
  }

  static getNextIncompleteStep(progress: PersonalInfoProgress | null): string | null {
    if (!progress) return 'basic_info';
    
    if (progress.currentStep === 'completed') return null;
    
    return progress.currentStep;
  }
}

export default PersonalInfoRouter;