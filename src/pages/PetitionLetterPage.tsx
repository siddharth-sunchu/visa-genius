import React from 'react';
import { Card, Typography, Breadcrumb } from 'antd';
import { HomeOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PetitionLetterForm from '../components/PetitionLetterForm';

const { Title, Text } = Typography;

const PetitionLetterPage: React.FC = () => {
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
                <EditOutlined /> Petition Letter
              </span>
            ),
          },
        ]}
        style={{ marginBottom: '24px' }}
      />

      {/* Header */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Title level={2}>
          <EditOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          Petition Letter
        </Title>
        <Text type="secondary">
          Generate and customize your EB1A petition letter. This is a crucial document that presents your case for extraordinary ability classification.
        </Text>
      </Card>

      {/* Content */}
      <PetitionLetterForm />
    </div>
  );
};

export default PetitionLetterPage; 