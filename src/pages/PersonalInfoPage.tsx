import React from 'react';
import { Card, Typography, Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PersonalInfoSubPage from '../components/PersonalInfoSubPage';

const { Title, Text } = Typography;

const PersonalInfoPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          {
            title: (
              <span onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                <HomeOutlined /> Dashboard
              </span>
            ),
          },
          {
            title: (
              <span>
                <UserOutlined /> Personal Information
              </span>
            ),
          },
        ]}
        style={{ marginBottom: '24px' }}
      />

      {/* Header */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Title level={2}>
          <UserOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          Personal Information
        </Title>
        <Text type="secondary">
          Complete your personal information step by step. You can save each section and return later.
        </Text>
      </Card>

      {/* Content */}
      <PersonalInfoSubPage />
    </div>
  );
};

export default PersonalInfoPage; 