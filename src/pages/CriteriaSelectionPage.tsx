import React from 'react';
import { Card, Typography, Breadcrumb } from 'antd';
import { HomeOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CriteriaSelectionSubPage from '../components/CriteriaSelectionSubPage';

const { Title, Text } = Typography;

const CriteriaSelectionPage: React.FC = () => {
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
                <TrophyOutlined /> EB1A Criteria Selection
              </span>
            ),
          },
        ]}
        style={{ marginBottom: '24px' }}
      />

      {/* Header */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Title level={2}>
          <TrophyOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          EB1A Criteria Selection
        </Title>
        <Text type="secondary">
          Select the EB1A criteria that apply to your case. You need to meet at least 3 criteria to qualify.
        </Text>
      </Card>

      {/* Content */}
      <CriteriaSelectionSubPage />
    </div>
  );
};

export default CriteriaSelectionPage; 