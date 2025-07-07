import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EB1ACriteria {
  id: string;
  name: string;
  description: string;
  isSelected: boolean;
  progress: number;
  sections: QuestionnaireSection[];
}

export interface QuestionnaireSection {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
  fields: QuestionnaireField[];
}

export interface QuestionnaireField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'file' | 'checkbox' | 'radio';
  required: boolean;
  value: any;
  options?: string[];
  validation?: string;
}

export interface ApplicationState {
  selectedCriteria: string[];
  currentPage: string;
  overallProgress: number;
  criteriaProgress: Record<string, number>;
  questionnaireData: Record<string, any>;
  subsectionProgress: Record<string, Record<string, boolean>>;
  isApplicationSubmitted: boolean;
}

const initialState: ApplicationState = {
  selectedCriteria: [],
  currentPage: 'dashboard',
  overallProgress: 0,
  criteriaProgress: {},
  questionnaireData: {},
  subsectionProgress: {},
  isApplicationSubmitted: false,
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    selectCriteria: (state, action: PayloadAction<string>) => {
      if (!state.selectedCriteria.includes(action.payload)) {
        state.selectedCriteria.push(action.payload);
      }
    },
    deselectCriteria: (state, action: PayloadAction<string>) => {
      state.selectedCriteria = state.selectedCriteria.filter(
        criteria => criteria !== action.payload
      );
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    updateOverallProgress: (state, action: PayloadAction<number>) => {
      state.overallProgress = action.payload;
    },
    updateCriteriaProgress: (state, action: PayloadAction<{ criteria: string; progress: number }>) => {
      state.criteriaProgress[action.payload.criteria] = action.payload.progress;
    },
    updateQuestionnaireData: (state, action: PayloadAction<{ section: string; data: any }>) => {
      state.questionnaireData[action.payload.section] = action.payload.data;
    },
    updateSubsectionProgress: (state, action: PayloadAction<{ section: string; subsection: string; completed: boolean }>) => {
      if (!state.subsectionProgress[action.payload.section]) {
        state.subsectionProgress[action.payload.section] = {};
      }
      state.subsectionProgress[action.payload.section][action.payload.subsection] = action.payload.completed;
    },
    setApplicationSubmitted: (state, action: PayloadAction<boolean>) => {
      state.isApplicationSubmitted = action.payload;
    },
    resetApplication: (state) => {
      state.selectedCriteria = [];
      state.currentPage = 'dashboard';
      state.overallProgress = 0;
      state.criteriaProgress = {};
      state.questionnaireData = {};
      state.subsectionProgress = {};
      state.isApplicationSubmitted = false;
    },
  },
});

export const {
  selectCriteria,
  deselectCriteria,
  setCurrentPage,
  updateOverallProgress,
  updateCriteriaProgress,
  updateQuestionnaireData,
  updateSubsectionProgress,
  setApplicationSubmitted,
  resetApplication,
} = applicationSlice.actions;

export default applicationSlice.reducer; 