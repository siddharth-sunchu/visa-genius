import React, { useState } from 'react';
import { Steps, Card, Typography, Button, Row, Col, Progress, Space } from 'antd';
import { 
  UserOutlined, 
  FileTextOutlined, 
  TeamOutlined, 
  CheckCircleOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { APPLICATION_STEPS } from '../utils/constants';
import PersonalInfoStep from '../components/steps/PersonalInfoStep';
import EB1ACriteriaStep from '../components/steps/EB1ACriteriaStep';
import RefereesStep from '../components/steps/RefereesStep';
import ReviewStep from '../components/steps/ReviewStep';

const { Title, Text } = Typography;
const { Step } = Steps;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      title: 'Personal Information',
      icon: <UserOutlined />,
      description: 'Fill in your basic information and professional background',
      component: <PersonalInfoStep onComplete={() => handleStepComplete(0)} />
    },
    {
      title: 'EB1A Criteria',
      icon: <FileTextOutlined />,
      description: 'Complete the EB1A eligibility criteria sections',
      component: <EB1ACriteriaStep onComplete={() => handleStepComplete(1)} />
    },
    {
      title: 'Recommendation Letters',
      icon: <TeamOutlined />,
      description: 'Add referees and generate recommendation letters',
      component: <RefereesStep onComplete={() => handleStepComplete(2)} />
    },
    {
      title: 'Review & Submit',
      icon: <CheckCircleOutlined />,
      description: 'Review your application and submit for case manager review',
      component: <ReviewStep onComplete={() => handleStepComplete(3)} />
    }
  ];

  const handleStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const handleStepChange = (step: number) => {
    // Only allow navigation to completed steps or the next available step
    if (step <= currentStep || completedSteps.includes(step)) {
      setCurrentStep(step);
    }
  };

  const progressPercentage = ((completedSteps.length + (currentStep > 0 ? 1 : 0)) / steps.length) * 100;

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Welcome Section */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Welcome back, {user?.name || 'User'}! 👋
            </Title>
            <Text type="secondary">
              Continue your EB1A application journey
            </Text>
          </Col>
          <Col>
            <div style={{ textAlign: 'right' }}>
              <Progress 
                type="circle" 
                percent={Math.round(progressPercentage)} 
                size={80}
                strokeColor="#52c41a"
              />
              <div style={{ marginTop: '8px' }}>
                <Text strong>{Math.round(progressPercentage)}% Complete</Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Progress Overview */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Title level={4} style={{ marginBottom: '16px' }}>
          Application Progress
        </Title>
        <Row gutter={[16, 16]}>
          {steps.map((step, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card 
                size="small" 
                style={{ 
                  textAlign: 'center',
                  border: currentStep === index ? '2px solid #1890ff' : '1px solid #d9d9d9',
                  borderRadius: '8px',
                  cursor: completedSteps.includes(index) || index <= currentStep ? 'pointer' : 'not-allowed',
                  opacity: completedSteps.includes(index) || index <= currentStep ? 1 : 0.5
                }}
                onClick={() => handleStepChange(index)}
              >
                <div style={{ marginBottom: '8px' }}>
                  {completedSteps.includes(index) ? (
                    <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                  ) : (
                    <div style={{ fontSize: '24px', color: currentStep === index ? '#1890ff' : '#8c8c8c' }}>
                      {step.icon}
                    </div>
                  )}
                </div>
                <Text strong style={{ fontSize: '14px' }}>
                  {step.title}
                </Text>
                <div style={{ marginTop: '4px' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {completedSteps.includes(index) ? 'Completed' : 
                     currentStep === index ? 'In Progress' : 'Pending'}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Main Content Area */}
      <Card style={{ borderRadius: '12px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Steps 
            current={currentStep} 
            onChange={handleStepChange}
            responsive={true}
            style={{ marginBottom: '32px' }}
          >
            {steps.map((step, index) => (
              <Step
                key={index}
                title={step.title}
                description={step.description}
                icon={step.icon}
                status={
                  completedSteps.includes(index) 
                    ? 'finish' 
                    : currentStep === index 
                    ? 'process' 
                    : 'wait'
                }
              />
            ))}
          </Steps>
        </div>

        {/* Step Content */}
        <div style={{ minHeight: '400px' }}>
          {steps[currentStep].component}
        </div>

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #f0f0f0'
        }}>
          <Button 
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(currentStep - 1)}
            size="large"
          >
            Previous
          </Button>
          
          <Space>
            {currentStep < steps.length - 1 && (
              <Button 
                type="primary" 
                size="large"
                onClick={() => handleStepComplete(currentStep)}
              >
                Next Step
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button 
                type="primary" 
                size="large"
                icon={<RocketOutlined />}
                onClick={() => handleStepComplete(currentStep)}
              >
                Submit Application
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage; 