import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Row, 
  Col, 
  Space, 
  Modal, 
  Form, 
  Input, 
  message,
  List,
  Tag,
  Divider,
  Spin
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  RobotOutlined,
  UserOutlined,
  MailOutlined,
  BankOutlined
} from '@ant-design/icons';
import { Referee, RecommendationLetter } from '../../types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface RefereesStepProps {
  onComplete: () => void;
}

const RefereesStep: React.FC<RefereesStepProps> = ({ onComplete }) => {
  const [referees, setReferees] = useState<Referee[]>([]);
  const [letters, setLetters] = useState<RecommendationLetter[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReferee, setEditingReferee] = useState<Referee | null>(null);
  const [generatingLetter, setGeneratingLetter] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handleAddReferee = async (values: any) => {
    const newReferee: Referee = {
      id: Date.now().toString(),
      name: values.name,
      title: values.title,
      institution: values.institution,
      email: values.email,
      relationship: values.relationship,
      expertise: values.expertise,
      achievements: values.achievements || []
    };

    setReferees([...referees, newReferee]);
    setIsModalVisible(false);
    form.resetFields();
    message.success('Referee added successfully!');
  };

  const handleEditReferee = async (values: any) => {
    if (!editingReferee) return;

    const updatedReferee: Referee = {
      ...editingReferee,
      name: values.name,
      title: values.title,
      institution: values.institution,
      email: values.email,
      relationship: values.relationship,
      expertise: values.expertise,
      achievements: values.achievements || []
    };

    setReferees(referees.map(r => r.id === editingReferee.id ? updatedReferee : r));
    setIsModalVisible(false);
    setEditingReferee(null);
    form.resetFields();
    message.success('Referee updated successfully!');
  };

  const handleDeleteReferee = (refereeId: string) => {
    setReferees(referees.filter(r => r.id !== refereeId));
    setLetters(letters.filter(l => l.refereeId !== refereeId));
    message.success('Referee removed successfully!');
  };

  const generateLetter = async (referee: Referee) => {
    setGeneratingLetter(referee.id);
    try {
      // Simulate AI letter generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const generatedContent = `Dear Immigration Officer,

I am writing this letter in strong support of ${referee.name}'s EB1A application for permanent residency in the United States. As ${referee.title} at ${referee.institution}, I have had the privilege of working closely with ${referee.name} and can attest to their extraordinary abilities and significant contributions to the field of ${referee.expertise}.

${referee.name} has demonstrated exceptional expertise and leadership in their field, consistently producing groundbreaking research and innovative solutions that have had a profound impact on our industry. Their work has been recognized both nationally and internationally, and they have established themselves as a leading authority in their area of specialization.

Throughout our professional relationship, I have been consistently impressed by ${referee.name}'s intellectual rigor, creativity, and dedication to advancing knowledge in their field. Their contributions have not only advanced the state of the art but have also inspired and mentored numerous other researchers and professionals.

I strongly recommend ${referee.name} for permanent residency under the EB1A category, as they clearly meet the criteria for extraordinary ability and will continue to make significant contributions to the United States.

Sincerely,
${referee.name}
${referee.title}
${referee.institution}`;

      const newLetter: RecommendationLetter = {
        id: Date.now().toString(),
        refereeId: referee.id,
        referee: referee,
        content: generatedContent,
        status: 'generated',
        generatedAt: new Date()
      };

      setLetters([...letters, newLetter]);
      message.success('Recommendation letter generated successfully!');
    } catch (error) {
      message.error('Failed to generate letter. Please try again.');
    } finally {
      setGeneratingLetter(null);
    }
  };

  const handleSave = async () => {
    if (referees.length === 0) {
      message.warning('Please add at least one referee before continuing.');
      return;
    }

    if (letters.length === 0) {
      message.warning('Please generate at least one recommendation letter before continuing.');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Referees and letters saved successfully!');
      onComplete();
    } catch (error) {
      message.error('Failed to save. Please try again.');
    }
  };

  const openModal = (referee?: Referee) => {
    if (referee) {
      setEditingReferee(referee);
      form.setFieldsValue(referee);
    } else {
      setEditingReferee(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  return (
    <div>
      <Title level={3} style={{ marginBottom: '24px' }}>
        Recommendation Letters
      </Title>
      <Text type="secondary" style={{ marginBottom: '32px', display: 'block' }}>
        Add referees who can provide strong recommendation letters for your EB1A application. 
        Our AI will generate personalized letters based on the information you provide.
      </Text>

      {/* Add Referee Button */}
      <Card style={{ marginBottom: '24px' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => openModal()}
        >
          Add Referee
        </Button>
        <Text type="secondary" style={{ marginLeft: '16px' }}>
          {referees.length} referee{referees.length !== 1 ? 's' : ''} added
        </Text>
      </Card>

      {/* Referees List */}
      <div style={{ marginBottom: '32px' }}>
        {referees.map((referee) => (
          <Card 
            key={referee.id} 
            style={{ marginBottom: '16px' }}
            actions={[
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => openModal(referee)}
              >
                Edit
              </Button>,
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => handleDeleteReferee(referee.id)}
              >
                Delete
              </Button>
            ]}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={16}>
                <Title level={5} style={{ margin: 0 }}>
                  <UserOutlined style={{ marginRight: '8px' }} />
                  {referee.name}
                </Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                  <BankOutlined style={{ marginRight: '4px' }} />
                  {referee.title} at {referee.institution}
                </Text>
                <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                  <MailOutlined style={{ marginRight: '4px' }} />
                  {referee.email}
                </Text>
                <div style={{ marginBottom: '8px' }}>
                  <Tag color="blue">{referee.relationship}</Tag>
                  <Tag color="green">{referee.expertise}</Tag>
                </div>
                {referee.achievements.length > 0 && (
                  <div>
                    <Text strong>Key Achievements:</Text>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                      {referee.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Col>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'right' }}>
                  {letters.find(l => l.refereeId === referee.id) ? (
                    <div>
                      <Tag color="success">Letter Generated</Tag>
                      <div style={{ marginTop: '8px' }}>
                        <Button 
                          type="link" 
                          size="small"
                          onClick={() => {
                            const letter = letters.find(l => l.refereeId === referee.id);
                            if (letter) {
                              Modal.info({
                                title: `Recommendation Letter from ${referee.name}`,
                                content: (
                                  <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                                      {letter.content}
                                    </pre>
                                  </div>
                                ),
                                width: 600
                              });
                            }
                          }}
                        >
                          View Letter
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      type="primary" 
                      icon={<RobotOutlined />}
                      loading={generatingLetter === referee.id}
                      onClick={() => generateLetter(referee)}
                    >
                      Generate Letter
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Card>
        ))}
      </div>

      {/* Save Button */}
      <div style={{ textAlign: 'center' }}>
        <Button 
          type="primary" 
          size="large" 
          onClick={handleSave}
          disabled={referees.length === 0 || letters.length === 0}
        >
          Save & Continue
        </Button>
      </div>

      {/* Add/Edit Referee Modal */}
      <Modal
        title={editingReferee ? 'Edit Referee' : 'Add Referee'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingReferee(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingReferee ? handleEditReferee : handleAddReferee}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter the referee\'s name' }]}
              >
                <Input placeholder="Dr. John Smith" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="title"
                label="Professional Title"
                rules={[{ required: true, message: 'Please enter the referee\'s title' }]}
              >
                <Input placeholder="Professor, Research Director, etc." />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="institution"
                label="Institution/Organization"
                rules={[{ required: true, message: 'Please enter the institution' }]}
              >
                <Input placeholder="Stanford University, Google Research, etc." />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter the email address' },
                  { type: 'email', message: 'Please enter a valid email address' }
                ]}
              >
                <Input placeholder="john.smith@university.edu" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="relationship"
                label="Relationship to You"
                rules={[{ required: true, message: 'Please describe your relationship' }]}
              >
                <Input placeholder="Former supervisor, colleague, collaborator" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="expertise"
                label="Area of Expertise"
                rules={[{ required: true, message: 'Please enter their area of expertise' }]}
              >
                <Input placeholder="Computer Science, Biomedical Engineering, etc." />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="achievements"
                label="Key Achievements (Optional)"
              >
                <TextArea 
                  rows={3} 
                  placeholder="List any notable achievements, awards, or recognitions of this referee..."
                />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ textAlign: 'right', marginTop: '16px' }}>
            <Space>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingReferee(null);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingReferee ? 'Update' : 'Add'} Referee
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RefereesStep; 