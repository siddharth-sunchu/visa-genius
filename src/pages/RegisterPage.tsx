import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import VisaGeniusAtomTextLogo from '../components/VisaGeniusAtomTextLogo';

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { 
    name: string; 
    email: string; 
    password: string; 
    confirmPassword: string;
    agreeToTerms: boolean;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }

    if (!values.agreeToTerms) {
      message.error('Please agree to the terms and conditions!');
      return;
    }

    setLoading(true);
    try {
      await register(values.email, values.password, values.name);
      message.success('Registration successful! Welcome to Visa Genius!');
      navigate('/dashboard');
    } catch (error) {
      message.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      message.success('Google registration successful!');
      navigate('/dashboard');
    } catch (error) {
      message.error('Google registration failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f2f5 0%, #e6f7ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: '450px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(24, 144, 255, 0.08)',
          border: 'none'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <VisaGeniusAtomTextLogo 
              iconSize={32} 
              fontSize={28} 
              color="#1890ff"
            />
          </div>
          <Title level={2} style={{ margin: 0 }}>
            Create Account
          </Title>
          <Text type="secondary">
            Start your EB1A application journey today
          </Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Full Name" 
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
              placeholder="Email" 
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 8, message: 'Password must be at least 8 characters!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Confirm Password"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="agreeToTerms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('Please agree to the terms and conditions!')),
              },
            ]}
          >
            <Checkbox>
              I agree to the{' '}
              <Link to="/terms" style={{ color: '#1890ff' }}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" style={{ color: '#1890ff' }}>
                Privacy Policy
              </Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ 
                width: '100%', 
                height: '48px',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">or</Text>
        </Divider>

        <Button 
          icon={<GoogleOutlined />} 
          size="large"
          loading={googleLoading}
          onClick={handleGoogleLogin}
          style={{ 
            width: '100%', 
            height: '48px',
            borderRadius: '8px',
            fontSize: '16px',
            border: '1px solid #d9d9d9'
          }}
        >
          Continue with Google
        </Button>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text type="secondary">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1890ff' }}>
              Sign in
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage; 