import React from 'react';
import { Layout, Button, Avatar, Dropdown, Space } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import VisaGeniusAtomTextLogo from '../components/VisaGeniusAtomTextLogo';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems: any[] = [];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => {
        console.log('Profile clicked');
        navigate('/dashboard/profile');
      },
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => {
        console.log('Settings clicked');
        navigate('/dashboard/settings');
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
        console.log('Logout clicked');
        logout();
      },
    },
  ];



  return (
    <AntHeader style={{ 
      background: '#fff', 
      padding: '0 24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        height: '100%',
        maxWidth: 1200,
        margin: '0 auto'
      }}>
        {/* Logo */}
        <div 
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <VisaGeniusAtomTextLogo 
            iconSize={32} 
            fontSize={24} 
            color="#1890ff"
          />
        </div>

        {/* Navigation Menu - Removed for now */}
        <div style={{ flex: 1 }} />

        {/* User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
              trigger={['click']}
              getPopupContainer={(triggerNode) => document.body}
            >
              <div 
                style={{ 
                  cursor: 'pointer', 
                  padding: '8px 12px', 
                  borderRadius: '8px', 
                  transition: 'background-color 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  position: 'relative'
                }} 
                className="user-dropdown-trigger"
                onClick={() => console.log('Dropdown trigger clicked')}
              >
                <Avatar 
                  icon={<UserOutlined style={{ color: '#1890ff' }} />} 
                  style={{ backgroundColor: '#f0f8ff', border: '1px solid #d6e4ff' }}
                />
                <span style={{ color: '#1890ff', fontWeight: 500 }}>{user.name}</span>
              </div>
            </Dropdown>
          ) : (
            <>
              <Button type="text" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button type="primary" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </AntHeader>
  );
};

export default Header; 