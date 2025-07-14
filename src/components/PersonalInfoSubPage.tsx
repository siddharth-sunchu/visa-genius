import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Space,
  message,
  Steps,
  Progress,
  Alert
} from 'antd';
import {
  SaveOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateQuestionnaireData, updateSubsectionProgress } from '../store/slices/applicationSlice';
import { QUESTIONNAIRE_SECTIONS } from '../utils/constants';
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
  updateEmploymentHistory
} from '../store/slices/personalInfoSlice';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;

const PersonalInfoSubPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { questionnaireData, subsectionProgress } = useAppSelector((state: any) => state.application);
  const { data: personalInfoData, progress: backendProgress } = useAppSelector((state: any) => state.personalInfo);
  const [form] = Form.useForm();
  const [currentSubsectionIndex, setCurrentSubsectionIndex] = useState(0);

  // Load personal info on component mount
  useEffect(() => {
    dispatch(fetchPersonalInfo());
  }, [dispatch]);


  const personalInfoSection = QUESTIONNAIRE_SECTIONS.personal_info;
  const subsections = personalInfoSection.subsections;
  const currentSubsection = subsections[currentSubsectionIndex];

  // Map backend section names to frontend subsection IDs
  const backendToFrontendMapping: Record<string, string> = {
    'basic_info': 'basic_info',
    'currentStatus': 'current_status', 
    'currentAddress': 'current_address',
    'familyLife': 'family_life',
    'spouseInfo': 'spouse_info',
    'childrenInfo': 'children_info',
    'immigrationHistory': 'immigration_history',
    'pastUSVisits': 'past_us_visits',
    'occupation': 'occupation',
    'employmentHistory': 'employment_history'
  };

  // Calculate progress using backend data if available, otherwise fallback to local progress
  const getCompletedSubsections = () => {
    if (backendProgress?.completedSections) {
      // Convert backend completed sections to frontend subsection IDs
      const frontendCompletedSections: string[] = [];
      backendProgress.completedSections.forEach((section: string) => {
        const frontendId = backendToFrontendMapping[section];
        if (frontendId) {
          frontendCompletedSections.push(frontendId);
        }
      });
      return frontendCompletedSections;
    }
    // Fallback to local progress
    return Object.keys(subsectionProgress.personal_info || {}).filter(key => 
      subsectionProgress.personal_info[key]
    );
  };

  const completedSubsectionIds = getCompletedSubsections();
  const completedSubsections = completedSubsectionIds.length;
  const totalSubsections = subsections.length;
  const progressPercentage = backendProgress?.completedSteps && backendProgress?.totalSteps 
    ? Math.round((backendProgress.completedSteps / backendProgress.totalSteps) * 100)
    : Math.round((completedSubsections / totalSubsections) * 100);

  // Helper function to map personal info data to form fields
  const getPersonalInfoMapping = React.useCallback((subsectionId: string) => {
    if (!personalInfoData) return {};
    
    switch (subsectionId) {
      case 'basic_info':
        return {
          firstName: personalInfoData.basicInfo?.firstName,
          lastName: personalInfoData.basicInfo?.lastName,
          middleName: personalInfoData.basicInfo?.middleName,
          dateOfBirth: personalInfoData.basicInfo?.dateOfBirth ? dayjs(personalInfoData.basicInfo.dateOfBirth) : undefined,
          placeOfBirth: personalInfoData.basicInfo?.placeOfBirth,
          nationality: personalInfoData.basicInfo?.nationality,
          passportNumber: personalInfoData.basicInfo?.passportNumber,
          passportExpiryDate: personalInfoData.basicInfo?.passportExpiryDate ? dayjs(personalInfoData.basicInfo.passportExpiryDate) : undefined,
        };
      case 'current_status':
        return {
          currentStatus: personalInfoData.currentStatus?.status,
          statusExpiryDate: personalInfoData.currentStatus?.statusExpiryDate ? dayjs(personalInfoData.currentStatus.statusExpiryDate) : undefined,
          i94Number: personalInfoData.currentStatus?.i94Number,
          sevisNumber: personalInfoData.currentStatus?.sevisNumber,
        };
      case 'current_address':
        return {
          street: personalInfoData.currentAddress?.street,
          city: personalInfoData.currentAddress?.city,
          state: personalInfoData.currentAddress?.state,
          country: personalInfoData.currentAddress?.country,
          zipCode: personalInfoData.currentAddress?.zipCode,
        };
      case 'family_life':
        return {
          maritalStatus: personalInfoData.familyLife?.maritalStatus,
          spouseName: personalInfoData.spouseInfo?.name,
          childrenCount: personalInfoData.familyLife?.childrenCount,
        };
      case 'spouse_info':
        return {
          spouseName: personalInfoData.spouseInfo?.name,
          spouseDateOfBirth: personalInfoData.spouseInfo?.dateOfBirth ? dayjs(personalInfoData.spouseInfo.dateOfBirth) : undefined,
          spouseNationality: personalInfoData.spouseInfo?.nationality,
          spouseOccupation: personalInfoData.spouseInfo?.occupation,
          spouseEducation: personalInfoData.spouseInfo?.education,
        };
      case 'children_info':
        return {
          childrenCount: personalInfoData.familyLife?.childrenCount,
          childrenDetails: personalInfoData.childrenInfo?.children?.map((child: any) => 
            `${child.name} (${child.dateOfBirth}) - ${child.relationship}`
          ).join('\n'),
        };
      case 'immigration_history':
        return {
          previousVisas: personalInfoData.immigrationHistory?.previousVisas,
          visaHistory: personalInfoData.immigrationHistory?.previousVisas,
          previousPetitions: personalInfoData.immigrationHistory?.previousPetitions,
          petitionOutcomes: personalInfoData.immigrationHistory?.previousPetitions,
          pastVisits: personalInfoData.pastUSVisits?.map((visit: any) => 
            `${visit.entryDate} to ${visit.exitDate} - ${visit.purpose} (${visit.visaType})`
          ).join('\n'),
          visitPurposes: personalInfoData.pastUSVisits?.map((visit: any) => visit.purpose).join(', '),
        };
      case 'occupation':
        return {
          jobTitle: personalInfoData.occupation?.jobTitle,
          field: personalInfoData.occupation?.field,
          yearsOfExperience: personalInfoData.occupation?.yearsOfExperience,
          currentEmployer: personalInfoData.occupation?.currentEmployer,
          jobDescription: personalInfoData.occupation?.jobDescription,
          employmentHistory: personalInfoData.employmentHistory?.map((emp: any) => 
            `${emp.employer} - ${emp.position} (${emp.startDate} to ${emp.endDate || 'Present'})`
          ).join('\n'),
          previousEmployers: personalInfoData.employmentHistory?.map((emp: any) => emp.employer).join(', '),
        };
      default:
        return {};
    }
  }, [personalInfoData]);

  // Auto-navigate to current step based on backend progress
  useEffect(() => {
    if (backendProgress?.currentStep) {
      // Map backend current step to frontend subsection index
      const frontendStepId = backendToFrontendMapping[backendProgress.currentStep] || backendProgress.currentStep;
      const stepIndex = subsections.findIndex(section => section.id === frontendStepId);
      if (stepIndex >= 0 && stepIndex !== currentSubsectionIndex) {
        setCurrentSubsectionIndex(stepIndex);
      }
    }
  }, [backendProgress, subsections, backendToFrontendMapping, currentSubsectionIndex]);

  useEffect(() => {
    // Load existing data for current subsection from questionnaire first
    const existingData = questionnaireData.personal_info?.[currentSubsection.id] || {};
    
    // If we have personal info data, merge it with existing questionnaire data
    if (personalInfoData && Object.keys(personalInfoData).length > 0) {
      const personalInfoMapping = getPersonalInfoMapping(currentSubsection.id);
      const mergedData = { ...existingData, ...personalInfoMapping };
      form.setFieldsValue(mergedData);
    } else {
      form.setFieldsValue(existingData);
    }
  }, [currentSubsectionIndex, form, questionnaireData, personalInfoData, currentSubsection.id, getPersonalInfoMapping]);

  // Helper function to save to personal info API based on subsection
  const saveToPersonalInfoAPI = async (subsectionId: string, values: any) => {
    try {
      console.log(`Saving ${subsectionId} to personal info API:`, values);
      
      switch (subsectionId) {
        case 'basic_info':
          await dispatch(updateBasicInfo({
            firstName: values.firstName || '',
            lastName: values.lastName || '',
            middleName: values.middleName || '',
            dateOfBirth: values.dateOfBirth ? (dayjs.isDayjs(values.dateOfBirth) ? values.dateOfBirth.format('YYYY-MM-DD') : values.dateOfBirth) : '',
            placeOfBirth: values.placeOfBirth || '',
            nationality: values.nationality || '',
            passportNumber: values.passportNumber || '',
            passportExpiryDate: values.passportExpiryDate ? (dayjs.isDayjs(values.passportExpiryDate) ? values.passportExpiryDate.format('YYYY-MM-DD') : values.passportExpiryDate) : '',
          })).unwrap();
          break;
          
        case 'current_status':
          await dispatch(updateCurrentStatus({
            status: values.currentStatus || '',
            statusExpiryDate: values.statusExpiryDate ? (dayjs.isDayjs(values.statusExpiryDate) ? values.statusExpiryDate.format('YYYY-MM-DD') : values.statusExpiryDate) : '',
            i94Number: values.i94Number || '',
            sevisNumber: values.sevisNumber || '',
          })).unwrap();
          break;
          
        case 'current_address':
          await dispatch(updateCurrentAddress({
            street: values.street || '',
            city: values.city || '',
            state: values.state || '',
            country: values.country || '',
            zipCode: values.zipCode || '',
          })).unwrap();
          break;
          
        case 'family_life':
          await dispatch(updateFamilyLife({
            maritalStatus: values.maritalStatus || '',
            childrenCount: values.childrenCount || 0,
          })).unwrap();
          break;
          
        case 'spouse_info':
          await dispatch(updateSpouseInfo({
            name: values.spouseName || '',
            dateOfBirth: values.spouseDateOfBirth ? (dayjs.isDayjs(values.spouseDateOfBirth) ? values.spouseDateOfBirth.format('YYYY-MM-DD') : values.spouseDateOfBirth) : '',
            nationality: values.spouseNationality || '',
            occupation: values.spouseOccupation || '',
            education: values.spouseEducation || '',
          })).unwrap();
          break;
          
        case 'children_info':
          // For children info, we'll parse the details text into structured data
          const childrenArray: Array<{ name: string; dateOfBirth: string; relationship: string }> = [];
          if (values.childrenDetails) {
            const lines = values.childrenDetails.split('\n');
            lines.forEach((line: string) => {
              if (line.trim()) {
                const parts = line.split(' - ');
                if (parts.length >= 2) {
                  const nameAndDate = parts[0].split(' (');
                  const name = nameAndDate[0];
                  const dateOfBirth = nameAndDate[1]?.replace(')', '') || '';
                  const relationship = parts[1] || 'Child';
                  childrenArray.push({ name, dateOfBirth, relationship });
                }
              }
            });
          }
          
          await dispatch(updateChildrenInfo({
            children: childrenArray,
          })).unwrap();
          break;
          
        case 'immigration_history':
          await dispatch(updateImmigrationHistory({
            previousVisas: values.previousVisas || '',
            previousPetitions: values.previousPetitions || '',
            previousDeportations: values.previousDeportations || '',
          })).unwrap();
          
          // Also update past US visits if available
          if (values.pastVisits) {
            const visits: Array<{ entryDate: string; exitDate: string; purpose: string; visaType: string }> = [];
            const lines = values.pastVisits.split('\n');
            lines.forEach((line: string) => {
              if (line.trim()) {
                const parts = line.split(' - ');
                if (parts.length >= 2) {
                  const dates = parts[0].split(' to ');
                  const purposeAndVisa = parts[1].split(' (');
                  visits.push({
                    entryDate: dates[0] || '',
                    exitDate: dates[1] || '',
                    purpose: purposeAndVisa[0] || '',
                    visaType: purposeAndVisa[1]?.replace(')', '') || '',
                  });
                }
              }
            });
            
            await dispatch(updatePastUSVisits(visits)).unwrap();
          }
          break;
          
        case 'occupation':
          await dispatch(updateOccupation({
            jobTitle: values.jobTitle || '',
            field: values.field || '',
            yearsOfExperience: values.yearsOfExperience || 0,
            currentEmployer: values.currentEmployer || '',
            jobDescription: values.jobDescription || '',
          })).unwrap();
          
          // Also update employment history if available
          if (values.employmentHistory) {
            const employmentArray: Array<{ employer: string; position: string; startDate: string; endDate: string; description: string }> = [];
            const lines = values.employmentHistory.split('\n');
            lines.forEach((line: string) => {
              if (line.trim()) {
                const parts = line.split(' - ');
                if (parts.length >= 2) {
                  const employer = parts[0];
                  const positionAndDates = parts[1].split(' (');
                  const position = positionAndDates[0];
                  const dates = positionAndDates[1]?.replace(')', '').split(' to ');
                  employmentArray.push({
                    employer,
                    position,
                    startDate: dates?.[0] || '',
                    endDate: dates?.[1] && dates[1] !== 'Present' ? dates[1] : '',
                    description: '',
                  });
                }
              }
            });
            
            await dispatch(updateEmploymentHistory(employmentArray)).unwrap();
          }
          break;
          
        default:
          console.log(`Section ${subsectionId} saved to questionnaire only`);
          break;
      }
    } catch (error: any) {
      console.error('Error saving to personal info API:', error);
      // Provide more detailed error information
      const errorMessage = error.message || error.error || 'Unknown error occurred';
      throw new Error(`Failed to save ${subsectionId}: ${errorMessage}`);
    }
  };

  const handleNext = async () => {
    try {
      // For validation, only validate if this is a new section
      const isAlreadyCompleted = isSubsectionCompleted(currentSubsection.id);
      let values;
      
      if (isAlreadyCompleted) {
        // If already completed, just get the values without strict validation
        values = form.getFieldsValue();
      } else {
        // If not completed, validate required fields
        values = await form.validateFields();
      }
      
      // Save current subsection data to questionnaire
      dispatch(updateQuestionnaireData({
        section: 'personal_info',
        data: {
          ...questionnaireData.personal_info,
          [currentSubsection.id]: values
        }
      }));

      // Save to personal info API
      await saveToPersonalInfoAPI(currentSubsection.id, values);

      // Refetch backend progress to get updated data
      await dispatch(fetchPersonalInfo()).unwrap();

      // Mark subsection as completed in local state
      dispatch(updateSubsectionProgress({
        section: 'personal_info',
        subsection: currentSubsection.id,
        completed: true
      }));

      message.success(`${currentSubsection.name} saved successfully!`);

      // Move to next subsection
      if (currentSubsectionIndex < subsections.length - 1) {
        setCurrentSubsectionIndex(currentSubsectionIndex + 1);
      } else {
        message.success('🎉 All personal information sections completed!');
      }
    } catch (error: any) {
      console.error('Next error:', error);
      message.error(error.message || 'Please fill in all required fields.');
    }
  };

  const handlePrevious = () => {
    if (currentSubsectionIndex > 0) {
      setCurrentSubsectionIndex(currentSubsectionIndex - 1);
    }
  };

  const handleSave = async () => {
    try {
      // Get form values (don't validate required fields for re-saves)
      const values = form.getFieldsValue();
      
      // Save to questionnaire
      dispatch(updateQuestionnaireData({
        section: 'personal_info',
        data: {
          ...questionnaireData.personal_info,
          [currentSubsection.id]: values
        }
      }));

      // Save to personal info API
      await saveToPersonalInfoAPI(currentSubsection.id, values);

      // Refetch backend progress to get updated data
      await dispatch(fetchPersonalInfo()).unwrap();

      // Mark subsection as completed in local state
      dispatch(updateSubsectionProgress({
        section: 'personal_info',
        subsection: currentSubsection.id,
        completed: true
      }));

      message.success(`${currentSubsection.name} saved successfully!`);
    } catch (error: any) {
      console.error('Save error:', error);
      message.error(error.message || 'Failed to save section. Please try again.');
    }
  };

  const isSubsectionCompleted = (subsectionId: string) => {
    // Check backend progress first, then fallback to local progress
    if (backendProgress?.completedSections) {
      return completedSubsectionIds.includes(subsectionId);
    }
    return subsectionProgress.personal_info?.[subsectionId] || false;
  };

  const renderField = (field: any) => {
    const { id, label, type, required, options } = field;

    switch (type) {
      case 'text':
        return (
          <Form.Item
            key={id}
            name={id}
            label={label}
            rules={required ? [{ required: true, message: `Please enter ${label.toLowerCase()}` }] : []}
          >
            <Input placeholder={`Enter ${label.toLowerCase()}`} />
          </Form.Item>
        );

      case 'textarea':
        return (
          <Form.Item
            key={id}
            name={id}
            label={label}
            rules={required ? [{ required: true, message: `Please enter ${label.toLowerCase()}` }] : []}
          >
            <TextArea rows={4} placeholder={`Enter ${label.toLowerCase()}`} />
          </Form.Item>
        );

      case 'select':
        return (
          <Form.Item
            key={id}
            name={id}
            label={label}
            rules={required ? [{ required: true, message: `Please select ${label.toLowerCase()}` }] : []}
          >
            <Select placeholder={`Select ${label.toLowerCase()}`}>
              {options?.map((option: string) => (
                <Option key={option} value={option}>{option}</Option>
              ))}
            </Select>
          </Form.Item>
        );

      case 'date':
        return (
          <Form.Item
            key={id}
            name={id}
            label={label}
            rules={required ? [{ required: true, message: `Please select ${label.toLowerCase()}` }] : []}
          >
            <DatePicker style={{ width: '100%' }} placeholder={`Select ${label.toLowerCase()}`} />
          </Form.Item>
        );

      default:
        return null;
    }
  };

  return (
    <div>

      {/* Progress Overview */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row align="middle" justify="space-between" style={{ marginBottom: '16px' }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              Progress: {completedSubsections} of {totalSubsections} sections completed
            </Title>
            <Text type="secondary">
              {completedSubsections === totalSubsections ? '✅ All sections completed!' : 'Continue completing sections'}
            </Text>
          </Col>
          <Col>
            <Progress 
              type="circle" 
              percent={Math.round(progressPercentage)} 
              size={60}
              strokeColor={completedSubsections === totalSubsections ? "#52c41a" : "#1890ff"}
            />
          </Col>
        </Row>

        {/* Steps */}
        <Steps
          current={currentSubsectionIndex}
          progressDot
          size="small"
          style={{ marginTop: '16px' }}
        >
          {subsections.map((subsection, index) => (
            <Step
              key={subsection.id}
              title={subsection.name}
              status={
                isSubsectionCompleted(subsection.id) 
                  ? 'finish' 
                  : currentSubsectionIndex === index 
                  ? 'process' 
                  : 'wait'
              }
              icon={isSubsectionCompleted(subsection.id) ? <CheckCircleOutlined /> : undefined}
            />
          ))}
        </Steps>
      </Card>

      {/* Current Subsection Form */}
      <Card style={{ borderRadius: '12px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Title level={4}>
            {currentSubsection.name}
          </Title>
          <Paragraph type="secondary">
            {currentSubsection.description}
          </Paragraph>
          {isSubsectionCompleted(currentSubsection.id) && (
            <Alert
              message="Section Completed"
              description="This section has been completed. You can review and update the information below."
              type="success"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}
        </div>

        <Form
          form={form}
          layout="vertical"
          size="large"
        >
          <Row gutter={[16, 16]}>
            {currentSubsection.fields.map((field) => (
              <Col xs={24} sm={field.type === 'textarea' ? 24 : 12} key={field.id}>
                {renderField(field)}
              </Col>
            ))}
          </Row>

          {/* Navigation Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #f0f0f0'
          }}>
            <Button 
              icon={<ArrowLeftOutlined />}
              onClick={handlePrevious}
              disabled={currentSubsectionIndex === 0}
              size="large"
            >
              Previous
            </Button>
            
            <Space>
              <Button 
                icon={<SaveOutlined />}
                onClick={handleSave}
                size="large"
              >
                Save Section
              </Button>
              
              {currentSubsectionIndex < subsections.length - 1 && (
                <Button 
                  type="primary" 
                  icon={<ArrowRightOutlined />}
                  onClick={handleNext}
                  size="large"
                >
                  Next Section
                </Button>
              )}
              
              {currentSubsectionIndex === subsections.length - 1 && (
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />}
                  onClick={handleNext}
                  size="large"
                >
                  Complete Personal Information
                </Button>
              )}
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default PersonalInfoSubPage; 