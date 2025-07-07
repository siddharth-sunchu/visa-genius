import React, { useState, useEffect } from 'react';
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
  Empty
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
  TeamOutlined
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  setCurrentPage,
  updateOverallProgress 
} from '../store/slices/applicationSlice';
import { APPLICATION_STEPS } from '../utils/constants';
import PersonalInfoSubPage from '../components/PersonalInfoSubPage';
import CriteriaSelectionForm from '../components/CriteriaSelectionForm';
import RecommendationLettersForm from '../components/RecommendationLettersForm';
import ChatInterface from '../components/ChatInterface';

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { currentPage, overallProgress, subsectionProgress } = useAppSelector(state => state.application);
  const { conversations } = useAppSelector((state: any) => state.chat);
  
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuKey, setSelectedMenuKey] = useState('dashboard');

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
        <Title level={4} style={{ marginBottom: '16px' }}>
          Application Progress
        </Title>
        <Row gutter={[16, 16]}>
          {APPLICATION_STEPS.map((step, index) => (
            <Col xs={24} sm={12} lg={6} key={step.key}>
              <Card 
                size="small" 
                style={{ 
                  textAlign: 'center',
                  border: currentPage === step.key ? '2px solid #1890ff' : '1px solid #d9d9d9',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
                onClick={() => handleMenuClick(step.key)}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                  {step.icon}
                </div>
                <Text strong style={{ fontSize: '14px' }}>
                  {step.title}
                </Text>
                <div style={{ marginTop: '4px' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {step.description}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

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
              title: 'Recommendation Letters',
              description: `${subsectionProgress.recommendation_letters?.references ? 'References added' : 'No references added yet'}`,
              time: 'Recently',
              icon: <FileTextOutlined style={{ color: '#1890ff' }} />
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
    <CriteriaSelectionForm />
  );

  const renderRecommendationLetters = () => (
    <RecommendationLettersForm />
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
  );
};

export default DashboardPage; 