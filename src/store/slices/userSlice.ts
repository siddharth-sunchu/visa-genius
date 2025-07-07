import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'applicant' | 'case_manager' | 'admin';
  profile: UserProfile;
}

export interface UserProfile {
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  currentStatus?: string;
  currentAddress?: Address;
  basicInfo?: BasicInfo;
  familyLife?: FamilyLife;
  spouseInfo?: SpouseInfo;
  childrenInfo?: ChildrenInfo;
  immigrationHistory?: ImmigrationHistory;
  pastUSVisits?: PastUSVisit[];
  occupation?: Occupation;
  employmentHistory?: EmploymentHistory[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface BasicInfo {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  passportNumber?: string;
  passportExpiryDate?: string;
}

export interface FamilyLife {
  maritalStatus: string;
  spouseName?: string;
  childrenCount: number;
}

export interface SpouseInfo {
  name: string;
  dateOfBirth: string;
  nationality: string;
  occupation: string;
  education: string;
}

export interface ChildrenInfo {
  children: Child[];
}

export interface Child {
  name: string;
  dateOfBirth: string;
  nationality: string;
  relationship: string;
}

export interface ImmigrationHistory {
  previousVisas: string[];
  previousPetitions: string[];
  previousDeportations: string[];
  currentStatus: string;
  statusExpiryDate?: string;
}

export interface PastUSVisit {
  entryDate: string;
  exitDate: string;
  purpose: string;
  visaType: string;
}

export interface Occupation {
  title: string;
  field: string;
  yearsOfExperience: number;
  currentEmployer: string;
  jobDescription: string;
}

export interface EmploymentHistory {
  employer: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user.profile = { ...state.user.profile, ...action.payload };
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const {
  setUser,
  setLoading,
  setError,
  updateProfile,
  logout,
} = userSlice.actions;

export default userSlice.reducer; 