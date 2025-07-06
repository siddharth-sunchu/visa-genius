import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Row, 
  Col, 
  Space, 
  Steps, 
  Descriptions, 
  Tag, 
  Divider,
  message,
  Modal,
  Alert
} from 'antd';
import { 
  CheckCircleOutlined, 
  FileTextOutlined, 
  UserOutlined, 
  TeamOutlined,
  RocketOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

interface ReviewStepProps {
  onComplete: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Mock data for review - in real app, this would come from the previous steps
  const mockApplicationData = {
    personalInfo: {
      name: `${user?.profile?.firstName || 'John'} ${user?.profile?.lastName || 'Doe'}`,
      title: user?.profile?.title || 'Research Scientist',
      institution: user?.profile?.institution || 'Stanford University',
      field: user?.profile?.field || 'Computer Science',
      bio: user?.profile?.bio || 'Experienced researcher with expertise in machine learning and artificial intelligence.',
      achievements: user?.profile?.achievements || ['Published 20+ papers in top-tier conferences', 'Led research team of 10+ members'],
      publications: user?.profile?.publications || [
        { title: 'Advanced AI Systems', journal: 'Nature', year: 2023, impact: 'high' },
        { title: 'Machine Learning Applications', journal: 'Science', year: 2022, impact: 'high' }
      ],
      awards: user?.profile?.awards || [
        { name: 'Best Paper Award', organization: 'ICML', year: 2023, description: 'Outstanding contribution to AI research' }
      ]
    },
    eb1aCriteria: [
      { category: 'Extraordinary Ability', title: 'Evidence of Extraordinary Ability', isCompleted: true },
      { category: 'National Recognition', title: 'National or International Recognition', isCompleted: true },
      { category: 'Scholarly Contributions', title: 'Original Scientific Contributions', isCompleted: true },
      { category: 'Authorship', title: 'Authorship of Scholarly Articles', isCompleted: true }
    ],
    referees: [
      {
        name: 'Dr. Sarah Johnson',
        title: 'Professor',
        institution: 'MIT',
        relationship: 'Former supervisor',
        expertise: 'Computer Science'
      },
      {
        name: 'Dr. Michael Chen',
        title: 'Research Director',
        institution: 'Google Research',
        relationship: 'Collaborator',
        expertise: 'Machine Learning'
      }
    ],
    letters: [
      { refereeName: 'Dr. Sarah Johnson', status: 'Generated', generatedAt: new Date() },
      { refereeName: 'Dr. Michael Chen', status: 'Generated', generatedAt: new Date() }
    ]
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success('Application submitted successfully! Our case managers will review your application within 48 hours.');
      setShowSubmitModal(false);
      onComplete();
    } catch (error) {
      message.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reviewSteps = [
    {
      title: 'Personal Information',
      icon: <UserOutlined />,
      status: 'finish' as const,
      content: (
        <Card size="small">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Name">{mockApplicationData.personalInfo.name}</Descriptions.Item>
            <Descriptions.Item label="Title">{mockApplicationData.personalInfo.title}</Descriptions.Item>
            <Descriptions.Item label="Institution">{mockApplicationData.personalInfo.institution}</Descriptions.Item>
            <Descriptions.Item label="Field">{mockApplicationData.personalInfo.field}</Descriptions.Item>
            <Descriptions.Item label="Bio">{mockApplicationData.personalInfo.bio}</Descriptions.Item>
            <Descriptions.Item label="Achievements">
              {mockApplicationData.personalInfo.achievements.map((achievement, index) => (
                <div key={index}>• {achievement}</div>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="Publications">
              {mockApplicationData.personalInfo.publications.map((pub, index) => (
                <div key={index}>• {pub.title} ({pub.journal}, {pub.year})</div>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="Awards">
              {mockApplicationData.personalInfo.awards.map((award, index) => (
                <div key={index}>• {award.name} - {award.organization} ({award.year})</div>
              ))}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )
    },
    {
      title: 'EB1A Criteria',
      icon: <FileTextOutlined />,
      status: 'finish' as const,
      content: (
        <Card size="small">
          <div>
            {mockApplicationData.eb1aCriteria.map((criteria, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                <Text strong>{criteria.title}</Text>
                <Tag color="success" style={{ marginLeft: '8px' }}>Completed</Tag>
              </div>
            ))}
          </div>
        </Card>
      )
    },
    {
      title: 'Recommendation Letters',
      icon: <TeamOutlined />,
      status: 'finish' as const,
      content: (
        <Card size="small">
          <div>
            {mockApplicationData.referees.map((referee, index) => (
              <div key={index} style={{ marginBottom: '12px' }}>
                <Text strong>{referee.name}</Text>
                <div style={{ color: '#666', fontSize: '12px' }}>
                  {referee.title} at {referee.institution}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <Tag color="blue">{referee.relationship}</Tag>
                  <Tag color="green">{referee.expertise}</Tag>
                  <Tag color="success">Letter Generated</Tag>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )
    }
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: '24px' }}>
        Review & Submit Application
      </Title>
      <Text type="secondary" style={{ marginBottom: '32px', display: 'block' }}>
        Please review all the information you've provided before submitting your EB1A application. 
        Our case managers will review your application and provide feedback within 48 hours.
      </Text>

      {/* Application Summary */}
      <Card style={{ marginBottom: '24px' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              Application Summary
            </Title>
            <Text type="secondary">
              All sections completed successfully
            </Text>
          </Col>
          <Col>
            <Space>
              <Tag color="success" icon={<CheckCircleOutlined />}>
                Ready to Submit
              </Tag>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Review Steps */}
      <Card style={{ marginBottom: '24px' }}>
        <Steps direction="vertical" size="small">
          {reviewSteps.map((step, index) => (
            <Step
              key={index}
              title={step.title}
              icon={step.icon}
              status={step.status}
              description={step.content}
            />
          ))}
        </Steps>
      </Card>

      {/* Important Information */}
      <Alert
        message="Important Information"
        description={
          <div>
            <Paragraph style={{ margin: '8px 0' }}>
              <strong>What happens next?</strong>
            </Paragraph>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Our expert case managers will review your application within 48 hours</li>
              <li>You'll receive detailed feedback and suggestions for improvement</li>
              <li>We'll help you refine your application before final submission</li>
              <li>Once approved, we'll guide you through the USCIS submission process</li>
            </ul>
            <Paragraph style={{ margin: '8px 0' }}>
              <strong>Note:</strong> This is a review submission. Your application will be refined 
              by our experts before being submitted to USCIS.
            </Paragraph>
          </div>
        }
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      {/* Submit Button */}
      <div style={{ textAlign: 'center' }}>
        <Space size="large">
          <Button size="large">
            Download PDF
          </Button>
          <Button 
            type="primary" 
            size="large" 
            icon={<RocketOutlined />}
            onClick={() => setShowSubmitModal(true)}
          >
            Submit for Review
          </Button>
        </Space>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        title="Submit Application for Review"
        open={showSubmitModal}
        onCancel={() => setShowSubmitModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowSubmitModal(false)}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={loading}
            onClick={handleSubmit}
            icon={<RocketOutlined />}
          >
            Submit Application
          </Button>
        ]}
      >
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <ExclamationCircleOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
          <Title level={4}>Ready to Submit?</Title>
          <Paragraph>
            You're about to submit your EB1A application for expert review. 
            Our case managers will review your application and provide detailed feedback within 48 hours.
          </Paragraph>
          <Alert
            message="Application Status"
            description="Your application will be reviewed by our immigration experts before final submission to USCIS."
            type="success"
            showIcon
            style={{ marginTop: '16px' }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ReviewStep; 