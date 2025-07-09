import React from 'react';
import { Card, Typography, Breadcrumb } from 'antd';
import { HomeOutlined, MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';

const { Title, Text } = Typography;

const ChatPage: React.FC = () => {
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
                <MessageOutlined /> Chat Assistant
              </span>
            ),
          },
        ]}
        style={{ marginBottom: '24px' }}
      />

      {/* Header */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Title level={2}>
          <MessageOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          AI Chat Assistant
        </Title>
        <Text type="secondary">
          Get instant help and guidance for your EB1A application. Ask questions about requirements, process, or get personalized assistance.
        </Text>
      </Card>

      {/* Content */}
      <ChatInterface />
    </div>
  );
};

export default ChatPage; 