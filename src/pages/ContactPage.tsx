import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message, Row, Col, Select, DatePicker, TimePicker } from 'antd';
import { MailOutlined, PhoneOutlined, UserOutlined, MessageOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import VisaGeniusAtomTextLogo from '../components/VisaGeniusAtomTextLogo';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ContactPage: React.FC = () => {
  const [questionLoading, setQuestionLoading] = useState(false);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const navigate = useNavigate();

  const handleQuestionSubmit = async (values: any) => {
    setQuestionLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Your question has been submitted! We\'ll get back to you within 24 hours.');
      // Here you would typically send to sunchu28@gmail.com
      console.log('Question submitted:', values);
    } catch (error) {
      message.error('Failed to submit question. Please try again.');
    } finally {
      setQuestionLoading(false);
    }
  };

  const handleAppointmentSubmit = async (values: any) => {
    setAppointmentLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Appointment request submitted! We\'ll confirm your slot via email.');
      // Here you would typically send to sunchu28@gmail.com
      console.log('Appointment requested:', values);
    } catch (error) {
      message.error('Failed to submit appointment request. Please try again.');
    } finally {
      setAppointmentLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f2f5 0%, #e6f7ff 100%)',
      padding: '24px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <VisaGeniusAtomTextLogo 
            iconSize={40} 
            fontSize={32} 
            color="#1890ff"
            style={{ marginBottom: '24px' }}
          />
          <Title level={1} style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
            Contact Us
          </Title>
          <Paragraph style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
            Have questions about your EB1A application? Need expert guidance? 
            We're here to help you succeed.
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {/* Contact Information */}
          <Col xs={24} md={8}>
            <Card 
              style={{ 
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(24, 144, 255, 0.08)',
                border: 'none',
                height: 'fit-content'
              }}
            >
              <Title level={3} style={{ color: 'var(--text-primary)', marginBottom: '24px' }}>
                Get in Touch
              </Title>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <MailOutlined style={{ fontSize: 20, color: '#1890ff', marginRight: '12px' }} />
                  <Text strong>Email</Text>
                </div>
                <Text style={{ color: 'var(--text-secondary)' }}>
                  sunchu28@gmail.com
                </Text>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <PhoneOutlined style={{ fontSize: 20, color: '#1890ff', marginRight: '12px' }} />
                  <Text strong>Phone</Text>
                </div>
                <Text style={{ color: 'var(--text-secondary)' }}>
                  +1 (555) 123-4567
                </Text>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <CalendarOutlined style={{ fontSize: 20, color: '#1890ff', marginRight: '12px' }} />
                  <Text strong>Response Time</Text>
                </div>
                <Text style={{ color: 'var(--text-secondary)' }}>
                  Within 24 hours
                </Text>
              </div>

              <Paragraph style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Our immigration experts are available to answer your questions and guide you through the EB1A application process.
              </Paragraph>
            </Card>
          </Col>

          {/* Question Form */}
          <Col xs={24} md={8}>
            <Card 
              style={{ 
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(24, 144, 255, 0.08)',
                border: 'none'
              }}
            >
              <Title level={3} style={{ color: 'var(--text-primary)', marginBottom: '24px' }}>
                Ask a Question
              </Title>
              
              <Form
                name="question"
                onFinish={handleQuestionSubmit}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: 'Please input your name!' }]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Your Name" 
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="Your Email" 
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Item>

                <Form.Item
                  name="subject"
                  rules={[{ required: true, message: 'Please select a subject!' }]}
                >
                  <Select 
                    placeholder="Select Subject"
                    style={{ borderRadius: '8px' }}
                  >
                    <Option value="eligibility">Eligibility Questions</Option>
                    <Option value="process">Application Process</Option>
                    <Option value="documents">Document Requirements</Option>
                    <Option value="timeline">Timeline & Processing</Option>
                    <Option value="pricing">Pricing & Services</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="message"
                  rules={[{ required: true, message: 'Please input your message!' }]}
                >
                  <TextArea 
                    rows={4}
                    placeholder="Describe your question in detail..."
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={questionLoading}
                    style={{ 
                      width: '100%', 
                      height: '48px',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    Send Question
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Appointment Form */}
          <Col xs={24} md={8}>
            <Card 
              style={{ 
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(24, 144, 255, 0.08)',
                border: 'none'
              }}
            >
              <Title level={3} style={{ color: 'var(--text-primary)', marginBottom: '24px' }}>
                Book Appointment
              </Title>
              
              <Form
                name="appointment"
                onFinish={handleAppointmentSubmit}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: 'Please input your name!' }]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Your Name" 
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="Your Email" 
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                  <Input 
                    prefix={<PhoneOutlined />} 
                    placeholder="Phone Number" 
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Item>

                <Form.Item
                  name="consultationType"
                  rules={[{ required: true, message: 'Please select consultation type!' }]}
                >
                  <Select 
                    placeholder="Consultation Type"
                    style={{ borderRadius: '8px' }}
                  >
                    <Option value="initial">Initial Consultation</Option>
                    <Option value="review">Application Review</Option>
                    <Option value="strategy">Strategy Session</Option>
                    <Option value="followup">Follow-up Meeting</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="preferredDate"
                  rules={[{ required: true, message: 'Please select preferred date!' }]}
                >
                  <DatePicker 
                    placeholder="Preferred Date"
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                </Form.Item>

                <Form.Item
                  name="preferredTime"
                  rules={[{ required: true, message: 'Please select preferred time!' }]}
                >
                  <TimePicker 
                    placeholder="Preferred Time"
                    format="HH:mm"
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                </Form.Item>

                <Form.Item
                  name="notes"
                >
                  <TextArea 
                    rows={3}
                    placeholder="Any specific topics you'd like to discuss..."
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={appointmentLoading}
                    style={{ 
                      width: '100%', 
                      height: '48px',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    Book Appointment
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ContactPage; 