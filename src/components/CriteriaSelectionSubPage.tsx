import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Steps,
  Button,
  Space,
  Tag,
  Progress,
  message
} from 'antd';
import {
  TrophyOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateSubsectionProgress } from '../store/slices/applicationSlice';
import CriteriaSelectionForm from './CriteriaSelectionForm';

const { Title, Text } = Typography;
const { Step } = Steps;

interface CriteriaSection {
  id: string;
  name: string;
  description: string;
  icon: string;
  isCompleted: boolean;
}

const CriteriaSelectionSubPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { questionnaireData } = useAppSelector((state: any) => state.application);
  const [currentSection, setCurrentSection] = useState<string>('extraordinary_ability');

  const criteriaSections: CriteriaSection[] = [
    {
      id: 'extraordinary_ability',
      name: 'Extraordinary Ability',
      description: 'Demonstrated extraordinary ability in sciences, arts, education, business, or athletics',
      icon: '⭐',
      isCompleted: false
    },
    {
      id: 'national_international_recognition',
      name: 'National/International Recognition',
      description: 'Sustained national or international acclaim',
      icon: '🏆',
      isCompleted: false
    },
    {
      id: 'major_contributions',
      name: 'Major Contributions',
      description: 'Major contributions to the field',
      icon: '💡',
      isCompleted: false
    },
    {
      id: 'authorship',
      name: 'Authorship',
      description: 'Authorship of scholarly articles in professional journals',
      icon: '📚',
      isCompleted: false
    },
    {
      id: 'judging',
      name: 'Judging',
      description: 'Judging the work of others in the field',
      icon: '⚖️',
      isCompleted: false
    },
    {
      id: 'original_contributions',
      name: 'Original Contributions',
      description: 'Original scientific, scholarly, artistic, or business contributions',
      icon: '🔬',
      isCompleted: false
    },
    {
      id: 'exhibitions',
      name: 'Exhibitions',
      description: 'Artistic exhibitions or showcases',
      icon: '🎨',
      isCompleted: false
    },
    {
      id: 'leading_role',
      name: 'Leading Role',
      description: 'Leading or critical role in distinguished organizations',
      icon: '👑',
      isCompleted: false
    },
    {
      id: 'high_salary',
      name: 'High Salary',
      description: 'High salary or remuneration for services',
      icon: '💰',
      isCompleted: false
    },
    {
      id: 'commercial_success',
      name: 'Commercial Success',
      description: 'Commercial success in performing arts',
      icon: '📈',
      isCompleted: false
    },
    {
      id: 'awards',
      name: 'Awards & Honors',
      description: 'Awards and honors for excellence',
      icon: '🏅',
      isCompleted: false
    }
  ];

  // Update completion status based on data
  useEffect(() => {
    const updatedSections = criteriaSections.map(section => ({
      ...section,
      isCompleted: !!(questionnaireData.criteria_selection?.[section.id] && 
        Object.keys(questionnaireData.criteria_selection[section.id]).length > 0)
    }));
    // You can set state here if needed
  }, [questionnaireData.criteria_selection]);

  const handleSectionClick = (sectionId: string) => {
    setCurrentSection(sectionId);
  };

  const handleSave = async () => {
    try {
      // This would be handled by the CriteriaSelectionForm component
      message.success('Criteria information saved successfully!');
      
      // Update subsection progress
      dispatch(updateSubsectionProgress({
        section: 'criteria_selection',
        subsection: currentSection,
        completed: true
      }));
    } catch (error) {
      message.error('Please fill in all required fields');
    }
  };

  const handleNext = () => {
    const currentIndex = criteriaSections.findIndex(section => section.id === currentSection);
    if (currentIndex < criteriaSections.length - 1) {
      setCurrentSection(criteriaSections[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = criteriaSections.findIndex(section => section.id === currentSection);
    if (currentIndex > 0) {
      setCurrentSection(criteriaSections[currentIndex - 1].id);
    }
  };

  const completedSections = criteriaSections.filter(section => section.isCompleted).length;
  const progressPercentage = (completedSections / criteriaSections.length) * 100;

  return (
    <div>

      {/* Progress Overview */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row align="middle" justify="space-between" style={{ marginBottom: '16px' }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              Progress: {completedSections} of {criteriaSections.length} criteria completed
            </Title>
            <Text type="secondary">
              {progressPercentage === 100 ? '✅ All criteria completed!' : 'Continue completing criteria sections'}
            </Text>
          </Col>
          <Col>
            <Progress 
              type="circle" 
              percent={Math.round(progressPercentage)} 
              size={60}
              strokeColor={progressPercentage === 100 ? "#52c41a" : "#1890ff"}
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Criteria Navigation */}
        <Col xs={24} lg={8}>
          <Card style={{ borderRadius: '12px' }}>
            <Title level={4} style={{ marginBottom: '16px' }}>
              Criteria Sections
            </Title>
            <Steps
              direction="vertical"
              current={criteriaSections.findIndex(section => section.id === currentSection)}
              size="small"
            >
              {criteriaSections.map((section, index) => (
                <Step
                  key={section.id}
                  title={
                    <Space>
                      <Text strong>{section.name}</Text>
                      {section.isCompleted && (
                        <Tag color="success" icon={<CheckCircleOutlined />}>
                          Done
                        </Tag>
                      )}
                    </Space>
                  }
                  description={
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {section.description}
                      </Text>
                    </div>
                  }
                  status={section.isCompleted ? 'finish' : currentSection === section.id ? 'process' : 'wait'}
                  onClick={() => handleSectionClick(section.id)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Steps>
          </Card>
        </Col>

        {/* Criteria Form */}
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Title level={4} style={{ margin: 0 }}>
                {criteriaSections.find(s => s.id === currentSection)?.name}
              </Title>
              <Text type="secondary">
                {criteriaSections.find(s => s.id === currentSection)?.description}
              </Text>
            </div>

                         {/* Render the specific criteria form */}
             <CriteriaSelectionForm />

            {/* Navigation Buttons */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={handlePrevious}
                disabled={criteriaSections.findIndex(section => section.id === currentSection) === 0}
              >
                Previous
              </Button>
              
              <Space>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                >
                  Save
                </Button>
                
                <Button
                  type="primary"
                  icon={<ArrowRightOutlined />}
                  onClick={handleNext}
                  disabled={criteriaSections.findIndex(section => section.id === currentSection) === criteriaSections.length - 1}
                >
                  Next
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tips Card */}
      <Card style={{ marginTop: '24px', borderRadius: '12px' }}>
        <Title level={4} style={{ marginBottom: '16px' }}>
          Tips for EB1A Criteria Selection
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card size="small" style={{ backgroundColor: '#f6ffed' }}>
              <Title level={5}>Choose Wisely</Title>
              <Text>Select criteria that you can provide strong evidence for. Quality over quantity.</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card size="small" style={{ backgroundColor: '#fff7e6' }}>
              <Title level={5}>Provide Evidence</Title>
              <Text>Include specific examples, dates, and supporting documents for each criterion.</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card size="small" style={{ backgroundColor: '#f0f9ff' }}>
              <Title level={5}>Be Specific</Title>
              <Text>Use concrete examples and measurable achievements rather than general statements.</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card size="small" style={{ backgroundColor: '#fef2f2' }}>
              <Title level={5}>Show Impact</Title>
              <Text>Demonstrate how your work has influenced your field and benefited others.</Text>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default CriteriaSelectionSubPage; 