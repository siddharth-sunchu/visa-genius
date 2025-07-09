import React from 'react';
import { Card, Typography, Breadcrumb, Form, Input, Button, Switch, Select, Row, Col, Divider, Avatar, Upload } from 'antd';
import { 
  HomeOutlined, 
  SettingOutlined, 
  UserOutlined, 
  BellOutlined, 
  LockOutlined,
  UploadOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const { Title, Text } = Typography;
const { Option } = Select;

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form] = Form.useForm();

  const notificationSettings = [
    {
      key: 'email_notifications',
      title: 'Email Notifications',
      description: 'Receive email updates about your application progress',
      enabled: true
    },
    {
      key: 'push_notifications',
      title: 'Push Notifications',
      description: 'Get real-time notifications in your browser',
      enabled: true
    },
    {
      key: 'reminder_notifications',
      title: 'Reminder Notifications',
      description: 'Get reminders for incomplete sections',
      enabled: false
    },
    {
      key: 'chat_notifications',
      title: 'Chat Notifications',
      description: 'Notifications for new chat messages',
      enabled: true
    }
  ];

  const privacySettings = [
    {
      key: 'data_sharing',
      title: 'Data Sharing',
      description: 'Allow sharing of anonymized data for service improvement',
      enabled: false
    },
    {
      key: 'analytics',
      title: 'Analytics',
      description: 'Help us improve by sharing usage analytics',
      enabled: true
    }
  ];

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
                <SettingOutlined /> Settings
              </span>
            ),
          },
        ]}
        style={{ marginBottom: '24px' }}
      />

      {/* Header */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Title level={2}>
          <SettingOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          Settings
        </Title>
        <Text type="secondary">
          Manage your account settings, preferences, and privacy options.
        </Text>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Profile Settings */}
        <Col xs={24} lg={12}>
          <Card title="Profile Settings" style={{ borderRadius: '12px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Upload
                name="avatar"
                listType="picture-circle"
                className="avatar-uploader"
                showUploadList={false}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                onChange={() => {}}
              >
                <div>
                  <Avatar size={80} icon={<UserOutlined />} />
                  <div style={{ marginTop: 8 }}>
                    <UploadOutlined /> Change Photo
                  </div>
                </div>
              </Upload>
            </div>

            <Form layout="vertical" form={form}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item label="First Name" name="firstName">
                    <Input placeholder="Enter first name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Last Name" name="lastName">
                    <Input placeholder="Enter last name" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label="Email" name="email">
                    <Input placeholder="Enter email address" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label="Phone" name="phone">
                    <Input placeholder="Enter phone number" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label="Time Zone" name="timezone">
                    <Select placeholder="Select timezone">
                      <Option value="UTC-8">Pacific Time (UTC-8)</Option>
                      <Option value="UTC-7">Mountain Time (UTC-7)</Option>
                      <Option value="UTC-6">Central Time (UTC-6)</Option>
                      <Option value="UTC-5">Eastern Time (UTC-5)</Option>
                      <Option value="UTC+0">UTC</Option>
                      <Option value="UTC+1">Central European Time (UTC+1)</Option>
                      <Option value="UTC+5:30">India Standard Time (UTC+5:30)</Option>
                      <Option value="UTC+8">China Standard Time (UTC+8)</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        {/* Notification Settings */}
        <Col xs={24} lg={12}>
          <Card title="Notification Settings" style={{ borderRadius: '12px' }}>
            {notificationSettings.map((setting) => (
              <div key={setting.key} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong>{setting.title}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {setting.description}
                    </Text>
                  </div>
                  <Switch defaultChecked={setting.enabled} />
                </div>
                <Divider style={{ margin: '12px 0' }} />
              </div>
            ))}
          </Card>
        </Col>

        {/* Privacy Settings */}
        <Col xs={24} lg={12}>
          <Card title="Privacy Settings" style={{ borderRadius: '12px' }}>
            {privacySettings.map((setting) => (
              <div key={setting.key} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong>{setting.title}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {setting.description}
                    </Text>
                  </div>
                  <Switch defaultChecked={setting.enabled} />
                </div>
                <Divider style={{ margin: '12px 0' }} />
              </div>
            ))}
          </Card>
        </Col>

        {/* Security Settings */}
        <Col xs={24} lg={12}>
          <Card title="Security Settings" style={{ borderRadius: '12px' }}>
            <Form layout="vertical">
              <Form.Item label="Current Password" name="currentPassword">
                <Input.Password placeholder="Enter current password" />
              </Form.Item>
              <Form.Item label="New Password" name="newPassword">
                <Input.Password placeholder="Enter new password" />
              </Form.Item>
              <Form.Item label="Confirm New Password" name="confirmPassword">
                <Input.Password placeholder="Confirm new password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" icon={<LockOutlined />}>
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Application Settings */}
        <Col xs={24}>
          <Card title="Application Settings" style={{ borderRadius: '12px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item label="Language" name="language">
                  <Select placeholder="Select language">
                    <Option value="en">English</Option>
                    <Option value="es">Spanish</Option>
                    <Option value="fr">French</Option>
                    <Option value="de">German</Option>
                    <Option value="zh">Chinese</Option>
                    <Option value="hi">Hindi</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Theme" name="theme">
                  <Select placeholder="Select theme">
                    <Option value="light">Light</Option>
                    <Option value="dark">Dark</Option>
                    <Option value="auto">Auto</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="Auto-save" name="autosave">
                  <Switch defaultChecked />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Save Button */}
      <Card style={{ marginTop: '24px', borderRadius: '12px', textAlign: 'center' }}>
        <Button type="primary" size="large" icon={<SaveOutlined />}>
          Save All Changes
        </Button>
      </Card>
    </div>
  );
};

export default SettingsPage; 