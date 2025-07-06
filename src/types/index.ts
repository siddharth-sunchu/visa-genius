export interface User {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
  profile?: UserProfile;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  title: string;
  institution: string;
  field: string;
  bio: string;
  achievements: string[];
  publications: Publication[];
  awards: Award[];
  memberships: Membership[];
}

export interface Publication {
  id: string;
  title: string;
  journal: string;
  year: number;
  authors: string[];
  doi?: string;
  impact: 'high' | 'medium' | 'low';
}

export interface Award {
  id: string;
  name: string;
  organization: string;
  year: number;
  description: string;
  significance: string;
}

export interface Membership {
  id: string;
  organization: string;
  role: string;
  yearJoined: number;
  description: string;
}

export interface EB1ACriteria {
  id: string;
  category: string;
  title: string;
  description: string;
  isCompleted: boolean;
  evidence: string[];
  documents: string[];
}

export interface Referee {
  id: string;
  name: string;
  title: string;
  institution: string;
  email: string;
  relationship: string;
  expertise: string;
  achievements: string[];
}

export interface RecommendationLetter {
  id: string;
  refereeId: string;
  referee: Referee;
  content: string;
  status: 'draft' | 'generated' | 'reviewed' | 'approved';
  generatedAt: Date;
  reviewedAt?: Date;
  reviewerNotes?: string;
}

export interface ApplicationStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  order: number;
}

export interface ApplicationProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
  steps: ApplicationStep[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 