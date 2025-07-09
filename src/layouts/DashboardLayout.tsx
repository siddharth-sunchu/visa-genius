import React, { useState } from 'react';
import { Layout, Typography, Button, Avatar, Dropdown, Space, Badge } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  BellOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import EnhancedSidebar from '../components/EnhancedSidebar';

const { Header, Content } = Layout;
const { Text } = Typography;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => {
        navigate('/settings');
      },
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => {
        navigate('/settings');
      },
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => {
        logout();
      },
    },
  ];

  const notificationItems = [
    {
      key: '1',
      label: 'Your personal information has been updated',
      time: '2 minutes ago'
    },
    {
      key: '2',
      label: 'New recommendation letter template available',
      time: '1 hour ago'
    },
    {
      key: '3',
      label: 'Application progress: 65% complete',
      time: '2 hours ago'
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <EnhancedSidebar collapsed={collapsed} onCollapse={setCollapsed} />
      
      <Layout>
        {/* Header */}
        <Header 
          style={{ 
            background: '#fff', 
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 999
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
              VisaGenius
            </Text>
          </div>

          <Space size="large">
            {/* Help Button */}
            <Button 
              type="text" 
              icon={<QuestionCircleOutlined />}
              onClick={() => navigate('/chat')}
              style={{ color: '#8c8c8c' }}
            >
              {!collapsed && 'Help'}
            </Button>

            {/* Notifications */}
            <Dropdown
              menu={{
                items: notificationItems.map(item => ({
                  key: item.key,
                  label: (
                    <div>
                      <div>{item.label}</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {item.time}
                      </Text>
                    </div>
                  )
                }))
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Badge count={3} size="small">
                <Button 
                  type="text" 
                  icon={<BellOutlined />}
                  style={{ color: '#8c8c8c' }}
                />
              </Badge>
            </Dropdown>

            {/* User Menu */}
            <Dropdown
              menu={{
                items: userMenuItems
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar 
                  icon={<UserOutlined />} 
                  style={{ 
                    background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)'
                  }}
                />
                {!collapsed && (
                  <div>
                    <Text strong style={{ fontSize: '14px', display: 'block' }}>
                      {user?.name || 'User'}
                    </Text>
                  </div>
                )}
              </div>
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content style={{ 
          margin: '24px', 
          padding: '24px', 
          background: '#f5f5f5',
          borderRadius: '12px',
          minHeight: 'calc(100vh - 48px)',
          overflow: 'auto'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout; 