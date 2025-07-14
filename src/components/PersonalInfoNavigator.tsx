import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Steps, Card, Button, Progress, message } from 'antd';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchPersonalInfo } from '../store/slices/personalInfoSlice';
import PersonalInfoRouter, { PERSONAL_INFO_STEPS } from '../utils/personalInfoRouting';
import PersonalInfoForm from './PersonalInfoForm';

const { Step } = Steps;

const PersonalInfoNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, progress, loading } = useAppSelector((state: any) => state.personalInfo);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Load personal info and progress on mount
  useEffect(() => {
    dispatch(fetchPersonalInfo());
  }, [dispatch]);

  // Update current step based on progress and route
  useEffect(() => {
    if (progress) {
      const currentStep = PersonalInfoRouter.getCurrentStep(progress);
      const stepIndex = PERSONAL_INFO_STEPS.findIndex(step => step.key === currentStep);
      setCurrentStepIndex(stepIndex >= 0 ? stepIndex : 0);

      // Check if user should be redirected
      const { shouldRedirect, redirectTo } = PersonalInfoRouter.shouldRedirectToCurrentStep(
        location.pathname,
        progress
      );

      if (shouldRedirect && redirectTo) {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [progress, location.pathname, navigate]);

  const handleStepChange = (stepIndex: number) => {
    const step = PERSONAL_INFO_STEPS[stepIndex];
    if (step && PersonalInfoRouter.isStepAccessible(step.key, progress)) {
      navigate(step.route);
    } else {
      message.warning('Please complete previous steps before accessing this section.');
    }
  };

  const handleNext = () => {
    if (progress) {
      const nextStep = PersonalInfoRouter.getNextStep(progress.currentStep);
      if (nextStep) {
        const route = PersonalInfoRouter.getRouteForStep(nextStep);
        navigate(route);
      } else {
        message.success('All sections completed!');
        navigate('/personal-info/completed');
      }
    }
  };

  const handlePrevious = () => {
    if (progress) {
      const previousStep = PersonalInfoRouter.getPreviousStep(progress.currentStep);
      if (previousStep) {
        const route = PersonalInfoRouter.getRouteForStep(previousStep);
        navigate(route);
      }
    }
  };

  const getStepStatus = (stepKey: string) => {
    if (!progress) return 'wait';
    
    if (progress.completedSections.includes(stepKey)) {
      return 'finish';
    } else if (stepKey === progress.currentStep) {
      return 'process';
    } else {
      return 'wait';
    }
  };

  const getStepIcon = (stepKey: string) => {
    const status = getStepStatus(stepKey);
    if (status === 'finish') {
      return <CheckCircleOutlined />;
    } else if (status === 'process' && loading) {
      return <LoadingOutlined />;
    }
    return null;
  };

  const completionPercentage = PersonalInfoRouter.getCompletionPercentage(progress);

  if (loading && !data) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <LoadingOutlined style={{ fontSize: '24px' }} />
        <div style={{ marginTop: '16px' }}>Loading personal information...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress Overview */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3>Personal Information Progress</h3>
          <Progress 
            percent={completionPercentage} 
            status={completionPercentage === 100 ? 'success' : 'active'}
            format={percent => `${percent}% Complete`}
          />
        </div>
        
        {progress && (
          <div style={{ fontSize: '14px', color: '#666' }}>
            Step {progress.completedSteps + 1} of {progress.totalSteps} • 
            Current: {PERSONAL_INFO_STEPS.find(s => s.key === progress.currentStep)?.title || 'Unknown'}
          </div>
        )}
      </Card>

      {/* Step Navigation */}
      <Card style={{ marginBottom: '24px' }}>
        <Steps
          current={currentStepIndex}
          onChange={handleStepChange}
          size="small"
          direction="horizontal"
          style={{ marginBottom: '16px' }}
        >
          {PERSONAL_INFO_STEPS.map((step, index) => (
            <Step
              key={step.key}
              title={step.title}
              description={step.description}
              status={getStepStatus(step.key)}
              icon={getStepIcon(step.key)}
              disabled={!PersonalInfoRouter.isStepAccessible(step.key, progress)}
              style={{
                cursor: PersonalInfoRouter.isStepAccessible(step.key, progress) 
                  ? 'pointer' 
                  : 'not-allowed'
              }}
            />
          ))}
        </Steps>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Button 
            onClick={handlePrevious}
            disabled={!progress || currentStepIndex === 0}
          >
            Previous
          </Button>
          
          <Button 
            type="primary"
            onClick={handleNext}
            disabled={!progress || progress.currentStep === 'completed'}
          >
            {progress?.currentStep === PERSONAL_INFO_STEPS[PERSONAL_INFO_STEPS.length - 1].key 
              ? 'Complete' 
              : 'Next'
            }
          </Button>
        </div>
      </Card>

      {/* Form Content */}
      <PersonalInfoForm />
    </div>
  );
};

export default PersonalInfoNavigator;