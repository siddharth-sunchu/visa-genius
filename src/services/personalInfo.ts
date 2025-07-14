import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';

export interface PersonalInfoProgress {
  currentStep: string;
  completedSections: string[];
  totalSteps: number;
  completedSteps: number;
  lastCompletedAt?: string;
}

export interface PersonalInfo {
  basicInfo?: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    dateOfBirth?: string;
    placeOfBirth?: string;
    nationality?: string;
    passportNumber?: string;
    passportExpiryDate?: string;
  };
  currentStatus?: {
    status?: string;
    statusExpiryDate?: string;
    i94Number?: string;
    sevisNumber?: string;
  };
  currentAddress?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  familyLife?: {
    maritalStatus?: string;
    childrenCount?: number;
  };
  spouseInfo?: {
    name?: string;
    dateOfBirth?: string;
    nationality?: string;
    occupation?: string;
    education?: string;
  };
  childrenInfo?: {
    children?: Array<{
      name?: string;
      dateOfBirth?: string;
      nationality?: string;
      relationship?: string;
    }>;
  };
  immigrationHistory?: {
    previousVisas?: string;
    previousPetitions?: string;
    previousDeportations?: string;
  };
  pastUSVisits?: Array<{
    entryDate?: string;
    exitDate?: string;
    purpose?: string;
    visaType?: string;
  }>;
  occupation?: {
    jobTitle?: string;
    field?: string;
    yearsOfExperience?: number;
    currentEmployer?: string;
    jobDescription?: string;
  };
  employmentHistory?: Array<{
    employer?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  updatedAt?: string;
  progress?: PersonalInfoProgress;
}

export interface PersonalInfoResponse {
  success: boolean;
  data: PersonalInfo;
  message?: string;
}

export interface PersonalInfoSectionResponse {
  success: boolean;
  data: any;
  message?: string;
  progress?: PersonalInfoProgress;
}

export type PersonalInfoSection = 
  | 'basicInfo' 
  | 'currentStatus' 
  | 'currentAddress' 
  | 'familyLife' 
  | 'spouseInfo' 
  | 'childrenInfo' 
  | 'immigrationHistory' 
  | 'pastUSVisits' 
  | 'occupation' 
  | 'employmentHistory';

class PersonalInfoService {
  async getPersonalInfo(): Promise<PersonalInfoResponse> {
    try {
      const response = await apiService.get<PersonalInfoResponse>(API_ENDPOINTS.personalInfo.get);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch personal information');
    }
  }

  async updatePersonalInfo(personalInfo: PersonalInfo): Promise<PersonalInfoResponse> {
    try {
      const response = await apiService.put<PersonalInfoResponse>(
        API_ENDPOINTS.personalInfo.update,
        personalInfo
      );
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update personal information');
    }
  }

  async updatePersonalInfoSection(
    section: PersonalInfoSection,
    sectionData: any
  ): Promise<PersonalInfoSectionResponse> {
    try {
      const response = await apiService.patch<PersonalInfoSectionResponse>(
        API_ENDPOINTS.personalInfo.updateSection(section),
        sectionData
      );
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `Failed to update ${section}`);
    }
  }

  // Helper methods for specific sections
  async updateBasicInfo(basicInfo: PersonalInfo['basicInfo']): Promise<PersonalInfoSectionResponse> {
    return this.updatePersonalInfoSection('basicInfo', basicInfo);
  }

  async updateCurrentStatus(currentStatus: PersonalInfo['currentStatus']): Promise<PersonalInfoSectionResponse> {
    return this.updatePersonalInfoSection('currentStatus', currentStatus);
  }

  async updateCurrentAddress(currentAddress: PersonalInfo['currentAddress']): Promise<PersonalInfoSectionResponse> {
    return this.updatePersonalInfoSection('currentAddress', currentAddress);
  }

  async updateFamilyLife(familyLife: PersonalInfo['familyLife']): Promise<PersonalInfoSectionResponse> {
    return this.updatePersonalInfoSection('familyLife', familyLife);
  }

  async updateSpouseInfo(spouseInfo: PersonalInfo['spouseInfo']): Promise<PersonalInfoSectionResponse> {
    return this.updatePersonalInfoSection('spouseInfo', spouseInfo);
  }

  async updateChildrenInfo(childrenInfo: PersonalInfo['childrenInfo']): Promise<PersonalInfoSectionResponse> {
    return this.updatePersonalInfoSection('childrenInfo', childrenInfo);
  }

  async updateImmigrationHistory(immigrationHistory: PersonalInfo['immigrationHistory']): Promise<PersonalInfoSectionResponse> {
    return this.updatePersonalInfoSection('immigrationHistory', immigrationHistory);
  }

  async updatePastUSVisits(pastUSVisits: PersonalInfo['pastUSVisits']): Promise<PersonalInfoSectionResponse> {
    return this.updatePersonalInfoSection('pastUSVisits', pastUSVisits);
  }

  async updateOccupation(occupation: PersonalInfo['occupation']): Promise<PersonalInfoSectionResponse> {
    return this.updatePersonalInfoSection('occupation', occupation);
  }

  async updateEmploymentHistory(employmentHistory: PersonalInfo['employmentHistory']): Promise<PersonalInfoSectionResponse> {
    return this.updatePersonalInfoSection('employmentHistory', employmentHistory);
  }
}

export const personalInfoService = new PersonalInfoService();