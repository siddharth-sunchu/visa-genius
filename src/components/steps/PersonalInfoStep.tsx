import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Typography, Card, Space, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { UserProfile } from '../../types';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface PersonalInfoStepProps {
  onComplete: () => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ onComplete }) => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const profile: Partial<UserProfile> = {
        firstName: values.firstName,
        lastName: values.lastName,
        title: values.title,
        institution: values.institution,
        field: values.field,
        bio: values.bio,
        achievements: values.achievements || [],
        publications: values.publications || [],
        awards: values.awards || [],
        memberships: values.memberships || []
      };

      await updateProfile(profile);
      message.success('Personal information saved successfully!');
      onComplete();
    } catch (error) {
      message.error('Failed to save personal information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={3} style={{ marginBottom: '24px' }}>
        Personal Information
      </Title>
      <Text type="secondary" style={{ marginBottom: '32px', display: 'block' }}>
        Please provide your basic information and professional background. This will help us 
        generate personalized recommendation letters and guide you through the EB1A criteria.
      </Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={user?.profile}
      >
        {/* Basic Information */}
        <Card title="Basic Information" style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter your first name' }]}
              >
                <Input placeholder="Enter your first name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter your last name' }]}
              >
                <Input placeholder="Enter your last name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="title"
                label="Professional Title"
                rules={[{ required: true, message: 'Please enter your professional title' }]}
              >
                <Input placeholder="e.g., Research Scientist, Professor, etc." />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="institution"
                label="Current Institution"
                rules={[{ required: true, message: 'Please enter your current institution' }]}
              >
                <Input placeholder="e.g., Stanford University, Google Research, etc." />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="field"
                label="Field of Expertise"
                rules={[{ required: true, message: 'Please enter your field of expertise' }]}
              >
                <Input placeholder="e.g., Computer Science, Biomedical Engineering, etc." />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="bio"
                label="Professional Biography"
                rules={[{ required: true, message: 'Please provide your professional biography' }]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="Provide a brief overview of your professional background, research interests, and key accomplishments..."
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Key Achievements */}
        <Card title="Key Achievements" style={{ marginBottom: '24px' }}>
          <Form.List name="achievements">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={[16, 16]} align="middle">
                    <Col flex="auto">
                      <Form.Item
                        {...restField}
                        name={[name]}
                        rules={[{ required: true, message: 'Please enter an achievement' }]}
                      >
                        <Input placeholder="Describe a key achievement or contribution" />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => remove(name)}
                      />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    block 
                    icon={<PlusOutlined />}
                  >
                    Add Achievement
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        {/* Publications */}
        <Card title="Publications" style={{ marginBottom: '24px' }}>
          <Form.List name="publications">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" style={{ marginBottom: '16px' }}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'title']}
                          label="Publication Title"
                          rules={[{ required: true, message: 'Please enter publication title' }]}
                        >
                          <Input placeholder="Publication title" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'journal']}
                          label="Journal/Conference"
                          rules={[{ required: true, message: 'Please enter journal/conference name' }]}
                        >
                          <Input placeholder="Journal or conference name" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'year']}
                          label="Year"
                          rules={[{ required: true, message: 'Please enter publication year' }]}
                        >
                          <Input placeholder="2023" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'impact']}
                          label="Impact Level"
                        >
                          <Input placeholder="High/Medium/Low" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />} 
                          onClick={() => remove(name)}
                          style={{ marginTop: '32px' }}
                        />
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    block 
                    icon={<PlusOutlined />}
                  >
                    Add Publication
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        {/* Awards */}
        <Card title="Awards & Honors" style={{ marginBottom: '24px' }}>
          <Form.List name="awards">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" style={{ marginBottom: '16px' }}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          label="Award Name"
                          rules={[{ required: true, message: 'Please enter award name' }]}
                        >
                          <Input placeholder="Award name" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'organization']}
                          label="Awarding Organization"
                          rules={[{ required: true, message: 'Please enter awarding organization' }]}
                        >
                          <Input placeholder="Organization name" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'year']}
                          label="Year"
                          rules={[{ required: true, message: 'Please enter award year' }]}
                        >
                          <Input placeholder="2023" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={16}>
                        <Form.Item
                          {...restField}
                          name={[name, 'description']}
                          label="Description"
                        >
                          <Input placeholder="Brief description of the award" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />} 
                          onClick={() => remove(name)}
                          style={{ marginTop: '32px' }}
                        />
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    block 
                    icon={<PlusOutlined />}
                  >
                    Add Award
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Space>
            <Button size="large" onClick={() => form.resetFields()}>
              Reset Form
            </Button>
            <Button 
              type="primary" 
              size="large" 
              htmlType="submit" 
              loading={loading}
            >
              Save & Continue
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default PersonalInfoStep; 