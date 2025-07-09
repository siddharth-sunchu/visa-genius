import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { 
  Layout, 
  Menu, 
  Card, 
  Typography, 
  Row, 
  Col, 
  Progress, 
  Space, 
  Avatar,
  Badge,
  List,
  Tag,
  Empty,
  Drawer,
  Button
} from 'antd';
import { 
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  MessageOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  BookOutlined,
  TeamOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  setCurrentPage,
  updateOverallProgress 
} from '../store/slices/applicationSlice';
import { APPLICATION_STEPS } from '../utils/constants';
import PersonalInfoSubPage from '../components/PersonalInfoSubPage';
import CriteriaSelectionSubPage from '../components/CriteriaSelectionSubPage';
import RecommendationLettersForm from '../components/RecommendationLettersForm';
import PetitionLetterForm from '../components/PetitionLetterForm';
import ChatInterface from '../components/ChatInterface';

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { overallProgress, subsectionProgress, questionnaireData } = useAppSelector(state => state.application);
  const { conversations } = useAppSelector((state: any) => state.chat);
  
  // Responsive breakpoints
  const isDesktop = useMediaQuery({ minWidth: 769 });
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuKey, setSelectedMenuKey] = useState('dashboard');
  const [selectedProgressSection, setSelectedProgressSection] = useState<string>('personal_info');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Calculate progress based on completed subsections
  useEffect(() => {
    const personalInfoProgress = Object.values(subsectionProgress.personal_info || {}).filter(Boolean).length;
    const totalPersonalInfoSections = 8; // Total subsections in personal info
    const progress = (personalInfoProgress / totalPersonalInfoSections) * 100;
    dispatch(updateOverallProgress(progress));
  }, [subsectionProgress, dispatch]);



  const handleMenuClick = (key: string) => {
    setSelectedMenuKey(key);
    dispatch(setCurrentPage(key));
    setMobileDrawerOpen(false); // Close mobile drawer when menu item is clicked
  };

  // Mobile Dashboard Component
  const MobileDashboard = () => (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Mobile Header */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        padding: '8px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileDrawerOpen(true)}
          style={{ fontSize: '18px', color: '#1890ff' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar size={32} icon={<UserOutlined />} />
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
            {user?.name || 'User'}
          </span>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title="Dashboard Menu"
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        width={280}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ 
          padding: '16px', 
          textAlign: 'center', 
          borderBottom: '1px solid #f0f0f0',
          marginBottom: '16px'
        }}>
          <Avatar size={64} icon={<UserOutlined />} style={{ marginBottom: '8px' }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              EB1A Applicant
            </div>
          </div>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          style={{ borderRight: 0 }}
        />
      </Drawer>

      {/* Mobile Content */}
      <div style={{ padding: '16px' }}>
        {renderContent()}
      </div>
    </div>
  );

  // Desktop Dashboard Component
  const DesktopDashboard = () => (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="light"
        style={{
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          zIndex: 1000,
        }}
      >
        <div style={{ 
          padding: '16px', 
          textAlign: 'center', 
          borderBottom: '1px solid #f0f0f0',
          marginBottom: '16px'
        }}>
          <Avatar 
            size={collapsed ? 32 : 64} 
            icon={<UserOutlined />} 
            style={{ marginBottom: collapsed ? 0 : '8px' }}
          />
          {!collapsed && (
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                EB1A Applicant
              </div>
            </div>
          )}
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      
      <Layout>
        <Content style={{ 
          margin: '24px', 
          padding: '24px', 
          background: '#f5f5f5',
          borderRadius: '12px',
          minHeight: 'calc(100vh - 48px)'
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );

  const handleProgressSectionClick = (sectionKey: string) => {
    setSelectedProgressSection(sectionKey);
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'personal-info',
      icon: <UserOutlined />,
      label: 'Personal Information',
    },
    {
      key: 'criteria-selection',
      icon: <TrophyOutlined />,
      label: 'EB1A Criteria',
    },
    {
      key: 'recommendation-letters',
      icon: <FileTextOutlined />,
      label: 'Recommendation Letters',
    },
    {
      key: 'petition-letter',
      icon: <FileTextOutlined />,
      label: 'Petition Letter',
    },
    {
      key: 'questionnaire',
      icon: <FileTextOutlined />,
      label: 'Questionnaire',
    },
    {
      key: 'documents',
      icon: <BookOutlined />,
      label: 'Documents',
    },
    {
      key: 'chat',
      icon: <MessageOutlined />,
      label: (
        <Space>
          Chat History
                     {conversations.length > 0 && (
             <Badge count={conversations.filter((c: any) => c.unreadCount > 0).length} size="small" />
           )}
        </Space>
      ),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const renderDashboardContent = () => (
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
                sectionProgress = (personalInfoCompleted / 8) * 100; // 8 subsections
                sectionCompleted = sectionProgress === 100;
                break;
              case 'criteria_selection':
                const criteriaData = questionnaireData.criteria_selection;
                sectionProgress = criteriaData?.selectedCriteria?.length > 0 ? 100 : 0;
                sectionCompleted = sectionProgress === 100;
                break;
              case 'documents':
                const documentsData = questionnaireData.documents;
                sectionProgress = documentsData?.uploadedFiles?.length > 0 ? 50 : 0;
                sectionCompleted = sectionProgress === 100;
                break;
              case 'recommendation_letters':
                const refsData = questionnaireData.recommendation_letters;
                const refsCount = refsData?.references?.length || 0;
                sectionProgress = refsCount >= 3 ? 100 : (refsCount / 3) * 100;
                sectionCompleted = sectionProgress === 100;
                break;
              case 'petition_letter':
                const petitionData = questionnaireData.petition_letter;
                const petitionSections = ['introduction', 'qualifications', 'achievements', 'contributions', 'impact', 'future_plans', 'conclusion'];
                const completedPetitionSections = petitionSections.filter(section => petitionData?.[section]).length;
                sectionProgress = (completedPetitionSections / petitionSections.length) * 100;
                sectionCompleted = sectionProgress === 100;
                break;
              case 'review':
                const allSectionsComplete = APPLICATION_STEPS.filter(s => s.key !== 'questionnaire' && s.key !== 'review')
                  .every(s => {
                    if (s.key === 'personal_info') {
                      return Object.values(subsectionProgress.personal_info || {}).filter(Boolean).length === 8;
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
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
                      animation: 'shine 3s infinite',
                      zIndex: 1
                    }} />
                  )}

                  {/* Progress bar at top */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: `linear-gradient(90deg, ${isCompleted ? '#52c41a' : '#1890ff'} ${sectionProgress}%, #f0f0f0 ${sectionProgress}%)`,
                    borderRadius: '0 0 3px 3px',
                    zIndex: 2
                  }} />
                  
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
                    {/* Top Section - Icon and Title */}
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
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '6px'
                        }}>
                          <Text style={{ 
                            fontSize: isSelected ? '14px' : '12px',
                            fontWeight: '500',
                            color: isCompleted ? '#52c41a' : isSelected ? '#1890ff' : '#8c8c8c',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}>
                            Progress
                          </Text>
                          <Text style={{ 
                            fontSize: isSelected ? '14px' : '12px',
                            fontWeight: 'bold',
                            color: isCompleted ? '#52c41a' : '#1890ff',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}>
                            {Math.round(sectionProgress)}%
                          </Text>
                        </div>
                        
                        <Progress 
                          percent={Math.round(sectionProgress)} 
                          size={collapsed ? 'default' : 'small'}
                          strokeColor={isCompleted ? "#52c41a" : "#1890ff"}
                          strokeWidth={collapsed ? 8 : 4}
                          showInfo={false}
                          style={{
                            marginBottom: '4px'
                          }}
                        />
                      </div>
                      
                      {/* Status Text */}
                      <Text style={{ 
                        fontSize: collapsed 
                          ? (isSelected ? '14px' : '12px')
                          : (isSelected ? '10px' : '9px'),
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
        
        {/* CSS Animation for shine effect */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes shine {
              0% { left: -100%; }
              100% { left: 100%; }
            }
          `
        }} />
      </Card>

      {/* Detailed Progress Sections */}
      {selectedProgressSection === 'criteria_selection' && (
        <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            EB1A Criteria Selection Progress
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
            Track your progress through each EB1A criteria category.
          </Paragraph>
          <Row gutter={[16, 16]}>
            {[
              { id: 'extraordinary_ability', name: 'Extraordinary Ability', icon: '⭐', description: 'Demonstrated extraordinary ability in sciences, arts, education, business, or athletics' },
              { id: 'national_international_recognition', name: 'National/International Recognition', icon: '🏆', description: 'Sustained national or international acclaim' },
              { id: 'major_contributions', name: 'Major Contributions', icon: '💡', description: 'Major contributions to the field' },
              { id: 'authorship', name: 'Authorship', icon: '📚', description: 'Authorship of scholarly articles in professional journals' },
              { id: 'judging', name: 'Judging', icon: '⚖️', description: 'Judging the work of others in the field' },
              { id: 'original_contributions', name: 'Original Contributions', icon: '🔬', description: 'Original scientific, scholarly, artistic, or business contributions' },
              { id: 'exhibitions', name: 'Exhibitions', icon: '🎨', description: 'Artistic exhibitions or showcases' },
              { id: 'leading_role', name: 'Leading Role', icon: '👑', description: 'Leading or critical role in distinguished organizations' },
              { id: 'high_salary', name: 'High Salary', icon: '💰', description: 'High salary or remuneration for services' },
              { id: 'commercial_success', name: 'Commercial Success', icon: '📈', description: 'Commercial success in performing arts' },
              { id: 'awards', name: 'Awards & Honors', icon: '🏅', description: 'Awards and honors for excellence' }
            ].map((criteria) => {
              const criteriaData = questionnaireData.criteria_selection?.[criteria.id];
              const isCompleted = criteriaData && Object.keys(criteriaData).length > 0;
              const progressPercentage = isCompleted ? 100 : 0;
              
              return (
                <Col xs={24} sm={12} lg={6} key={criteria.id}>
                  <Card
                    style={{
                      textAlign: 'center',
                      border: isCompleted ? '2px solid #52c41a' : '1px solid #d9d9d9',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      handleMenuClick('criteria-selection');
                      // You can add logic here to navigate to specific criteria
                    }}
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
                    <div style={{ marginBottom: '8px' }}>
                      <Progress 
                        percent={progressPercentage} 
                        size="small" 
                        showInfo={false}
                        strokeColor={isCompleted ? "#52c41a" : "#1890ff"}
                      />
                    </div>
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
      )}

      {selectedProgressSection === 'documents' && (
        <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            Document Upload Progress
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
            Track your document upload progress.
          </Paragraph>
          <Row gutter={[16, 16]}>
            {[
              { id: 'passport', name: 'Passport', icon: '📖', description: 'Valid passport copy' },
              { id: 'birth_certificate', name: 'Birth Certificate', icon: '📄', description: 'Birth certificate or equivalent' },
              { id: 'educational_documents', name: 'Educational Documents', icon: '🎓', description: 'Degrees, diplomas, certificates' },
              { id: 'employment_letters', name: 'Employment Letters', icon: '💼', description: 'Employment verification letters' },
              { id: 'awards_certificates', name: 'Awards & Certificates', icon: '🏆', description: 'Awards, honors, and recognition certificates' },
              { id: 'publications', name: 'Publications', icon: '📚', description: 'Published articles, papers, books' },
              { id: 'media_coverage', name: 'Media Coverage', icon: '📰', description: 'Media articles and coverage' },
              { id: 'financial_documents', name: 'Financial Documents', icon: '💰', description: 'Salary statements, tax returns' }
            ].map((doc) => {
              const documentsData = questionnaireData.documents?.uploadedFiles || [];
              const isUploaded = documentsData.some((file: any) => file.category === doc.id);
              
              return (
                <Col xs={24} sm={12} lg={6} key={doc.id}>
                  <Card
                    style={{
                      textAlign: 'center',
                      border: isUploaded ? '2px solid #52c41a' : '1px solid #d9d9d9',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleMenuClick('documents')}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      {doc.icon}
                    </div>
                    <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      {doc.name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                      {doc.description}
                    </Text>
                    <div>
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
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
      )}

      {selectedProgressSection === 'recommendation_letters' && (
        <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            Recommendation Letters Progress
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
            Track your recommendation letters and references.
          </Paragraph>
          <Row gutter={[16, 16]}>
            {[
              { id: 'academic_references', name: 'Academic References', icon: '🎓', description: 'Professors, researchers, academic supervisors' },
              { id: 'professional_references', name: 'Professional References', icon: '💼', description: 'Employers, colleagues, industry leaders' },
              { id: 'industry_references', name: 'Industry References', icon: '🏢', description: 'Industry partners, clients, collaborators' },
              { id: 'award_references', name: 'Award References', icon: '🏆', description: 'Award committees, recognition bodies' }
            ].map((refType) => {
              const refsData = questionnaireData.recommendation_letters?.references || [];
              const refsInCategory = refsData.filter((ref: any) => ref.recommendationType === refType.id);
              const isCompleted = refsInCategory.length >= 1;
              
              return (
                <Col xs={24} sm={12} lg={6} key={refType.id}>
                  <Card
                    style={{
                      textAlign: 'center',
                      border: isCompleted ? '2px solid #52c41a' : '1px solid #d9d9d9',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleMenuClick('recommendation-letters')}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      {refType.icon}
                    </div>
                    <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                      {refType.name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                      {refType.description}
                    </Text>
                    <div>
                      {isCompleted ? (
                        <Tag color="success" icon={<CheckCircleOutlined />}>
                          {refsInCategory.length} Reference{refsInCategory.length > 1 ? 's' : ''}
                        </Tag>
                      ) : (
                        <Tag color="default" icon={<ClockCircleOutlined />}>
                          No References
                        </Tag>
                      )}
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
      )}

      {selectedProgressSection === 'petition_letter' && (
        <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            Petition Letter Progress
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
            Track your petition letter completion progress.
          </Paragraph>
          <Row gutter={[16, 16]}>
            {[
              { id: 'introduction', name: 'Introduction', icon: '📝', description: 'Personal introduction and background' },
              { id: 'qualifications', name: 'Qualifications', icon: '🎓', description: 'Academic and professional qualifications' },
              { id: 'achievements', name: 'Achievements', icon: '🏆', description: 'Key accomplishments and recognitions' },
              { id: 'contributions', name: 'Contributions', icon: '💡', description: 'Significant contributions to the field' },
              { id: 'impact', name: 'Impact', icon: '📈', description: 'Demonstrated impact on the field' },
              { id: 'future_plans', name: 'Future Plans', icon: '🔮', description: 'Plans for continued contributions in the US' },
              { id: 'conclusion', name: 'Conclusion', icon: '✅', description: 'Summary and request for approval' }
            ].map((section) => {
              const petitionData = questionnaireData.petition_letter || {};
              const isCompleted = !!petitionData[section.id];
              
              return (
                <Col xs={24} sm={12} lg={6} key={section.id}>
                  <Card
                    style={{
                      textAlign: 'center',
                      border: isCompleted ? '2px solid #52c41a' : '1px solid #d9d9d9',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleMenuClick('petition-letter')}
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
      )}

      {/* Personal Information Progress */}
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
            { id: 'children_info', name: 'Children and Dependents', icon: '👶', description: 'Children and dependent information' },
            { id: 'immigration_history', name: 'Immigration History', icon: '📋', description: 'Previous visas and immigration history' },
            { id: 'occupation', name: 'Occupation & Employment', icon: '💼', description: 'Professional background and work history' }
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
                    opacity: isCompleted ? 1 : 0.7
                  }}
                  onClick={() => handleMenuClick('personal-info')}
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

  const renderPersonalInfo = () => (
    <PersonalInfoSubPage />
  );

  const renderCriteriaSelection = () => (
    <CriteriaSelectionSubPage />
  );

  const renderRecommendationLetters = () => (
    <RecommendationLettersForm />
  );

  const renderPetitionLetter = () => (
    <PetitionLetterForm />
  );

  const renderQuestionnaire = () => (
    <Card style={{ borderRadius: '12px' }}>
      <Title level={3}>Questionnaire</Title>
      <Paragraph type="secondary">
        Complete detailed questionnaires for your selected criteria.
      </Paragraph>
      <Empty 
        description="Questionnaire forms will be implemented here"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    </Card>
  );

  const renderDocuments = () => (
    <Card style={{ borderRadius: '12px' }}>
      <Title level={3}>Document Upload</Title>
      <Paragraph type="secondary">
        Upload supporting documents for your application.
      </Paragraph>
      <Empty 
        description="Document upload interface will be implemented here"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    </Card>
  );

    const renderChat = () => (
    <ChatInterface />
  );

  const renderSettings = () => (
    <Card style={{ borderRadius: '12px' }}>
      <Title level={3}>Settings</Title>
      <Paragraph type="secondary">
        Manage your account settings and preferences.
      </Paragraph>
      <Empty 
        description="Settings interface will be implemented here"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    </Card>
  );

  const renderContent = () => {
    switch (selectedMenuKey) {
      case 'dashboard':
        return renderDashboardContent();
      case 'personal-info':
        return renderPersonalInfo();
      case 'criteria-selection':
        return renderCriteriaSelection();
      case 'recommendation-letters':
        return renderRecommendationLetters();
      case 'petition-letter':
        return renderPetitionLetter();
      case 'questionnaire':
        return renderQuestionnaire();
      case 'documents':
        return renderDocuments();
      case 'chat':
        return renderChat();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div>
      {/* Mobile Header */}
      <div className="mobile-header" style={{ 
        display: 'none',
        background: '#fff',
        padding: '8px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileDrawerOpen(true)}
          style={{ fontSize: '18px', color: '#1890ff' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar size={32} icon={<UserOutlined />} />
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
            {user?.name || 'User'}
          </span>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title="Dashboard Menu"
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        width={280}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ 
          padding: '16px', 
          textAlign: 'center', 
          borderBottom: '1px solid #f0f0f0',
          marginBottom: '16px'
        }}>
          <Avatar size={64} icon={<UserOutlined />} style={{ marginBottom: '8px' }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              EB1A Applicant
            </div>
          </div>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          style={{ borderRight: 0 }}
        />
      </Drawer>

      {/* Mobile Content */}
      <div className="mobile-content" style={{ 
        display: 'none',
        background: '#f5f5f5',
        minHeight: 'calc(100vh - 60px)',
        padding: '16px'
      }}>
        {renderContent()}
      </div>

      {/* Desktop Layout */}
      <Layout style={{ minHeight: '100vh' }}>
        <Sider 
          collapsible 
          collapsed={collapsed} 
          onCollapse={setCollapsed}
          theme="light"
          style={{
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            zIndex: 1000,
          }}
        >
        <div style={{ 
          padding: '16px', 
          textAlign: 'center', 
          borderBottom: '1px solid #f0f0f0',
          marginBottom: '16px'
        }}>
          <Avatar 
            size={collapsed ? 32 : 64} 
            icon={<UserOutlined />} 
            style={{ marginBottom: collapsed ? 0 : '8px' }}
          />
          {!collapsed && (
            <div>
              <Text strong style={{ fontSize: '14px' }}>
                {user?.name || 'User'}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                EB1A Applicant
              </Text>
            </div>
          )}
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      
      <Layout>
        <Content style={{ 
          margin: '24px', 
          padding: '24px', 
          background: '#f5f5f5',
          borderRadius: '12px',
          minHeight: 'calc(100vh - 48px)'
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
    </div>
  );
};

export default DashboardPage; 