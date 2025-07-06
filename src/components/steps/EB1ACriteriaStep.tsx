import React, { useState } from 'react';
import { Card, Typography, Checkbox, Input, Button, Row, Col, Space, Progress, message } from 'antd';
import { CheckCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { EB1A_CRITERIA } from '../../utils/constants';
import { EB1ACriteria } from '../../types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface EB1ACriteriaStepProps {
  onComplete: () => void;
}

const EB1ACriteriaStep: React.FC<EB1ACriteriaStepProps> = ({ onComplete }) => {
  const [criteriaData, setCriteriaData] = useState<EB1ACriteria[]>(
    EB1A_CRITERIA.map(criteria => ({
      id: criteria.id,
      category: criteria.category,
      title: criteria.title,
      description: criteria.description,
      isCompleted: false,
      evidence: [],
      documents: []
    }))
  );

  const [loading, setLoading] = useState(false);

  const handleCriteriaToggle = (criteriaId: string) => {
    setCriteriaData(prev => 
      prev.map(criteria => 
        criteria.id === criteriaId 
          ? { ...criteria, isCompleted: !criteria.isCompleted }
          : criteria
      )
    );
  };

  const addEvidence = (criteriaId: string, evidence: string) => {
    setCriteriaData(prev => 
      prev.map(criteria => 
        criteria.id === criteriaId 
          ? { ...criteria, evidence: [...criteria.evidence, evidence] }
          : criteria
      )
    );
  };

  const removeEvidence = (criteriaId: string, evidenceIndex: number) => {
    setCriteriaData(prev => 
      prev.map(criteria => 
        criteria.id === criteriaId 
          ? { 
              ...criteria, 
              evidence: criteria.evidence.filter((_, index) => index !== evidenceIndex) 
            }
          : criteria
      )
    );
  };

  const addDocument = (criteriaId: string, document: string) => {
    setCriteriaData(prev => 
      prev.map(criteria => 
        criteria.id === criteriaId 
          ? { ...criteria, documents: [...criteria.documents, document] }
          : criteria
      )
    );
  };

  const removeDocument = (criteriaId: string, documentIndex: number) => {
    setCriteriaData(prev => 
      prev.map(criteria => 
        criteria.id === criteriaId 
          ? { 
              ...criteria, 
              documents: criteria.documents.filter((_, index) => index !== documentIndex) 
            }
          : criteria
      )
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const completedCount = criteriaData.filter(c => c.isCompleted).length;
      const requiredCount = EB1A_CRITERIA.filter(c => c.required).length;
      
      if (completedCount < requiredCount) {
        message.warning(`Please complete at least ${requiredCount} required criteria sections.`);
        return;
      }
      
      message.success('EB1A criteria saved successfully!');
      onComplete();
    } catch (error) {
      message.error('Failed to save EB1A criteria. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const completedCount = criteriaData.filter(c => c.isCompleted).length;
  const totalCount = EB1A_CRITERIA.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div>
      <Title level={3} style={{ marginBottom: '24px' }}>
        EB1A Eligibility Criteria
      </Title>
      <Text type="secondary" style={{ marginBottom: '32px', display: 'block' }}>
        Complete the EB1A eligibility criteria sections. You must demonstrate extraordinary ability 
        in at least 3 of the 10 criteria categories. Required criteria are marked with an asterisk (*).
      </Text>

      {/* Progress Overview */}
      <Card style={{ marginBottom: '24px' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              Progress: {completedCount} of {totalCount} criteria completed
            </Title>
            <Text type="secondary">
              {completedCount >= 3 ? '✅ You meet the minimum requirement!' : '⚠️ Complete at least 3 criteria'}
            </Text>
          </Col>
          <Col>
            <Progress 
              type="circle" 
              percent={Math.round(progressPercentage)} 
              size={60}
              strokeColor={completedCount >= 3 ? "#52c41a" : "#faad14"}
            />
          </Col>
        </Row>
      </Card>

      {/* Criteria Cards */}
      <div style={{ marginBottom: '32px' }}>
        {criteriaData.map((criteria, index) => (
          <Card 
            key={criteria.id}
            style={{ 
              marginBottom: '16px',
              border: criteria.isCompleted ? '2px solid #52c41a' : '1px solid #d9d9d9',
              borderRadius: '8px'
            }}
          >
            <Row align="middle" justify="space-between">
              <Col flex="auto">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <Checkbox
                    checked={criteria.isCompleted}
                    onChange={() => handleCriteriaToggle(criteria.id)}
                    style={{ marginRight: '12px' }}
                  >
                    <Title level={5} style={{ margin: 0 }}>
                      {criteria.title}
                      {EB1A_CRITERIA.find(c => c.id === criteria.id)?.required && (
                        <Text type="danger" style={{ marginLeft: '4px' }}>*</Text>
                      )}
                    </Title>
                  </Checkbox>
                  {criteria.isCompleted && (
                    <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: '8px' }} />
                  )}
                </div>
                <Paragraph style={{ margin: '8px 0 16px 0', color: '#666' }}>
                  {criteria.description}
                </Paragraph>

                {criteria.isCompleted && (
                  <div>
                    {/* Evidence Section */}
                    <div style={{ marginBottom: '16px' }}>
                      <Text strong>Evidence & Examples:</Text>
                      <div style={{ marginTop: '8px' }}>
                        {criteria.evidence.map((evidence, evidenceIndex) => (
                          <div key={evidenceIndex} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginBottom: '4px',
                            padding: '4px 8px',
                            background: '#f5f5f5',
                            borderRadius: '4px'
                          }}>
                            <Text style={{ flex: 1 }}>{evidence}</Text>
                            <Button 
                              type="text" 
                              size="small" 
                              danger 
                              icon={<DeleteOutlined />}
                              onClick={() => removeEvidence(criteria.id, evidenceIndex)}
                            />
                          </div>
                        ))}
                        <Button 
                          type="dashed" 
                          size="small" 
                          icon={<PlusOutlined />}
                          onClick={() => {
                            const evidence = prompt('Enter evidence or example:');
                            if (evidence) addEvidence(criteria.id, evidence);
                          }}
                          style={{ marginTop: '8px' }}
                        >
                          Add Evidence
                        </Button>
                      </div>
                    </div>

                    {/* Documents Section */}
                    <div>
                      <Text strong>Supporting Documents:</Text>
                      <div style={{ marginTop: '8px' }}>
                        {criteria.documents.map((document, documentIndex) => (
                          <div key={documentIndex} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginBottom: '4px',
                            padding: '4px 8px',
                            background: '#f0f8ff',
                            borderRadius: '4px'
                          }}>
                            <Text style={{ flex: 1 }}>{document}</Text>
                            <Button 
                              type="text" 
                              size="small" 
                              danger 
                              icon={<DeleteOutlined />}
                              onClick={() => removeDocument(criteria.id, documentIndex)}
                            />
                          </div>
                        ))}
                        <Button 
                          type="dashed" 
                          size="small" 
                          icon={<PlusOutlined />}
                          onClick={() => {
                            const document = prompt('Enter document name:');
                            if (document) addDocument(criteria.id, document);
                          }}
                          style={{ marginTop: '8px' }}
                        >
                          Add Document
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </Card>
        ))}
      </div>

      {/* Save Button */}
      <div style={{ textAlign: 'center' }}>
        <Space>
          <Button 
            size="large" 
            onClick={() => setCriteriaData(prev => 
              prev.map(criteria => ({ ...criteria, isCompleted: false, evidence: [], documents: [] }))
            )}
          >
            Reset All
          </Button>
          <Button 
            type="primary" 
            size="large" 
            loading={loading}
            onClick={handleSave}
            disabled={completedCount < 3}
          >
            Save & Continue
          </Button>
        </Space>
      </div>

      {/* Help Text */}
      <Card style={{ marginTop: '24px', background: '#f6ffed', border: '1px solid #b7eb8f' }}>
        <Title level={5} style={{ color: '#52c41a', marginBottom: '8px' }}>
          💡 Tips for Success
        </Title>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Focus on providing concrete evidence and examples for each criterion</li>
          <li>Include quantifiable achievements (numbers, percentages, impact metrics)</li>
          <li>Provide supporting documents like certificates, awards, publications</li>
          <li>Be specific about your contributions and their significance</li>
          <li>Consider both national and international recognition</li>
        </ul>
      </Card>
    </div>
  );
};

export default EB1ACriteriaStep; 