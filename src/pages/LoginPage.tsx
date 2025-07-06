import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, Space, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import VisaGeniusAtomTextLogo from '../components/VisaGeniusAtomTextLogo';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      message.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      message.success('Google login successful!');
      navigate('/dashboard');
    } catch (error) {
      message.error('Google login failed. Please try again.');
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
          maxWidth: '400px',
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
            Welcome Back
          </Title>
          <Text type="secondary">
            Sign in to continue your EB1A application
          </Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
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
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password"
              style={{ borderRadius: '8px' }}
            />
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
              Sign In
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
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1890ff' }}>
              Sign up
            </Link>
          </Text>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/forgot-password" style={{ color: '#1890ff' }}>
            Forgot your password?
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage; 