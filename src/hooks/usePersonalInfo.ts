import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchPersonalInfo,
  updateBasicInfo,
  updateCurrentStatus,
  updateCurrentAddress,
  updateFamilyLife,
  updateSpouseInfo,
  updateChildrenInfo,
  updateImmigrationHistory,
  updatePastUSVisits,
  updateOccupation,
  updateEmploymentHistory,
  updatePersonalInfo,
  clearAllErrors,
  clearError,
  clearSectionError,
} from '../store/slices/personalInfoSlice';
import { PersonalInfo, PersonalInfoSection } from '../services/personalInfo';

export const usePersonalInfo = () => {
  const dispatch = useAppDispatch();
  const personalInfoState = useAppSelector((state) => state.personalInfo);

  // Auto-fetch personal info on mount
  useEffect(() => {
    if (!personalInfoState.data || Object.keys(personalInfoState.data).length === 0) {
      dispatch(fetchPersonalInfo());
    }
  }, [dispatch, personalInfoState.data]);

  const actions = {
    // Fetch operations
    fetchPersonalInfo: () => dispatch(fetchPersonalInfo()),
    
    // Update complete personal info
    updatePersonalInfo: (data: PersonalInfo) => dispatch(updatePersonalInfo(data)),

    // Section-specific updates
    updateBasicInfo: (data: PersonalInfo['basicInfo']) => dispatch(updateBasicInfo(data)),
    updateCurrentStatus: (data: PersonalInfo['currentStatus']) => dispatch(updateCurrentStatus(data)),
    updateCurrentAddress: (data: PersonalInfo['currentAddress']) => dispatch(updateCurrentAddress(data)),
    updateFamilyLife: (data: PersonalInfo['familyLife']) => dispatch(updateFamilyLife(data)),
    updateSpouseInfo: (data: PersonalInfo['spouseInfo']) => dispatch(updateSpouseInfo(data)),
    updateChildrenInfo: (data: PersonalInfo['childrenInfo']) => dispatch(updateChildrenInfo(data)),
    updateImmigrationHistory: (data: PersonalInfo['immigrationHistory']) => dispatch(updateImmigrationHistory(data)),
    updatePastUSVisits: (data: PersonalInfo['pastUSVisits']) => dispatch(updatePastUSVisits(data)),
    updateOccupation: (data: PersonalInfo['occupation']) => dispatch(updateOccupation(data)),
    updateEmploymentHistory: (data: PersonalInfo['employmentHistory']) => dispatch(updateEmploymentHistory(data)),

    // Error management
    clearAllErrors: () => dispatch(clearAllErrors()),
    clearError: () => dispatch(clearError()),
    clearSectionError: (section: string) => dispatch(clearSectionError(section)),
  };

  const selectors = {
    // Data selectors
    data: personalInfoState.data,
    isLoading: personalInfoState.loading,
    error: personalInfoState.error,
    sectionErrors: personalInfoState.sectionErrors,
    sectionLoading: personalInfoState.sectionLoading,
    lastUpdated: personalInfoState.lastUpdated,
    isDirty: personalInfoState.isDirty,

    // Section-specific data selectors
    basicInfo: personalInfoState.data.basicInfo,
    currentStatus: personalInfoState.data.currentStatus,
    currentAddress: personalInfoState.data.currentAddress,
    familyLife: personalInfoState.data.familyLife,
    spouseInfo: personalInfoState.data.spouseInfo,
    childrenInfo: personalInfoState.data.childrenInfo,
    immigrationHistory: personalInfoState.data.immigrationHistory,
    pastUSVisits: personalInfoState.data.pastUSVisits,
    occupation: personalInfoState.data.occupation,
    employmentHistory: personalInfoState.data.employmentHistory,

    // Section loading states
    isBasicInfoLoading: personalInfoState.sectionLoading.basicInfo || false,
    isCurrentStatusLoading: personalInfoState.sectionLoading.currentStatus || false,
    isCurrentAddressLoading: personalInfoState.sectionLoading.currentAddress || false,
    isFamilyLifeLoading: personalInfoState.sectionLoading.familyLife || false,
    isSpouseInfoLoading: personalInfoState.sectionLoading.spouseInfo || false,
    isChildrenInfoLoading: personalInfoState.sectionLoading.childrenInfo || false,
    isImmigrationHistoryLoading: personalInfoState.sectionLoading.immigrationHistory || false,
    isPastUSVisitsLoading: personalInfoState.sectionLoading.pastUSVisits || false,
    isOccupationLoading: personalInfoState.sectionLoading.occupation || false,
    isEmploymentHistoryLoading: personalInfoState.sectionLoading.employmentHistory || false,

    // Section error states
    basicInfoError: personalInfoState.sectionErrors.basicInfo,
    currentStatusError: personalInfoState.sectionErrors.currentStatus,
    currentAddressError: personalInfoState.sectionErrors.currentAddress,
    familyLifeError: personalInfoState.sectionErrors.familyLife,
    spouseInfoError: personalInfoState.sectionErrors.spouseInfo,
    childrenInfoError: personalInfoState.sectionErrors.childrenInfo,
    immigrationHistoryError: personalInfoState.sectionErrors.immigrationHistory,
    pastUSVisitsError: personalInfoState.sectionErrors.pastUSVisits,
    occupationError: personalInfoState.sectionErrors.occupation,
    employmentHistoryError: personalInfoState.sectionErrors.employmentHistory,
  };

  return {
    ...selectors,
    actions,
  };
};

export default usePersonalInfo;