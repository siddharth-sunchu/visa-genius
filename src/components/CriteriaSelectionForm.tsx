import React, { useState } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Button,
  Space,
  Progress,
  Alert,
  Divider,
  List,
  Tag,
  message,
  Collapse,
  Form,
  Input,
  Select,
  DatePicker,
  Upload
} from 'antd';
import {
  TrophyOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  UploadOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  selectCriteria, 
  deselectCriteria, 
  updateQuestionnaireData 
} from '../store/slices/applicationSlice';
import { EB1A_CRITERIA } from '../utils/constants';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;

const CriteriaSelectionForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedCriteria, questionnaireData } = useAppSelector((state: any) => state.application);
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState<string[]>([]);

  const handleCriteriaToggle = (criteriaId: string) => {
    if (selectedCriteria.includes(criteriaId)) {
      dispatch(deselectCriteria(criteriaId));
      message.info(`${EB1A_CRITERIA.find(c => c.id === criteriaId)?.name} removed from selection`);
    } else {
      dispatch(selectCriteria(criteriaId));
      message.success(`${EB1A_CRITERIA.find(c => c.id === criteriaId)?.name} added to selection`);
    }
  };

  const handlePanelChange = (keys: string | string[]) => {
    setActiveKey(Array.isArray(keys) ? keys : [keys]);
  };

  const onFinish = (values: any) => {
    dispatch(updateQuestionnaireData({ section: 'criteria_details', data: values }));
    message.success('Criteria details saved successfully!');
  };

  const selectedCriteriaData = EB1A_CRITERIA.filter(criteria => 
    selectedCriteria.includes(criteria.id)
  );

  const progressPercentage = (selectedCriteria.length / EB1A_CRITERIA.length) * 100;

  return (
    <div>
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Title level={3}>
          <TrophyOutlined style={{ marginRight: '8px' }} />
          EB1A Criteria Selection
        </Title>
        <Text type="secondary">
          Select the criteria you qualify for. You must meet at least 3 out of 10 criteria to be eligible for EB1A.
        </Text>
      </Card>

      {/* Progress Overview */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row align="middle" justify="space-between" style={{ marginBottom: '16px' }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              Selection Progress
            </Title>
            <Text type="secondary">
              {selectedCriteria.length} of {EB1A_CRITERIA.length} criteria selected
            </Text>
          </Col>
          <Col>
            <Progress 
              type="circle" 
              percent={Math.round(progressPercentage)} 
              size={60}
              strokeColor={selectedCriteria.length >= 3 ? "#52c41a" : "#faad14"}
            />
          </Col>
        </Row>
        
        {selectedCriteria.length >= 3 ? (
          <Alert
            message="Eligibility Met"
            description="You have selected enough criteria to potentially qualify for EB1A. Continue with detailed documentation."
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
          />
        ) : (
          <Alert
            message="More Criteria Needed"
            description={`You need to select at least ${3 - selectedCriteria.length} more criteria to meet the minimum requirement.`}
            type="warning"
            showIcon
            icon={<InfoCircleOutlined />}
          />
        )}
      </Card>

      {/* Criteria Selection Grid */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Title level={4} style={{ marginBottom: '16px' }}>
          Available Criteria
        </Title>
        <Row gutter={[16, 16]}>
          {EB1A_CRITERIA.map((criteria) => (
            <Col xs={24} sm={12} lg={8} key={criteria.id}>
              <Card
                hoverable
                style={{
                  border: selectedCriteria.includes(criteria.id) ? '2px solid #1890ff' : '1px solid #d9d9d9',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  height: '100%',
                }}
                onClick={() => handleCriteriaToggle(criteria.id)}
              >
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                    {criteria.icon}
                  </div>
                  <Title level={5} style={{ margin: 0 }}>
                    {criteria.name}
                  </Title>
                </div>
                <Paragraph type="secondary" style={{ fontSize: '12px', marginBottom: '16px' }}>
                  {criteria.description}
                </Paragraph>
                <div style={{ textAlign: 'center' }}>
                  {selectedCriteria.includes(criteria.id) ? (
                    <Tag color="blue" icon={<CheckCircleOutlined />}>
                      Selected
                    </Tag>
                  ) : (
                    <Tag color="default">
                      Not Selected
                    </Tag>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Selected Criteria Details */}
      {selectedCriteria.length > 0 && (
        <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            Selected Criteria Details
          </Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={questionnaireData.criteria_details || {}}
          >
            <Collapse
              activeKey={activeKey}
              onChange={handlePanelChange}
            >
              {selectedCriteriaData.map((criteria) => (
                <Panel
                  header={
                    <Space>
                      <span>{criteria.icon}</span>
                      <Text strong>{criteria.name}</Text>
                      <Tag color="blue">Selected</Tag>
                    </Space>
                  }
                  key={criteria.id}
                >
                  <Paragraph type="secondary" style={{ marginBottom: '16px' }}>
                    {criteria.description}
                  </Paragraph>

                  {/* Judging Criteria */}
                  {criteria.id === 'judging' && (
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <Form.Item
                          name={[criteria.id, 'judgingExperience']}
                          label="Judging Experience"
                        >
                          <TextArea 
                            rows={4} 
                            placeholder="Describe your experience judging the work of others in your field"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name={[criteria.id, 'judgingRole']}
                          label="Role in Judging"
                        >
                          <Select placeholder="Select your role">
                            <Option value="panel_member">Panel Member</Option>
                            <Option value="individual_judge">Individual Judge</Option>
                            <Option value="reviewer">Reviewer</Option>
                            <Option value="evaluator">Evaluator</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name={[criteria.id, 'judgingPeriod']}
                          label="Period of Judging"
                        >
                          <Input placeholder="e.g., 2018-2023" />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          name={[criteria.id, 'judgingEvidence']}
                          label="Supporting Evidence"
                        >
                          <TextArea 
                            rows={3} 
                            placeholder="List specific examples, organizations, and outcomes of your judging activities"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  {/* Leading Role Criteria */}
                  {criteria.id === 'leading_role' && (
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <Form.Item
                          name={[criteria.id, 'leadershipRole']}
                          label="Leadership Role Description"
                        >
                          <TextArea 
                            rows={4} 
                            placeholder="Describe your leading or critical role in distinguished organizations"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name={[criteria.id, 'organizationName']}
                          label="Organization Name"
                        >
                          <Input placeholder="Enter organization name" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name={[criteria.id, 'organizationType']}
                          label="Organization Type"
                        >
                          <Select placeholder="Select organization type">
                            <Option value="academic">Academic Institution</Option>
                            <Option value="research">Research Organization</Option>
                            <Option value="corporate">Corporate/Company</Option>
                            <Option value="government">Government Agency</Option>
                            <Option value="nonprofit">Non-profit Organization</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name={[criteria.id, 'roleDuration']}
                          label="Duration of Role"
                        >
                          <Input placeholder="e.g., 2 years" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name={[criteria.id, 'roleImpact']}
                          label="Impact of Role"
                        >
                          <Input placeholder="e.g., Led team of 50+ people" />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  {/* Original Contribution Criteria */}
                  {criteria.id === 'original_contribution' && (
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <Form.Item
                          name={[criteria.id, 'contributionDescription']}
                          label="Original Contribution Description"
                        >
                          <TextArea 
                            rows={4} 
                            placeholder="Describe your original scientific, scholarly, artistic, athletic, or business-related contributions"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name={[criteria.id, 'contributionType']}
                          label="Type of Contribution"
                        >
                          <Select placeholder="Select contribution type">
                            <Option value="scientific">Scientific</Option>
                            <Option value="scholarly">Scholarly</Option>
                            <Option value="artistic">Artistic</Option>
                            <Option value="athletic">Athletic</Option>
                            <Option value="business">Business-related</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name={[criteria.id, 'contributionYear']}
                          label="Year of Contribution"
                        >
                          <DatePicker 
                            picker="year" 
                            style={{ width: '100%' }} 
                            placeholder="Select year"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          name={[criteria.id, 'contributionEvidence']}
                          label="Evidence of Contribution"
                        >
                          <TextArea 
                            rows={3} 
                            placeholder="Provide specific evidence, publications, patents, or other documentation"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  {/* Authorship Criteria */}
                  {criteria.id === 'authorship' && (
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <Form.Item
                          name={[criteria.id, 'publicationsList']}
                          label="List of Publications"
                        >
                          <TextArea 
                            rows={4} 
                            placeholder="List your scholarly articles, books, or major media publications"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name={[criteria.id, 'publicationCount']}
                          label="Number of Publications"
                        >
                          <Input placeholder="Enter total number" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name={[criteria.id, 'publicationType']}
                          label="Publication Type"
                        >
                          <Select placeholder="Select publication type">
                            <Option value="journal_articles">Journal Articles</Option>
                            <Option value="books">Books</Option>
                            <Option value="book_chapters">Book Chapters</Option>
                            <Option value="media_articles">Media Articles</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          name={[criteria.id, 'journalQuality']}
                          label="Journal Quality & Impact"
                        >
                          <TextArea 
                            rows={3} 
                            placeholder="Describe the quality and impact of the journals or media outlets"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  {/* High Salary Criteria */}
                  {criteria.id === 'high_salary' && (
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name={[criteria.id, 'currentSalary']}
                          label="Current Annual Salary"
                        >
                          <Input placeholder="Enter amount in USD" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name={[criteria.id, 'salaryYear']}
                          label="Salary Year"
                        >
                          <DatePicker 
                            picker="year" 
                            style={{ width: '100%' }} 
                            placeholder="Select year"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          name={[criteria.id, 'salaryComparison']}
                          label="Salary Comparison"
                        >
                          <TextArea 
                            rows={3} 
                            placeholder="Compare your salary to others in your field and location"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          name={[criteria.id, 'compensationEvidence']}
                          label="Compensation Documentation"
                        >
                          <TextArea 
                            rows={3} 
                            placeholder="List supporting documents (pay stubs, contracts, etc.)"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  {/* Commercial Success Criteria */}
                  {criteria.id === 'commercial_success' && (
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <Form.Item
                          name={[criteria.id, 'commercialAchievements']}
                          label="Commercial Achievements"
                        >
                          <TextArea 
                            rows={4} 
                            placeholder="Describe your commercial success in the performing arts"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name={[criteria.id, 'boxOfficeSuccess']}
                          label="Box Office Success"
                        >
                          <Input placeholder="e.g., $10M in ticket sales" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name={[criteria.id, 'awardsRecognition']}
                          label="Awards & Recognition"
                        >
                          <Input placeholder="List awards and recognition received" />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          name={[criteria.id, 'industryImpact']}
                          label="Industry Impact"
                        >
                          <TextArea 
                            rows={3} 
                            placeholder="Describe your impact on the performing arts industry"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  {/* Document Upload Section */}
                  <Divider>Supporting Documents</Divider>
                  <Row gutter={[16, 16]}>
                    <Col xs={24}>
                      <Form.Item
                        name={[criteria.id, 'supportingDocuments']}
                        label="Upload Supporting Documents"
                      >
                        <Upload
                          listType="text"
                          maxCount={10}
                          beforeUpload={() => false}
                        >
                          <Button icon={<UploadOutlined />}>Upload Documents</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        name={[criteria.id, 'documentDescription']}
                        label="Document Description"
                      >
                        <TextArea 
                          rows={2} 
                          placeholder="Describe the documents you plan to upload for this criteria"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Panel>
              ))}
            </Collapse>

            <Divider />

            <Row justify="end">
              <Space>
                <Button size="large" onClick={() => form.resetFields()}>
                  Reset
                </Button>
                <Button type="primary" size="large" htmlType="submit" icon={<SaveOutlined />}>
                  Save Criteria Details
                </Button>
              </Space>
            </Row>
          </Form>
        </Card>
      )}

      {/* Summary */}
      <Card style={{ borderRadius: '12px' }}>
        <Title level={4} style={{ marginBottom: '16px' }}>
          Selection Summary
        </Title>
        <List
          dataSource={selectedCriteriaData}
          renderItem={(criteria) => (
            <List.Item>
              <List.Item.Meta
                avatar={<span style={{ fontSize: '24px' }}>{criteria.icon}</span>}
                title={criteria.name}
                description={criteria.description}
              />
              <Tag color="blue">Selected</Tag>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default CriteriaSelectionForm; 