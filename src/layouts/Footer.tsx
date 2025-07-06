import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import { GithubOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';
import { APP_NAME } from '../utils/constants';
import VisaGeniusAtomTextLogo from '../components/VisaGeniusAtomTextLogo';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter style={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e6f7ff 100%)',
      color: 'var(--text-primary)',
      padding: '48px 24px 24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Light texture overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(24, 144, 255, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(24, 144, 255, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(24, 144, 255, 0.02) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <div>
              <div style={{ marginBottom: '16px' }}>
                <VisaGeniusAtomTextLogo 
                  iconSize={24} 
                  fontSize={20} 
                  color="#1890ff"
                />
              </div>
              <Text style={{ color: 'var(--text-secondary)' }}>
                Your AI-powered EB1A immigration application assistant. 
                Streamline your path to permanent residency.
              </Text>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong style={{ color: 'var(--text-primary)', fontSize: '16px', marginBottom: '16px', display: 'block' }}>
                Product
              </Text>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Link href="/features" style={{ color: 'var(--text-secondary)' }}>Features</Link>
                <Link href="/pricing" style={{ color: 'var(--text-secondary)' }}>Pricing</Link>
                <Link href="/demo" style={{ color: 'var(--text-secondary)' }}>Demo</Link>
                <Link href="/support" style={{ color: 'var(--text-secondary)' }}>Support</Link>
              </Space>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong style={{ color: 'var(--text-primary)', fontSize: '16px', marginBottom: '16px', display: 'block' }}>
                Company
              </Text>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Link href="/about" style={{ color: 'var(--text-secondary)' }}>About</Link>
                <Link href="/careers" style={{ color: 'var(--text-secondary)' }}>Careers</Link>
                <Link href="/blog" style={{ color: 'var(--text-secondary)' }}>Blog</Link>
                <Link href="/press" style={{ color: 'var(--text-secondary)' }}>Press</Link>
              </Space>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong style={{ color: 'var(--text-primary)', fontSize: '16px', marginBottom: '16px', display: 'block' }}>
                Legal
              </Text>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
                <Link href="/terms" style={{ color: 'var(--text-secondary)' }}>Terms of Service</Link>
                <Link href="/cookies" style={{ color: 'var(--text-secondary)' }}>Cookie Policy</Link>
                <Link href="/disclaimer" style={{ color: 'var(--text-secondary)' }}>Disclaimer</Link>
              </Space>
            </div>
          </Col>
        </Row>
        
        <Divider style={{ borderColor: 'var(--border-color)', margin: '32px 0' }} />
        
        <Row justify="space-between" align="middle">
          <Col xs={24} sm={12}>
            <Text style={{ color: 'var(--text-secondary)' }}>
              © {currentYear} {APP_NAME}. All rights reserved.
            </Text>
          </Col>
          
          <Col xs={24} sm={12}>
            <Space size="large" style={{ justifyContent: 'flex-end', width: '100%' }}>
              <Link href="https://twitter.com" target="_blank" style={{ color: 'var(--text-secondary)' }} className="footer-social-link">
                <TwitterOutlined style={{ fontSize: '18px' }} />
              </Link>
              <Link href="https://linkedin.com" target="_blank" style={{ color: 'var(--text-secondary)' }} className="footer-social-link">
                <LinkedinOutlined style={{ fontSize: '18px' }} />
              </Link>
              <Link href="https://github.com" target="_blank" style={{ color: 'var(--text-secondary)' }} className="footer-social-link">
                <GithubOutlined style={{ fontSize: '18px' }} />
              </Link>
            </Space>
          </Col>
        </Row>
        
        <div style={{ marginTop: '16px' }}>
          <Text style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
            Disclaimer: {APP_NAME} is not a law firm and does not provide legal advice. 
            Our services are designed to assist with document preparation and should not 
            be considered as legal counsel. Please consult with a qualified immigration 
            attorney for legal advice specific to your situation.
          </Text>
        </div>
      </div>
      </div>
    </AntFooter>
  );
};

export default Footer; 