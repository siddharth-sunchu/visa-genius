import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography, Button, Tooltip, Badge } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TrophyOutlined,
  FileTextOutlined,
  EditOutlined,
  UploadOutlined,
  MessageOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppSelector } from '../store/hooks';

const { Sider } = Layout;
const { Text } = Typography;

interface EnhancedSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { conversations } = useAppSelector((state: any) => state.chat);
  const { questionnaireData, subsectionProgress } = useAppSelector((state: any) => state.application);

  // Calculate progress for different sections
  const personalInfoProgress = Object.values(subsectionProgress.personal_info || {}).filter(Boolean).length;
  const criteriaProgress = questionnaireData.criteria_selection?.selectedCriteria?.length || 0;
  const recommendationProgress = questionnaireData.recommendation_letters?.references?.length || 0;
  const petitionProgress = Object.keys(questionnaireData.petition_letter || {}).length;
  const documentsProgress = 0; // Placeholder for documents progress

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      badge: null
    },
    {
      key: '/personal-info',
      icon: <UserOutlined />,
      label: 'Personal Information',
      badge: personalInfoProgress > 0 ? `${personalInfoProgress}/8` : null,
      progress: (personalInfoProgress / 8) * 100
    },
    {
      key: '/criteria-selection',
      icon: <TrophyOutlined />,
      label: 'EB1A Criteria',
      badge: criteriaProgress > 0 ? `${criteriaProgress} selected` : null,
      progress: criteriaProgress > 0 ? 100 : 0
    },
    {
      key: '/documents',
      icon: <UploadOutlined />,
      label: 'Documents',
      badge: documentsProgress > 0 ? `${documentsProgress} uploaded` : null,
      progress: documentsProgress > 0 ? 100 : 0
    },
    {
      key: '/recommendation-letters',
      icon: <FileTextOutlined />,
      label: 'Recommendation Letters',
      badge: recommendationProgress > 0 ? `${recommendationProgress} added` : null,
      progress: recommendationProgress > 0 ? 100 : 0
    },
    {
      key: '/petition-letter',
      icon: <EditOutlined />,
      label: 'Petition Letter',
      badge: petitionProgress > 0 ? `${petitionProgress}/7 sections` : null,
      progress: (petitionProgress / 7) * 100
    },
    {
      key: '/chat',
      icon: <MessageOutlined />,
      label: 'Chat Assistant',
      badge: conversations.length > 0 ? conversations.filter((c: any) => c.unreadCount > 0).length : null
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      badge: null
    }
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const getSelectedKeys = () => {
    const path = location.pathname;
    return [path];
  };

  const renderMenuItem = (item: any) => {
    const isSelected = getSelectedKeys().includes(item.key);
    const hasProgress = item.progress !== undefined;
    const hasBadge = item.badge !== null;

    return {
      key: item.key,
      icon: item.icon,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{item.label}</span>
          {!collapsed && hasBadge && (
            <Badge 
              count={item.badge} 
              size="small" 
              style={{ 
                backgroundColor: isSelected ? '#1890ff' : '#52c41a',
                fontSize: '10px'
              }} 
            />
          )}
        </div>
      ),
      style: {
        height: collapsed ? '48px' : '56px',
        lineHeight: collapsed ? '48px' : '56px',
        borderRadius: '8px',
        margin: '2px 8px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: isSelected ? '#e6f7ff' : 'transparent',
        border: isSelected ? '1px solid #91d5ff' : '1px solid transparent'
      }
    };
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="light"
      style={{
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
        background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
        borderRight: '1px solid #f0f0f0'
      }}
      trigger={
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
          transition: 'all 0.3s ease',
          zIndex: 1001
        }}>
          {collapsed ? <MenuUnfoldOutlined style={{ color: 'white' }} /> : <MenuFoldOutlined style={{ color: 'white' }} />}
        </div>
      }
    >


      {/* User Profile Section */}
      <div style={{
        padding: collapsed ? '8px' : '16px',
        textAlign: 'center',
        borderBottom: '1px solid #f0f0f0',
        marginBottom: '16px',
        background: 'linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)',
        borderRadius: '8px',
        margin: '0 8px 16px 8px'
      }}>
        <Avatar 
          size={collapsed ? 32 : 48} 
          icon={<UserOutlined />}
          style={{ 
            marginBottom: collapsed ? 0 : '8px',
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

      {/* Navigation Menu */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '60px' }}>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          onClick={handleMenuClick}
          style={{
            borderRight: 0,
            background: 'transparent'
          }}
          items={menuItems.map(renderMenuItem)}
        />
      </div>


    </Sider>
  );
};

export default EnhancedSidebar; 