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
  UserOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateQuestionnaireData, updateSubsectionProgress } from '../store/slices/applicationSlice';
import { QUESTIONNAIRE_SECTIONS } from '../utils/constants';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;

const PersonalInfoSubPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { questionnaireData, subsectionProgress } = useAppSelector((state: any) => state.application);
  const [form] = Form.useForm();
  const [currentSubsectionIndex, setCurrentSubsectionIndex] = useState(0);


  const personalInfoSection = QUESTIONNAIRE_SECTIONS.personal_info;
  const subsections = personalInfoSection.subsections;
  const currentSubsection = subsections[currentSubsectionIndex];

  // Calculate progress
  const completedSubsections = Object.values(subsectionProgress.personal_info || {}).filter(Boolean).length;
  const totalSubsections = subsections.length;
  const progressPercentage = (completedSubsections / totalSubsections) * 100;

  useEffect(() => {
    // Load existing data for current subsection
    const existingData = questionnaireData.personal_info?.[currentSubsection.id] || {};
    form.setFieldsValue(existingData);
  }, [currentSubsectionIndex, form, questionnaireData]);

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      
      // Save current subsection data
      dispatch(updateQuestionnaireData({
        section: 'personal_info',
        data: {
          ...questionnaireData.personal_info,
          [currentSubsection.id]: values
        }
      }));

      // Mark subsection as completed
      dispatch(updateSubsectionProgress({
        section: 'personal_info',
        subsection: currentSubsection.id,
        completed: true
      }));

      message.success(`${currentSubsection.name} saved successfully!`);

      // Move to next subsection
      if (currentSubsectionIndex < subsections.length - 1) {
        setCurrentSubsectionIndex(currentSubsectionIndex + 1);
      }
    } catch (error) {
      message.error('Please fill in all required fields.');
    }
  };

  const handlePrevious = () => {
    if (currentSubsectionIndex > 0) {
      setCurrentSubsectionIndex(currentSubsectionIndex - 1);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      dispatch(updateQuestionnaireData({
        section: 'personal_info',
        data: {
          ...questionnaireData.personal_info,
          [currentSubsection.id]: values
        }
      }));

      dispatch(updateSubsectionProgress({
        section: 'personal_info',
        subsection: currentSubsection.id,
        completed: true
      }));

      message.success(`${currentSubsection.name} saved successfully!`);
    } catch (error) {
      message.error('Please fill in all required fields.');
    }
  };

  const isSubsectionCompleted = (subsectionId: string) => {
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