import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Progress, 
  Space, 
  Avatar,
  Badge,
  List,
  Tag
} from 'antd';
import { 
  UserOutlined,
  FileTextOutlined,
  TrophyOutlined,
  BookOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  updateOverallProgress 
} from '../store/slices/applicationSlice';
import { APPLICATION_STEPS } from '../utils/constants';

const { Title, Text, Paragraph } = Typography;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { overallProgress, subsectionProgress, questionnaireData } = useAppSelector(state => state.application);
  const { conversations } = useAppSelector((state: any) => state.chat);
  
  const [selectedProgressSection, setSelectedProgressSection] = useState<string>('personal_info');

  // Calculate progress based on completed subsections
  useEffect(() => {
    const personalInfoProgress = Object.values(subsectionProgress.personal_info || {}).filter(Boolean).length;
    const totalPersonalInfoSections = 8; // Total subsections in personal info
    const progress = (personalInfoProgress / totalPersonalInfoSections) * 100;
    dispatch(updateOverallProgress(progress));
  }, [subsectionProgress, dispatch]);

  const handleProgressSectionClick = (sectionKey: string) => {
    setSelectedProgressSection(sectionKey);
  };

  return (
    <div>
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
                percent={Math.round(overallProgress)} 
                size={80}
                strokeColor="#52c41a"
              />
              <div style={{ marginTop: '8px' }}>
                <Text strong>{Math.round(overallProgress)}% Complete</Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Application Progress */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Title level={4} style={{ marginBottom: '24px', textAlign: 'center' }}>
          Application Progress
        </Title>
        
        {/* Progress Container */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px', 
          padding: '20px 0',
          width: '100%',
          minHeight: '320px'
        }}>
          {APPLICATION_STEPS.filter(step => step.key !== 'questionnaire').map((step, index) => {
            // Calculate progress for each section
            let sectionProgress = 0;
            let sectionCompleted = false;
            
            switch (step.key) {
              case 'personal_info':
                const personalInfoCompleted = Object.values(subsectionProgress.personal_info || {}).filter(Boolean).length;
                sectionProgress = (personalInfoCompleted / 8) * 100;
                sectionCompleted = sectionProgress === 100;
                break;
              case 'criteria_selection':
                const criteriaData = questionnaireData.criteria_selection?.selectedCriteria || [];
                sectionProgress = criteriaData.length > 0 ? 100 : 0;
                sectionCompleted = criteriaData.length > 0;
                break;
              case 'documents':
                const uploadedFiles = questionnaireData.documents?.uploadedFiles || [];
                const requiredDocuments = ['passport', 'visa', 'i94', 'resume', 'education', 'employment', 'references'];
                const uploadedRequired = uploadedFiles.filter((doc: any) => requiredDocuments.includes(doc.category)).length;
                sectionProgress = (uploadedRequired / requiredDocuments.length) * 100;
                sectionCompleted = uploadedRequired === requiredDocuments.length;
                break;
              case 'recommendation_letters':
                const refsData = questionnaireData.recommendation_letters?.references || [];
                sectionProgress = refsData.length > 0 ? 100 : 0;
                sectionCompleted = refsData.length > 0;
                break;
              case 'petition_letter':
                const petitionData = questionnaireData.petition_letter || {};
                const petitionSections = Object.keys(petitionData).length;
                sectionProgress = (petitionSections / 7) * 100;
                sectionCompleted = petitionSections === 7;
                break;
              case 'review':
                const allSectionsComplete = APPLICATION_STEPS.filter(s => s.key !== 'questionnaire' && s.key !== 'review')
                  .every(s => {
                    if (s.key === 'personal_info') {
                      return Object.values(subsectionProgress.personal_info || {}).filter(Boolean).length === 8;
                    }
                    if (s.key === 'documents') {
                      const uploadedFiles = questionnaireData.documents?.uploadedFiles || [];
                      const requiredDocuments = ['passport', 'visa', 'i94', 'resume', 'education', 'employment', 'references'];
                      const uploadedRequired = uploadedFiles.filter((doc: any) => requiredDocuments.includes(doc.category)).length;
                      return uploadedRequired === requiredDocuments.length;
                    }
                    return questionnaireData[s.key] && Object.keys(questionnaireData[s.key]).length > 0;
                  });
                sectionProgress = allSectionsComplete ? 100 : 0;
                sectionCompleted = sectionProgress === 100;
                break;
            }

            const isSelected = selectedProgressSection === step.key;
            const isCompleted = sectionCompleted;
            const totalSteps = APPLICATION_STEPS.filter(step => step.key !== 'questionnaire').length;
            const gapTotal = (totalSteps - 1) * 12; // 12px gap between cards
            const selectedCardExtraWidth = 40;
            
            // Calculate base width considering one card will be larger
            const baseWidth = `calc((100% - ${gapTotal}px - ${selectedCardExtraWidth}px) / ${totalSteps})`;
            const selectedWidth = `calc((100% - ${gapTotal}px - ${selectedCardExtraWidth}px) / ${totalSteps} + ${selectedCardExtraWidth}px)`;

            return (
              <div
                key={step.key}
                style={{
                  width: isSelected ? selectedWidth : baseWidth,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  flexShrink: 0
                }}
                onClick={() => handleProgressSectionClick(step.key)}
              >
                {/* Progress Card */}
                <div 
                  style={{ 
                    background: isSelected 
                      ? 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)' 
                      : isCompleted 
                        ? 'linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)'
                        : 'white',
                    border: isSelected 
                      ? '3px solid #1890ff' 
                      : isCompleted 
                        ? '2px solid #52c41a' 
                        : '2px solid #e8e8e8',
                    borderRadius: '16px',
                    boxShadow: isSelected 
                      ? '0 12px 40px rgba(24, 144, 255, 0.25), 0 4px 20px rgba(24, 144, 255, 0.15)' 
                      : isCompleted 
                        ? '0 8px 25px rgba(82, 196, 26, 0.2), 0 4px 15px rgba(82, 196, 26, 0.1)'
                        : '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.05)',
                    padding: isSelected ? '28px 20px' : '24px 16px',
                    height: isSelected ? '300px' : '280px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {/* Shine effect for selected card */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '-50%',
                      left: '-50%',
                      width: '200%',
                      height: '200%',
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                      animation: 'shine 2s infinite',
                      zIndex: 1
                    }} />
                  )}

                  {/* Step number badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: isSelected ? '32px' : '28px',
                    height: isSelected ? '32px' : '28px',
                    borderRadius: '50%',
                    background: isCompleted 
                      ? 'linear-gradient(135deg, #52c41a, #73d13d)' 
                      : isSelected 
                        ? 'linear-gradient(135deg, #1890ff, #40a9ff)'
                        : '#f0f0f0',
                    color: 'white',
                    fontSize: isSelected ? '16px' : '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    boxShadow: isSelected 
                      ? '0 4px 12px rgba(24, 144, 255, 0.4)' 
                      : isCompleted 
                        ? '0 4px 12px rgba(82, 196, 26, 0.4)'
                        : 'none',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 3
                  }}>
                    {step.order}
                  </div>

                  {/* Content Container */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'space-between',
                    zIndex: 3,
                    position: 'relative'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: isSelected ? '42px' : '36px', 
                        marginBottom: isSelected ? '16px' : '12px',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}>
                        {step.icon}
                      </div>
                      
                      <Text strong style={{ 
                        fontSize: isSelected ? '18px' : '16px',
                        display: 'block',
                        marginBottom: isSelected ? '12px' : '8px',
                        color: isSelected ? '#1890ff' : '#262626',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}>
                        {step.title}
                      </Text>
                      
                      <Text type="secondary" style={{ 
                        fontSize: isSelected ? '14px' : '12px',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: isSelected ? 4 : 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}>
                        {step.description}
                      </Text>
                    </div>

                    {/* Bottom Section - Progress */}
                    <div style={{ textAlign: 'center' }}>
                      {/* Horizontal Progress Bar */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <Text style={{ 
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: isCompleted ? '#52c41a' : '#1890ff',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}>
                          {Math.round(sectionProgress)}%
                        </Text>
                      </div>
                      
                      <Progress 
                        percent={Math.round(sectionProgress)} 
                        size="small"
                        strokeColor={isCompleted ? "#52c41a" : "#1890ff"}
                        strokeWidth={4}
                        showInfo={false}
                        style={{
                          marginBottom: '4px'
                        }}
                      />
                      
                      {/* Status Text */}
                      <Text style={{ 
                        fontSize: '9px',
                        fontWeight: '500',
                        color: isCompleted ? '#52c41a' : isSelected ? '#1890ff' : '#8c8c8c',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}>
                        {isCompleted ? 'Completed' : Math.round(sectionProgress) > 0 ? 'In Progress' : 'Not Started'}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Detailed Progress Section */}
      {selectedProgressSection && (
        <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
          
          {selectedProgressSection === 'personal_info' && (
            <div>
              <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
                <Title level={4} style={{ marginBottom: '16px' }}>
                  Personal Information Progress
                </Title>
                <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
                  Track your progress through each section of personal information.
                </Paragraph>
                <Row gutter={[16, 16]}>
                  {[
                    { id: 'basic_info', name: 'Basic Information', icon: '👤', description: 'Personal details and identification' },
                    { id: 'current_status', name: 'Current Immigration Status', icon: '🌍', description: 'Current visa and status information' },
                    { id: 'current_address', name: 'Current Home Address', icon: '🏠', description: 'Residential address details' },
                    { id: 'family_life', name: 'Family Life', icon: '👨‍👩‍👧‍👦', description: 'Marital status and family information' },
                    { id: 'spouse_info', name: 'Spouse Information', icon: '💑', description: 'Detailed spouse information' },
                    { id: 'education', name: 'Education Background', icon: '🎓', description: 'Academic qualifications and institutions' },
                    { id: 'employment', name: 'Employment History', icon: '💼', description: 'Professional background and work history' },
                    { id: 'contact_info', name: 'Contact Information', icon: '📞', description: 'Email, phone, and emergency contacts' }
                  ].map((section) => {
                    const isCompleted = subsectionProgress.personal_info?.[section.id] || false;
                    return (
                      <Col xs={24} sm={12} lg={6} key={section.id}>
                        <Card
                          style={{
                            textAlign: 'center',
                            border: isCompleted ? '2px solid #52c41a' : '1px solid #d9d9d9',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            opacity: isCompleted ? 1 : 0.7,
                            transition: 'all 0.3s ease'
                          }}
                          onClick={() => handleProgressSectionClick('personal_info')}
                        >
                          <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                            {section.icon}
                          </div>
                          <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                            {section.name}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                            {section.description}
                          </Text>
                          <div>
                            {isCompleted ? (
                              <Tag color="success" icon={<CheckCircleOutlined />}>
                                Completed
                              </Tag>
                            ) : (
                              <Tag color="default" icon={<ClockCircleOutlined />}>
                                Pending
                              </Tag>
                            )}
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </Card>
            </div>
          )}

          {selectedProgressSection === 'criteria_selection' && (
            <div>
              <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
                <Title level={4} style={{ marginBottom: '16px' }}>
                  EB1A Criteria Selection Progress
                </Title>
                <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
                  Select the EB1A criteria that apply to your case. You need at least 3 criteria to qualify.
                </Paragraph>
                <Row gutter={[16, 16]}>
                  {[
                    { id: 'extraordinary_ability', name: 'Extraordinary Ability', icon: '⭐', description: 'Demonstrated extraordinary ability in your field' },
                    { id: 'national_recognition', name: 'National Recognition', icon: '🏆', description: 'Sustained national or international acclaim' },
                    { id: 'major_contributions', name: 'Major Contributions', icon: '💡', description: 'Major contributions to your field' },
                    { id: 'authorship', name: 'Authorship', icon: '📚', description: 'Scholarly articles in professional journals' },
                    { id: 'judging', name: 'Judging Work', icon: '⚖️', description: 'Judging the work of others in your field' },
                    { id: 'original_contributions', name: 'Original Contributions', icon: '🔬', description: 'Original scientific or scholarly contributions' },
                    { id: 'exhibitions', name: 'Exhibitions', icon: '🎨', description: 'Artistic exhibitions or showcases' },
                    { id: 'leading_role', name: 'Leading Role', icon: '👑', description: 'Leading role in distinguished organizations' },
                    { id: 'high_salary', name: 'High Salary', icon: '💰', description: 'High salary or remuneration for services' },
                    { id: 'commercial_success', name: 'Commercial Success', icon: '📈', description: 'Commercial success in performing arts' },
                    { id: 'awards', name: 'Awards & Honors', icon: '🏅', description: 'Awards and honors for excellence' }
                  ].map((criteria) => {
                    const isSelected = questionnaireData.criteria_selection?.selectedCriteria?.includes(criteria.name) || false;
                    return (
                      <Col xs={24} sm={12} lg={6} key={criteria.id}>
                        <Card
                          style={{
                            textAlign: 'center',
                            border: isSelected ? '2px solid #52c41a' : '1px solid #d9d9d9',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            opacity: isSelected ? 1 : 0.7,
                            transition: 'all 0.3s ease'
                          }}
                          onClick={() => handleProgressSectionClick('criteria_selection')}
                        >
                          <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                            {criteria.icon}
                          </div>
                          <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                            {criteria.name}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                            {criteria.description}
                          </Text>
                          <div>
                            {isSelected ? (
                              <Tag color="success" icon={<CheckCircleOutlined />}>
                                Selected
                              </Tag>
                            ) : (
                              <Tag color="default" icon={<ClockCircleOutlined />}>
                                Available
                              </Tag>
                            )}
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </Card>
            </div>
          )}

          {selectedProgressSection === 'recommendation_letters' && (
            <div>
              <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
                <Title level={4} style={{ marginBottom: '16px' }}>
                  Recommendation Letters Progress
                </Title>
                <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
                  Add references who can provide strong recommendation letters. We recommend at least 3-5 references.
                </Paragraph>
                
                {/* Current References */}
                <Row gutter={[16, 16]}>
                  {questionnaireData.recommendation_letters?.references?.map((reference: any, index: number) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                      <Card
                        style={{
                          textAlign: 'center',
                          border: reference.isCompleted ? '2px solid #52c41a' : '1px solid #d9d9d9',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          opacity: reference.isCompleted ? 1 : 0.7,
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => handleProgressSectionClick('recommendation_letters')}
                      >
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                          👤
                        </div>
                        <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                          {reference.name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                          {reference.title} at {reference.organization}
                        </Text>
                        <div>
                          {reference.isCompleted ? (
                            <Tag color="success" icon={<CheckCircleOutlined />}>
                              Complete
                            </Tag>
                          ) : (
                            <Tag color="warning" icon={<ClockCircleOutlined />}>
                              Incomplete
                            </Tag>
                          )}
                        </div>
                      </Card>
                    </Col>
                  ))}
                  {(!questionnaireData.recommendation_letters?.references || questionnaireData.recommendation_letters.references.length === 0) && (
                    <Col span={24}>
                      <Card style={{ textAlign: 'center', backgroundColor: '#fafafa', padding: '40px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                        <Text type="secondary" style={{ fontSize: '16px' }}>
                          No references added yet. Click on the card above to start adding your recommendation letters.
                        </Text>
                      </Card>
                    </Col>
                  )}
                </Row>
              </Card>
              
              {/* Required Information */}
              <Card style={{ borderRadius: '12px' }}>
                <Title level={5} style={{ marginBottom: '16px' }}>Required Reference Information</Title>
                <Row gutter={[16, 16]}>
                  {[
                    { name: 'Full Name', icon: '👤', description: 'Complete name of the reference' },
                    { name: 'Title & Organization', icon: '🏢', description: 'Professional title and company' },
                    { name: 'Email & Phone', icon: '📞', description: 'Contact information' },
                    { name: 'Years Known', icon: '⏰', description: 'How long you have known them' },
                    { name: 'Relationship Type', icon: '🤝', description: 'Professional relationship details' },
                    { name: 'Specific Examples', icon: '📋', description: 'Concrete examples of your work' },
                    { name: 'Professional Qualifications', icon: '🎓', description: 'Their qualifications and credentials' }
                  ].map((info) => (
                    <Col xs={24} sm={12} lg={6} key={info.name}>
                      <Card
                        style={{
                          textAlign: 'center',
                          border: '1px solid #d9d9d9',
                          borderRadius: '8px',
                          opacity: 0.7
                        }}
                      >
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                          {info.icon}
                        </div>
                        <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '2px' }}>
                          {info.name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '10px', display: 'block' }}>
                          {info.description}
                        </Text>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </div>
          )}

          {selectedProgressSection === 'petition_letter' && (
            <div>
              <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
                <Title level={4} style={{ marginBottom: '16px' }}>
                  Petition Letter Progress
                </Title>
                <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
                  Complete each section of your EB1A petition letter to build a compelling case.
                </Paragraph>
                <Row gutter={[16, 16]}>
                  {[
                    { id: 'introduction', name: 'Introduction', icon: '📝', description: 'Personal background and introduction' },
                    { id: 'qualifications', name: 'Qualifications', icon: '🎓', description: 'Academic and professional qualifications' },
                    { id: 'achievements', name: 'Achievements', icon: '🏆', description: 'Key accomplishments and recognitions' },
                    { id: 'contributions', name: 'Contributions', icon: '💡', description: 'Significant contributions to the field' },
                    { id: 'impact', name: 'Impact', icon: '📈', description: 'Demonstrated impact and influence' },
                    { id: 'future_plans', name: 'Future Plans', icon: '🔮', description: 'Plans for continued contributions in US' },
                    { id: 'conclusion', name: 'Conclusion', icon: '✅', description: 'Summary and request for approval' }
                  ].map((section) => {
                    const isCompleted = !!(questionnaireData.petition_letter?.[section.id]);
                    return (
                      <Col xs={24} sm={12} lg={6} key={section.id}>
                        <Card
                          style={{
                            textAlign: 'center',
                            border: isCompleted ? '2px solid #52c41a' : '1px solid #d9d9d9',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            opacity: isCompleted ? 1 : 0.7,
                            transition: 'all 0.3s ease'
                          }}
                          onClick={() => handleProgressSectionClick('petition_letter')}
                        >
                          <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                            {section.icon}
                          </div>
                          <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                            {section.name}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                            {section.description}
                          </Text>
                          <div>
                            {isCompleted ? (
                              <Tag color="success" icon={<CheckCircleOutlined />}>
                                Written
                              </Tag>
                            ) : (
                              <Tag color="default" icon={<ClockCircleOutlined />}>
                                Pending
                              </Tag>
                            )}
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </Card>
            </div>
          )}

          {selectedProgressSection === 'documents' && (
            <div>
              {/* Document Upload Progress */}
              <Card style={{ marginBottom: '16px', borderRadius: '12px' }}>
                <Title level={4} style={{ marginBottom: '16px' }}>
                  Document Upload Progress
                </Title>
                <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
                  Upload all required documents for your EB1A application. Make sure all documents are clear and legible.
                </Paragraph>
                
                {/* Progress Overview */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                  <Col xs={24} sm={8}>
                    <Card size="small" style={{ textAlign: 'center', backgroundColor: '#f6ffed', border: '2px solid #52c41a' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>📄</div>
                      <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '4px' }}>
                        {questionnaireData.documents?.uploadedFiles?.length || 0}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Total Documents
                      </Text>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card size="small" style={{ textAlign: 'center', backgroundColor: '#fff7e6', border: '2px solid #faad14' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
                      <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '4px' }}>
                        {questionnaireData.documents?.uploadedFiles?.filter((doc: any) => 
                          ['passport', 'visa', 'i94', 'resume', 'education', 'employment', 'references'].includes(doc.category)
                        ).length || 0}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Required Uploaded
                      </Text>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card size="small" style={{ textAlign: 'center', backgroundColor: '#fff2f0', border: '2px solid #ff4d4f' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
                      <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '4px' }}>
                        {7 - (questionnaireData.documents?.uploadedFiles?.filter((doc: any) => 
                          ['passport', 'visa', 'i94', 'resume', 'education', 'employment', 'references'].includes(doc.category)
                        ).length || 0)}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Required Pending
                      </Text>
                    </Card>
                  </Col>
                </Row>

                {/* Progress Bar */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text strong>Overall Progress</Text>
                    <Text strong>
                      {Math.round(((questionnaireData.documents?.uploadedFiles?.filter((doc: any) => 
                        ['passport', 'visa', 'i94', 'resume', 'education', 'employment', 'references'].includes(doc.category)
                      ).length || 0) / 7) * 100)}%
                    </Text>
                  </div>
                  <Progress 
                    percent={Math.round(((questionnaireData.documents?.uploadedFiles?.filter((doc: any) => 
                      ['passport', 'visa', 'i94', 'resume', 'education', 'employment', 'references'].includes(doc.category)
                    ).length || 0) / 7) * 100)} 
                    strokeColor="#52c41a"
                    strokeWidth={8}
                    showInfo={false}
                  />
                </div>
              </Card>

              {/* Required Documents Status - Sorted by Uploaded/Pending */}
              <Card style={{ marginBottom: '16px', borderRadius: '12px' }}>
                <Title level={5} style={{ marginBottom: '12px' }}>Required Documents Status</Title>
                {(() => {
                  const requiredDocs = [
                    { id: 'passport', name: 'Passport', icon: '🛂', description: 'Valid passport with at least 6 months validity' },
                    { id: 'visa', name: 'Current Visa', icon: '🌍', description: 'Current visa documentation' },
                    { id: 'i94', name: 'I-94 Form', icon: '📋', description: 'Most recent I-94 arrival/departure record' },
                    { id: 'resume', name: 'Resume/CV', icon: '📄', description: 'Detailed professional resume' },
                    { id: 'education', name: 'Educational Certificates', icon: '🎓', description: 'Academic qualifications and degrees' },
                    { id: 'employment', name: 'Employment Letters', icon: '💼', description: 'Current and previous employment letters' },
                    { id: 'references', name: 'Reference Letters', icon: '📝', description: 'Professional recommendation letters' }
                  ];

                  // Sort by uploaded first, then pending
                  const sortedDocs = requiredDocs.sort((a, b) => {
                    const aUploaded = questionnaireData.documents?.uploadedFiles?.some((uploaded: any) => uploaded.category === a.id);
                    const bUploaded = questionnaireData.documents?.uploadedFiles?.some((uploaded: any) => uploaded.category === b.id);
                    return bUploaded ? 1 : aUploaded ? -1 : 0;
                  });

                  return sortedDocs.map((doc, index) => {
                    const isUploaded = questionnaireData.documents?.uploadedFiles?.some((uploaded: any) => uploaded.category === doc.id);
                    return (
                      <div key={doc.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '12px 0',
                        borderBottom: index < 6 ? '1px solid #f0f0f0' : 'none',
                        opacity: isUploaded ? 1 : 0.7
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <div style={{ fontSize: '16px', marginRight: '12px' }}>{doc.icon}</div>
                          <div>
                            <Text strong style={{ display: 'block', fontSize: '14px' }}>
                              {doc.name}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {doc.description}
                            </Text>
                          </div>
                        </div>
                        {isUploaded ? (
                          <Tag color="success" icon={<CheckCircleOutlined />}>
                            Uploaded
                          </Tag>
                        ) : (
                          <Tag color="default" icon={<ClockCircleOutlined />}>
                            Pending
                          </Tag>
                        )}
                      </div>
                    );
                  });
                })()}
              </Card>

              {/* Additional Documents */}
              <Card style={{ borderRadius: '12px' }}>
                <Title level={5} style={{ marginBottom: '12px' }}>Additional Documents</Title>
                {questionnaireData.documents?.uploadedFiles?.filter((doc: any) => 
                  !['passport', 'visa', 'i94', 'resume', 'education', 'employment', 'references'].includes(doc.category)
                ).map((doc: any, index: number) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: index < (questionnaireData.documents?.uploadedFiles?.filter((doc: any) => 
                      !['passport', 'visa', 'i94', 'resume', 'education', 'employment', 'references'].includes(doc.category)
                    ).length || 0) - 1 ? '1px solid #f0f0f0' : 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <div style={{ fontSize: '16px', marginRight: '12px' }}>📄</div>
                      <div>
                        <Text strong style={{ display: 'block', fontSize: '14px' }}>
                          {doc.category}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {doc.title || doc.name}
                        </Text>
                      </div>
                    </div>
                    <Tag color="success" icon={<CheckCircleOutlined />}>
                      Uploaded
                    </Tag>
                  </div>
                ))}
                {(!questionnaireData.documents?.uploadedFiles?.filter((doc: any) => 
                  !['passport', 'visa', 'i94', 'resume', 'education', 'employment', 'references'].includes(doc.category)
                ) || questionnaireData.documents.uploadedFiles.filter((doc: any) => 
                  !['passport', 'visa', 'i94', 'resume', 'education', 'employment', 'references'].includes(doc.category)
                ).length === 0) && (
                  <div style={{ textAlign: 'center', padding: '24px', color: '#8c8c8c' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>📁</div>
                    <Text type="secondary">No additional documents uploaded yet.</Text>
                  </div>
                )}
              </Card>
            </div>
          )}

          {selectedProgressSection === 'review' && (
            <div>
              <Row gutter={[16, 16]}>
                {APPLICATION_STEPS.filter(step => step.key !== 'questionnaire' && step.key !== 'review').map((step) => {
                  let isCompleted = false;
                  let progressText = '';
                  
                  switch (step.key) {
                    case 'personal_info':
                      isCompleted = Object.values(subsectionProgress.personal_info || {}).filter(Boolean).length === 8;
                      progressText = `${Object.values(subsectionProgress.personal_info || {}).filter(Boolean).length} of 8 sections completed`;
                      break;
                    case 'criteria_selection':
                      isCompleted = (questionnaireData.criteria_selection?.selectedCriteria?.length || 0) > 0;
                      progressText = `${questionnaireData.criteria_selection?.selectedCriteria?.length || 0} criteria selected`;
                      break;
                    case 'recommendation_letters':
                      isCompleted = (questionnaireData.recommendation_letters?.references?.length || 0) > 0;
                      progressText = `${questionnaireData.recommendation_letters?.references?.length || 0} references added`;
                      break;
                    case 'petition_letter':
                      const petitionSections = Object.keys(questionnaireData.petition_letter || {}).length;
                      isCompleted = petitionSections === 7;
                      progressText = `${petitionSections} of 7 sections completed`;
                      break;
                    case 'documents':
                      isCompleted = (questionnaireData.documents?.uploadedFiles?.length || 0) > 0;
                      progressText = `${questionnaireData.documents?.uploadedFiles?.length || 0} documents uploaded`;
                      break;
                  }
                  
                  return (
                    <Col xs={24} sm={12} md={8} key={step.key}>
                      <Card size="small" style={{ 
                        border: isCompleted ? '2px solid #52c41a' : '1px solid #d9d9d9',
                        backgroundColor: isCompleted ? '#f6ffed' : 'white'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text strong>{step.title}</Text>
                          {isCompleted ? (
                            <Tag color="success" icon={<CheckCircleOutlined />}>Ready</Tag>
                          ) : (
                            <Tag color="warning">Incomplete</Tag>
                          )}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {progressText}
                        </Text>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}
        </Card>
      )}

      {/* Recent Activity */}
      <Card style={{ borderRadius: '12px' }}>
        <Title level={4} style={{ marginBottom: '16px' }}>
          Recent Activity
        </Title>
        <List
          itemLayout="horizontal"
          dataSource={[
            {
              title: 'Personal Information Progress',
              description: `${Object.values(subsectionProgress.personal_info || {}).filter(Boolean).length} of 8 sections completed`,
              time: 'Just now',
              icon: <UserOutlined style={{ color: '#52c41a' }} />
            },
            {
              title: 'EB1A Criteria Selection',
              description: `${questionnaireData.criteria_selection?.selectedCriteria?.length || 0} criteria selected`,
              time: 'Recently',
              icon: <TrophyOutlined style={{ color: '#faad14' }} />
            },
            {
              title: 'Document Upload',
              description: `${questionnaireData.documents?.uploadedFiles?.length || 0} documents uploaded`,
              time: 'Recently',
              icon: <BookOutlined style={{ color: '#1890ff' }} />
            },
            {
              title: 'Recommendation Letters',
              description: `${questionnaireData.recommendation_letters?.references?.length || 0} references added`,
              time: 'Recently',
              icon: <FileTextOutlined style={{ color: '#1890ff' }} />
            },
            {
              title: 'Petition Letter',
              description: `${Object.keys(questionnaireData.petition_letter || {}).length} of 7 sections completed`,
              time: 'Recently',
              icon: <FileTextOutlined style={{ color: '#52c41a' }} />
            },
            {
              title: 'Application Started',
              description: 'Your EB1A application process has begun',
              time: '1 day ago',
              icon: <FileTextOutlined style={{ color: '#1890ff' }} />
            },
            {
              title: 'Case Manager Assigned',
              description: 'Your case manager will contact you soon',
              time: '2 days ago',
              icon: <TeamOutlined style={{ color: '#722ed1' }} />
            }
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={item.icon} />}
                title={item.title}
                description={item.description}
              />
              <Text type="secondary">{item.time}</Text>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default DashboardPage; 