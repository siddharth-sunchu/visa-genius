import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { personalInfoService, PersonalInfo, PersonalInfoSection, PersonalInfoProgress } from '../../services/personalInfo';

export interface PersonalInfoState {
  data: PersonalInfo;
  loading: boolean;
  error: string | null;
  sectionLoading: Record<string, boolean>;
  sectionErrors: Record<string, string | null>;
  lastUpdated: string | null;
  isDirty: boolean;
  progress: PersonalInfoProgress | null;
}

const initialState: PersonalInfoState = {
  data: {},
  loading: false,
  error: null,
  sectionLoading: {},
  sectionErrors: {},
  lastUpdated: null,
  isDirty: false,
  progress: null,
};

// Async thunks
export const fetchPersonalInfo = createAsyncThunk(
  'personalInfo/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await personalInfoService.getPersonalInfo();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePersonalInfo = createAsyncThunk(
  'personalInfo/update',
  async (personalInfo: PersonalInfo, { rejectWithValue }) => {
    try {
      const response = await personalInfoService.updatePersonalInfo(personalInfo);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePersonalInfoSection = createAsyncThunk(
  'personalInfo/updateSection',
  async (
    { section, data }: { section: PersonalInfoSection; data: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await personalInfoService.updatePersonalInfoSection(section, data);
      return { section, data: response.data };
    } catch (error: any) {
      return rejectWithValue({ section, error: error.message });
    }
  }
);

// Helper thunks for specific sections
export const updateBasicInfo = createAsyncThunk(
  'personalInfo/updateBasicInfo',
  async (basicInfo: PersonalInfo['basicInfo'], { rejectWithValue }) => {
    try {
      const response = await personalInfoService.updateBasicInfo(basicInfo);
      return { section: 'basicInfo', data: response.data };
    } catch (error: any) {
      return rejectWithValue({ section: 'basicInfo', error: error.message });
    }
  }
);

export const updateCurrentStatus = createAsyncThunk(
  'personalInfo/updateCurrentStatus',
  async (currentStatus: PersonalInfo['currentStatus'], { rejectWithValue }) => {
    try {
      const response = await personalInfoService.updateCurrentStatus(currentStatus);
      return { section: 'currentStatus', data: response.data };
    } catch (error: any) {
      return rejectWithValue({ section: 'currentStatus', error: error.message });
    }
  }
);

export const updateCurrentAddress = createAsyncThunk(
  'personalInfo/updateCurrentAddress',
  async (currentAddress: PersonalInfo['currentAddress'], { rejectWithValue }) => {
    try {
      const response = await personalInfoService.updateCurrentAddress(currentAddress);
      return { section: 'currentAddress', data: response.data };
    } catch (error: any) {
      return rejectWithValue({ section: 'currentAddress', error: error.message });
    }
  }
);

export const updateFamilyLife = createAsyncThunk(
  'personalInfo/updateFamilyLife',
  async (familyLife: PersonalInfo['familyLife'], { rejectWithValue }) => {
    try {
      const response = await personalInfoService.updateFamilyLife(familyLife);
      return { section: 'familyLife', data: response.data };
    } catch (error: any) {
      return rejectWithValue({ section: 'familyLife', error: error.message });
    }
  }
);

export const updateSpouseInfo = createAsyncThunk(
  'personalInfo/updateSpouseInfo',
  async (spouseInfo: PersonalInfo['spouseInfo'], { rejectWithValue }) => {
    try {
      const response = await personalInfoService.updateSpouseInfo(spouseInfo);
      return { section: 'spouseInfo', data: response.data };
    } catch (error: any) {
      return rejectWithValue({ section: 'spouseInfo', error: error.message });
    }
  }
);

export const updateChildrenInfo = createAsyncThunk(
  'personalInfo/updateChildrenInfo',
  async (childrenInfo: PersonalInfo['childrenInfo'], { rejectWithValue }) => {
    try {
      const response = await personalInfoService.updateChildrenInfo(childrenInfo);
      return { section: 'childrenInfo', data: response.data };
    } catch (error: any) {
      return rejectWithValue({ section: 'childrenInfo', error: error.message });
    }
  }
);

export const updateImmigrationHistory = createAsyncThunk(
  'personalInfo/updateImmigrationHistory',
  async (immigrationHistory: PersonalInfo['immigrationHistory'], { rejectWithValue }) => {
    try {
      const response = await personalInfoService.updateImmigrationHistory(immigrationHistory);
      return { section: 'immigrationHistory', data: response.data };
    } catch (error: any) {
      return rejectWithValue({ section: 'immigrationHistory', error: error.message });
    }
  }
);

export const updatePastUSVisits = createAsyncThunk(
  'personalInfo/updatePastUSVisits',
  async (pastUSVisits: PersonalInfo['pastUSVisits'], { rejectWithValue }) => {
    try {
      const response = await personalInfoService.updatePastUSVisits(pastUSVisits);
      return { section: 'pastUSVisits', data: response.data };
    } catch (error: any) {
      return rejectWithValue({ section: 'pastUSVisits', error: error.message });
    }
  }
);

export const updateOccupation = createAsyncThunk(
  'personalInfo/updateOccupation',
  async (occupation: PersonalInfo['occupation'], { rejectWithValue }) => {
    try {
      const response = await personalInfoService.updateOccupation(occupation);
      return { section: 'occupation', data: response.data };
    } catch (error: any) {
      return rejectWithValue({ section: 'occupation', error: error.message });
    }
  }
);

export const updateEmploymentHistory = createAsyncThunk(
  'personalInfo/updateEmploymentHistory',
  async (employmentHistory: PersonalInfo['employmentHistory'], { rejectWithValue }) => {
    try {
      const response = await personalInfoService.updateEmploymentHistory(employmentHistory);
      return { section: 'employmentHistory', data: response.data };
    } catch (error: any) {
      return rejectWithValue({ section: 'employmentHistory', error: error.message });
    }
  }
);

const personalInfoSlice = createSlice({
  name: 'personalInfo',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSectionError: (state, action: PayloadAction<string>) => {
      state.sectionErrors[action.payload] = null;
    },
    clearAllErrors: (state) => {
      state.error = null;
      state.sectionErrors = {};
    },
    setPersonalInfoData: (state, action: PayloadAction<PersonalInfo>) => {
      state.data = { ...state.data, ...action.payload };
      state.isDirty = true;
    },
    updateLocalSection: (state, action: PayloadAction<{ section: string; data: any }>) => {
      (state.data as any)[action.payload.section] = action.payload.data;
      state.isDirty = true;
    },
    resetPersonalInfo: (state) => {
      state.data = {};
      state.loading = false;
      state.error = null;
      state.sectionLoading = {};
      state.sectionErrors = {};
      state.lastUpdated = null;
      state.isDirty = false;
    },
    markAsClean: (state) => {
      state.isDirty = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch personal info
    builder
      .addCase(fetchPersonalInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonalInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        if (action.payload.progress) {
          state.progress = action.payload.progress;
        }
        state.lastUpdated = new Date().toISOString();
        state.isDirty = false;
      })
      .addCase(fetchPersonalInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update complete personal info
    builder
      .addCase(updatePersonalInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePersonalInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.isDirty = false;
      })
      .addCase(updatePersonalInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update section generic handler
    const handleSectionUpdate = (
      state: PersonalInfoState,
      action: any,
      section: string
    ) => {
      state.sectionLoading[section] = false;
      (state.data as any)[section] = action.payload.data;
      if (action.payload.progress) {
        state.progress = action.payload.progress;
      }
      state.lastUpdated = new Date().toISOString();
      state.isDirty = false;
    };

    const handleSectionPending = (
      state: PersonalInfoState,
      section: string
    ) => {
      state.sectionLoading[section] = true;
      state.sectionErrors[section] = null;
    };

    const handleSectionRejected = (
      state: PersonalInfoState,
      action: any,
      section: string
    ) => {
      state.sectionLoading[section] = false;
      state.sectionErrors[section] = action.payload.error;
    };

    // Section-specific handlers
    const sections = [
      'basicInfo',
      'currentStatus', 
      'currentAddress',
      'familyLife',
      'spouseInfo',
      'childrenInfo',
      'immigrationHistory',
      'pastUSVisits',
      'occupation',
      'employmentHistory'
    ];

    sections.forEach(section => {
      const thunkName = `personalInfo/update${section.charAt(0).toUpperCase() + section.slice(1)}`;
      
      builder
        .addCase(`${thunkName}/pending` as any, (state) => {
          handleSectionPending(state, section);
        })
        .addCase(`${thunkName}/fulfilled` as any, (state, action) => {
          handleSectionUpdate(state, action, section);
        })
        .addCase(`${thunkName}/rejected` as any, (state, action) => {
          handleSectionRejected(state, action, section);
        });
    });

    // Generic section update handler
    builder
      .addCase(updatePersonalInfoSection.pending, (state, action) => {
        const section = action.meta.arg.section;
        handleSectionPending(state, section);
      })
      .addCase(updatePersonalInfoSection.fulfilled, (state, action) => {
        const section = action.payload.section;
        handleSectionUpdate(state, action, section);
      })
      .addCase(updatePersonalInfoSection.rejected, (state, action) => {
        const section = (action.payload as any).section;
        handleSectionRejected(state, action, section);
      });
  },
});

export const {
  clearError,
  clearSectionError,
  clearAllErrors,
  setPersonalInfoData,
  updateLocalSection,
  resetPersonalInfo,
  markAsClean,
} = personalInfoSlice.actions;

export default personalInfoSlice.reducer;