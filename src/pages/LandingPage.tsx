import React from 'react';
import { Button, Row, Col, Typography, Card } from 'antd';
import { ArrowRightOutlined, SafetyCertificateOutlined, ThunderboltOutlined, FileTextOutlined, TeamOutlined, ClockCircleOutlined, LockOutlined, CheckCircleOutlined, RobotOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const steps = [
  {
    number: '01',
    title: 'Profile Assessment',
    description: 'Evaluate your eligibility for EB1A criteria',
  },
  {
    number: '02',
    title: 'Document Collection',
    description: 'Upload and organize all required documents',
  },
  {
    number: '03',
    title: 'AI Letter Generation',
    description: 'Generate personalized recommendation letters',
  },
  {
    number: '04',
    title: 'Expert Review',
    description: 'Case manager reviews and finalizes your application',
  },
  {
    number: '05',
    title: 'USCIS Submission & Approval',
    description: 'Submit your application and get approval from USCIS',
  },
];

const features = [
  {
    icon: <ThunderboltOutlined style={{ fontSize: 32, color: 'var(--primary-color)' }} />, 
    title: 'AI-Powered Application',
    description: 'Our advanced AI streamlines your EB1A application process, ensuring nothing is missed.'
  },
  {
    icon: <RobotOutlined style={{ fontSize: 32, color: 'var(--accent-color)' }} />,
    title: 'Auto-Generated Letters',
    description: 'Automatically generate professional recommendation letters tailored to your profile.'
  },
  {
    icon: <TeamOutlined style={{ fontSize: 32, color: 'var(--success-color)' }} />,
    title: 'Expert Case Management',
    description: 'Dedicated case managers review every application to ensure quality and compliance.'
  },
  {
    icon: <ClockCircleOutlined style={{ fontSize: 32, color: 'var(--warning-color)' }} />,
    title: 'Save Time & Effort',
    description: 'Reduce application time from months to weeks with our intelligent automation.'
  },
  {
    icon: <LockOutlined style={{ fontSize: 32, color: 'var(--text-primary)' }} />,
    title: 'Secure & Confidential',
    description: 'Your sensitive information is protected with enterprise-grade security.'
  },
  {
    icon: <CheckCircleOutlined style={{ fontSize: 32, color: 'var(--success-color)' }} />,
    title: 'High Success Rate',
    description: 'Our structured approach maximizes your chances of EB1A approval.'
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#f7f9fb', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        width: '100%',
        minHeight: '600px',
        background: 'linear-gradient(90deg, #f7f9fb 60%, #eaf1fb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 0 32px 0',
      }}>
        <Row gutter={[48, 0]} align="middle" justify="center" style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
          <Col xs={24} md={12} style={{ zIndex: 2 }}>
            <Title style={{ fontSize: 48, fontWeight: 800, marginBottom: 24, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              Simplify Your EB1A<br />Visa Application
            </Title>
            <Paragraph style={{ fontSize: 20, color: 'var(--text-secondary)', marginBottom: 40 }}>
              AI-powered platform designed specifically for researchers and scientists.<br />
              Transform your complex EB1A application into a streamlined, guided experience.
            </Paragraph>
            <Button
              type="primary"
              size="large"
              style={{ borderRadius: 8, fontWeight: 600, fontSize: 18, height: 56, padding: '0 40px', boxShadow: '0 4px 24px rgba(24, 144, 255, 0.08)' }}
              onClick={() => navigate('/register')}
              icon={<ArrowRightOutlined />}
            >
              Get Started
            </Button>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'center', position: 'relative' }}>
            <img
              src={require('../assets/Sample 1.png')}
              alt="Visa Genius EB1A Illustration"
              style={{
                maxWidth: '90%',
                maxHeight: 480,
                borderRadius: 24,
                boxShadow: '0 8px 32px rgba(24, 144, 255, 0.10)',
                background: '#eaf1fb',
                objectFit: 'contain',
              }}
            />
          </Col>
        </Row>
      </section>

      {/* 5-Step Process Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
        padding: '80px 0 64px 0',
        width: '100%'
      }}>
        <div style={{ 
          maxWidth: 1400, 
          margin: '0 auto', 
          textAlign: 'center',
          padding: '0 24px'
        }}>
          <Title level={2} style={{ 
            fontWeight: 800, 
            marginBottom: 16, 
            color: 'var(--text-primary)',
            fontSize: '2.5rem'
          }}>
            Simple 5-Step Process
          </Title>
          <Paragraph style={{ 
            fontSize: 20, 
            color: 'var(--text-secondary)', 
            marginBottom: 64,
            maxWidth: 600,
            margin: '0 auto 64px auto'
          }}>
            From profile assessment to final submission and approval, we guide you through every step with AI-powered precision.
          </Paragraph>
          
          <div style={{
            maxWidth: 1000,
            margin: '0 auto'
          }}>
            {steps.map((step, idx) => (
              <div key={step.number} className="step-horizontal">
                <div className="step-number">{step.number}</div>
                <div className="step-icon">
                  {idx === 0 && <UserOutlined />}
                  {idx === 1 && <FileTextOutlined />}
                  {idx === 2 && <RobotOutlined />}
                  {idx === 3 && <TeamOutlined />}
                  {idx === 4 && <CheckCircleOutlined />}
                </div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose VisaGenius Section */}
      <section style={{ background: '#f7f9fb', padding: '64px 0 48px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <Title level={2} style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
            Why Choose VisaGenius?
          </Title>
          <Paragraph style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 48 }}>
            Built by immigration experts and powered by AI, we make the complex EB1A process simple and efficient.
          </Paragraph>
          <Row gutter={[32, 32]} justify="center">
            {features.map((feature, idx) => (
              <Col xs={24} sm={12} md={8} key={feature.title}>
                <Card
                  bordered={false}
                  style={{
                    borderRadius: 16,
                    boxShadow: '0 2px 16px rgba(24, 144, 255, 0.06)',
                    padding: 0,
                    minHeight: 180,
                    background: '#fff',
                  }}
                >
                  <div style={{ margin: '24px 0 12px 0' }}>{feature.icon}</div>
                  <Text style={{ fontWeight: 700, fontSize: 18, color: '#1a2341', display: 'block', marginBottom: 8 }}>{feature.title}</Text>
                  <Paragraph style={{ color: '#4a5568', fontSize: 15, margin: 0 }}>{feature.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Schedule Consultation Section */}
      <section style={{ background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', padding: '80px 0 64px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ 
            fontWeight: 800, 
            marginBottom: 16, 
            color: '#fff',
            fontSize: '2.5rem'
          }}>
            Schedule Your First Call
          </Title>
          <Paragraph style={{ 
            fontSize: 20, 
            color: 'rgba(255, 255, 255, 0.9)', 
            marginBottom: 40,
            maxWidth: 600,
            margin: '0 auto 40px auto'
          }}>
            Discuss your EB1A application process with our immigration experts. 
            Get personalized guidance and answers to all your questions.
          </Paragraph>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              type="default"
              size="large"
              style={{ 
                borderRadius: 8, 
                fontWeight: 600, 
                fontSize: 18, 
                height: 56, 
                padding: '0 32px',
                background: '#fff',
                color: '#1890ff',
                border: 'none'
              }}
              onClick={() => navigate('/contact')}
              icon={<CalendarOutlined />}
            >
              Book Free Consultation
            </Button>
            <Button
              type="primary"
              size="large"
              style={{ 
                borderRadius: 8, 
                fontWeight: 600, 
                fontSize: 18, 
                height: 56, 
                padding: '0 32px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: '#fff'
              }}
              onClick={() => navigate('/register')}
              icon={<ArrowRightOutlined />}
            >
              Start Application
            </Button>
          </div>
        </div>
      </section>

      {/* Ready to Start Your Journey Section */}
      <section style={{ background: '#fff', padding: '64px 0 48px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <Title level={2} style={{ fontWeight: 800, marginBottom: 16, color: 'var(--text-primary)' }}>
            Ready to Start Your Journey?
          </Title>
          <Paragraph style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 32 }}>
            Join thousands of researchers and scientists who have successfully navigated their EB1A applications with VisaGenius.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            style={{ borderRadius: 8, fontWeight: 600, fontSize: 18, height: 56, padding: '0 40px', boxShadow: '0 4px 24px rgba(24, 144, 255, 0.08)' }}
            onClick={() => navigate('/register')}
            icon={<ArrowRightOutlined />}
          >
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 