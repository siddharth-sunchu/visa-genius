import React from 'react';
import { Card, Typography, Breadcrumb } from 'antd';
import { HomeOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RecommendationLettersForm from '../components/RecommendationLettersForm';

const { Title, Text } = Typography;

const RecommendationLettersPage: React.FC = () => {
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
                <FileTextOutlined /> Recommendation Letters
              </span>
            ),
          },
        ]}
        style={{ marginBottom: '24px' }}
      />

      {/* Header */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Title level={2}>
          <FileTextOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          Recommendation Letters
        </Title>
        <Text type="secondary">
          Add references who can provide strong recommendation letters for your EB1A application. 
          We recommend at least 3-5 references from different professional relationships.
        </Text>
      </Card>

      {/* Content */}
      <RecommendationLettersForm />
    </div>
  );
};

export default RecommendationLettersPage; 