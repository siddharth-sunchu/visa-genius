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
                      <div style={{ marginBottom: '16px' }}>
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
                          style={{ marginBottom: '4px' }}
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

  return (
    <div>
      {isMobile && <MobileDashboard />}
      {isDesktop && <DesktopDashboard />}
    </div>
  );
};

export default DashboardPage;