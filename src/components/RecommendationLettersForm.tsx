import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Space,
  message,
  List,
  Tag,
  Modal,
  Tooltip,
  Progress,
  Avatar
} from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  DownloadOutlined,
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateQuestionnaireData, updateSubsectionProgress } from '../store/slices/applicationSlice';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Reference {
  id: string;
  name: string;
  title: string;
  organization: string;
  email: string;
  phone: string;
  relationship: string;
  yearsKnown: string;
  workHistory: string;
  qualifications: string;
  specificExamples: string;
  strengths: string;
  recommendationType: string;
  isCompleted: boolean;
}

const RecommendationLettersForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { questionnaireData } = useAppSelector((state: any) => state.application);
  const [references, setReferences] = useState<Reference[]>(
    questionnaireData.recommendation_letters?.references || []
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReference, setEditingReference] = useState<Reference | null>(null);
  const [form] = Form.useForm();

  const relationshipOptions = [
    'Academic Supervisor',
    'Research Collaborator',
    'Department Head',
    'Colleague',
    'Industry Partner',
    'Client',
    'Mentor',
    'Former Employer',
    'Professional Association Member',
    'Other'
  ];

  const recommendationTypes = [
    'Academic Excellence',
    'Research Contributions',
    'Leadership Skills',
    'Innovation & Creativity',
    'Professional Achievements',
    'Industry Impact',
    'Technical Expertise',
    'Collaboration Skills',
    'Mentorship Abilities',
    'Overall Professional Standing'
  ];

  const handleAddReference = () => {
    setEditingReference(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditReference = (reference: Reference) => {
    setEditingReference(reference);
    form.setFieldsValue(reference);
    setIsModalVisible(true);
  };

  const handleDeleteReference = (referenceId: string) => {
    const updatedReferences = references.filter(ref => ref.id !== referenceId);
    setReferences(updatedReferences);
    saveReferences(updatedReferences);
    message.success('Reference removed successfully');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const newReference: Reference = {
        id: editingReference?.id || `ref_${Date.now()}`,
        ...values,
        isCompleted: true
      };

      let updatedReferences;
      if (editingReference) {
        updatedReferences = references.map(ref => 
          ref.id === editingReference.id ? newReference : ref
        );
      } else {
        updatedReferences = [...references, newReference];
      }

      setReferences(updatedReferences);
      saveReferences(updatedReferences);
      setIsModalVisible(false);
      message.success(editingReference ? 'Reference updated successfully' : 'Reference added successfully');
    } catch (error) {
      message.error('Please fill in all required fields');
    }
  };

  const saveReferences = (refs: Reference[]) => {
    dispatch(updateQuestionnaireData({
      section: 'recommendation_letters',
      data: { references: refs }
    }));

    // Update subsection progress
    dispatch(updateSubsectionProgress({
      section: 'recommendation_letters',
      subsection: 'references',
      completed: refs.length > 0
    }));
  };

  const generateRecommendationLetter = (reference: Reference) => {
    const letter = `Dear Immigration Officer,

I am writing this letter of recommendation in support of [Applicant Name]'s EB1A application for extraordinary ability classification. I have known [Applicant Name] for ${reference.yearsKnown} years in my capacity as ${reference.title} at ${reference.organization}.

${reference.relationship}

During our professional relationship, I have had the opportunity to observe [Applicant Name]'s exceptional abilities and contributions in the field. ${reference.specificExamples}

${reference.strengths}

Based on my direct observation and professional interaction with [Applicant Name], I can confidently state that they possess extraordinary ability in their field. Their contributions have been significant and have had a measurable impact on the industry.

I strongly recommend [Applicant Name] for EB1A classification and believe they will continue to make valuable contributions to the United States.

Sincerely,
${reference.name}
${reference.title}
${reference.organization}
${reference.email}
${reference.phone}`;

    // Create and download the file
    const blob = new Blob([letter], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recommendation_letter_${reference.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const completedCount = references.filter(ref => ref.isCompleted).length;
  const progressPercentage = references.length > 0 ? (completedCount / references.length) * 100 : 0;

  return (
    <div>

      {/* Progress Overview */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row align="middle" justify="space-between" style={{ marginBottom: '16px' }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              References: {references.length} added, {completedCount} completed
            </Title>
            <Text type="secondary">
              {references.length >= 3 ? '✅ You have enough references!' : 'Add more references for a stronger application'}
            </Text>
          </Col>
          <Col>
            <Progress 
              type="circle" 
              percent={Math.round(progressPercentage)} 
              size={60}
              strokeColor={references.length >= 3 ? "#52c41a" : "#1890ff"}
            />
          </Col>
        </Row>
      </Card>

      {/* Add Reference Button */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Button 
          type="dashed" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={handleAddReference}
          style={{ width: '100%', height: '60px' }}
        >
          Add New Reference
        </Button>
      </Card>

      {/* References List */}
      {references.length > 0 && (
        <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            Your References
          </Title>
          <List
            dataSource={references}
            renderItem={(reference) => (
              <List.Item
                actions={[
                  <Tooltip title="Edit Reference">
                    <Button 
                      type="text" 
                      icon={<EditOutlined />} 
                      onClick={() => handleEditReference(reference)}
                    />
                  </Tooltip>,
                  <Tooltip title="Generate Letter">
                    <Button 
                      type="text" 
                      icon={<DownloadOutlined />} 
                      onClick={() => generateRecommendationLetter(reference)}
                    />
                  </Tooltip>,
                  <Tooltip title="Delete Reference">
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => handleDeleteReference(reference.id)}
                    />
                  </Tooltip>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <Space>
                      <Text strong>{reference.name}</Text>
                      <Tag color={reference.isCompleted ? "success" : "warning"}>
                        {reference.isCompleted ? "Completed" : "Incomplete"}
                      </Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <Text type="secondary">
                        {reference.title} at {reference.organization}
                      </Text>
                      <br />
                      <Text type="secondary">
                        <MailOutlined /> {reference.email} | <PhoneOutlined /> {reference.phone}
                      </Text>
                      <br />
                      <Text type="secondary">
                        Relationship: {reference.relationship} | Known for: {reference.yearsKnown} years
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Tips Card */}
      <Card style={{ borderRadius: '12px' }}>
        <Title level={4} style={{ marginBottom: '16px' }}>
          Tips for Strong Recommendation Letters
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card size="small" style={{ backgroundColor: '#f6ffed' }}>
              <Title level={5}>Choose Diverse References</Title>
              <Text>Include references from different professional relationships: supervisors, colleagues, clients, and industry partners.</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card size="small" style={{ backgroundColor: '#fff7e6' }}>
              <Title level={5}>Provide Specific Examples</Title>
              <Text>Ask references to include specific examples of your achievements and contributions.</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card size="small" style={{ backgroundColor: '#f0f9ff' }}>
              <Title level={5}>Include Contact Information</Title>
              <Text>Ensure all references provide complete contact information for verification.</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card size="small" style={{ backgroundColor: '#fef2f2' }}>
              <Title level={5}>Focus on Impact</Title>
              <Text>Emphasize the measurable impact of your work and contributions to the field.</Text>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Reference Form Modal */}
      <Modal
        title={editingReference ? "Edit Reference" : "Add New Reference"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText={editingReference ? "Update Reference" : "Add Reference"}
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          size="large"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter the reference name' }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="title"
                label="Professional Title"
                rules={[{ required: true, message: 'Please enter the professional title' }]}
              >
                <Input placeholder="e.g., Professor, CEO, Director" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="organization"
                label="Organization/Institution"
                rules={[{ required: true, message: 'Please enter the organization' }]}
              >
                <Input placeholder="Enter organization name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter email address' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="relationship"
                label="Professional Relationship"
                rules={[{ required: true, message: 'Please select relationship' }]}
              >
                <Select placeholder="Select relationship">
                  {relationshipOptions.map(option => (
                    <Option key={option} value={option}>{option}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="yearsKnown"
                label="Years Known"
                rules={[{ required: true, message: 'Please enter years known' }]}
              >
                <Input placeholder="e.g., 5 years" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="workHistory"
                label="Work History Together"
                rules={[{ required: true, message: 'Please describe your work history' }]}
              >
                <TextArea 
                  rows={3} 
                  placeholder="Describe your professional relationship and work history together"
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="qualifications"
                label="Reference's Qualifications"
                rules={[{ required: true, message: 'Please describe qualifications' }]}
              >
                <TextArea 
                  rows={2} 
                  placeholder="Briefly describe the reference's qualifications and expertise"
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="specificExamples"
                label="Specific Examples of Achievements"
                rules={[{ required: true, message: 'Please provide specific examples' }]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="Provide specific examples of your achievements, contributions, or work that the reference has observed"
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="strengths"
                label="Key Strengths and Qualities"
                rules={[{ required: true, message: 'Please describe key strengths' }]}
              >
                <TextArea 
                  rows={3} 
                  placeholder="Describe your key strengths, qualities, and what makes you exceptional in your field"
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="recommendationType"
                label="Type of Recommendation"
                rules={[{ required: true, message: 'Please select recommendation type' }]}
              >
                <Select placeholder="Select the type of recommendation">
                  {recommendationTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default RecommendationLettersForm; 