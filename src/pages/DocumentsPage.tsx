import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Breadcrumb, 
  Upload, 
  Button, 
  List, 
  Tag, 
  Row, 
  Col, 
  Progress,
  Modal,
  Form,
  Input,
  message,
  Space,
  Divider
} from 'antd';
import { 
  HomeOutlined, 
  UploadOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateQuestionnaireData } from '../store/slices/applicationSlice';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;
const { TextArea } = Input;

interface UploadedDocument {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  file: File;
  uploadedAt: Date;
  size: number;
}

const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { questionnaireData } = useAppSelector((state: any) => state.application);
  
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [uploadForm] = Form.useForm();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>(
    questionnaireData.documents?.uploadedFiles || []
  );

  const requiredDocuments = [
    {
      id: 'passport',
      name: 'Passport',
      description: 'Valid passport with at least 6 months validity',
      required: true,
      uploaded: false
    },
    {
      id: 'visa',
      name: 'Current Visa',
      description: 'Current visa documentation',
      required: true,
      uploaded: false
    },
    {
      id: 'i94',
      name: 'I-94 Form',
      description: 'Most recent I-94 arrival/departure record',
      required: true,
      uploaded: false
    },
    {
      id: 'resume',
      name: 'Resume/CV',
      description: 'Detailed professional resume',
      required: true,
      uploaded: false
    },
    {
      id: 'education',
      name: 'Educational Certificates',
      description: 'Academic qualifications and degrees',
      required: true,
      uploaded: false
    },
    {
      id: 'employment',
      name: 'Employment Letters',
      description: 'Current and previous employment letters',
      required: true,
      uploaded: false
    },
    {
      id: 'references',
      name: 'Reference Letters',
      description: 'Professional recommendation letters',
      required: true,
      uploaded: false
    }
  ];

  const handleFileSelect = (files: File[], category?: string) => {
    setSelectedFiles(files);
    if (category) {
      uploadForm.setFieldsValue({ category });
    }
    setIsUploadModalVisible(true);
  };

  const handleRequiredDocumentUpload = (category: string) => {
    // Create a hidden file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
    input.multiple = false;
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        const file = files[0];
        const requiredDoc = requiredDocuments.find(doc => doc.id === category);
        
        const newDocument: UploadedDocument = {
          id: `doc_${Date.now()}`,
          name: file.name,
          title: requiredDoc?.name || file.name,
          description: requiredDoc?.description || '',
          category: category,
          file: file,
          uploadedAt: new Date(),
          size: file.size
        };

        const updatedDocuments = [...uploadedDocuments, newDocument];
        setUploadedDocuments(updatedDocuments);
        
        // Update Redux store
        dispatch(updateQuestionnaireData({
          section: 'documents',
          data: {
            ...questionnaireData.documents,
            uploadedFiles: updatedDocuments
          }
        }));

        message.success(`${requiredDoc?.name} uploaded successfully!`);
      }
    };
    
    input.click();
  };

  const handleUpload = async () => {
    try {
      const values = await uploadForm.validateFields();
      
      const newDocuments: UploadedDocument[] = selectedFiles.map((file, index) => ({
        id: `doc_${Date.now()}_${index}`,
        name: file.name,
        title: values.title || file.name,
        description: values.description || '',
        category: values.category,
        file: file,
        uploadedAt: new Date(),
        size: file.size
      }));

      const updatedDocuments = [...uploadedDocuments, ...newDocuments];
      setUploadedDocuments(updatedDocuments);
      
      // Update Redux store
      dispatch(updateQuestionnaireData({
        section: 'documents',
        data: {
          ...questionnaireData.documents,
          uploadedFiles: updatedDocuments
        }
      }));

      message.success(`${selectedFiles.length} document(s) uploaded successfully!`);
      setIsUploadModalVisible(false);
      setSelectedFiles([]);
      uploadForm.resetFields();
    } catch (error) {
      message.error('Please fill in all required fields.');
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    const updatedDocuments = uploadedDocuments.filter(doc => doc.id !== documentId);
    setUploadedDocuments(updatedDocuments);
    
    dispatch(updateQuestionnaireData({
      section: 'documents',
      data: {
        ...questionnaireData.documents,
        uploadedFiles: updatedDocuments
      }
    }));
    
    message.success('Document removed successfully!');
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    beforeUpload: (file: File) => {
      handleFileSelect([file]);
      return false; // Prevent default upload
    },
    showUploadList: false,
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const requiredDocumentsCount = requiredDocuments.length;
  const uploadedRequiredCount = uploadedDocuments.filter(doc => 
    requiredDocuments.some(req => req.id === doc.category)
  ).length;

  const otherDocuments = uploadedDocuments.filter(doc => 
    !requiredDocuments.some(req => req.id === doc.category)
  );

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
                <FileTextOutlined /> Documents
              </span>
            ),
          },
        ]}
        style={{ marginBottom: '24px' }}
      />

      {/* Header */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Title level={2}>
          <FileTextOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          Document Upload
        </Title>
        <Text type="secondary">
          Upload all required documents for your EB1A application. Make sure all documents are clear and legible.
        </Text>
      </Card>

      {/* Progress Overview */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row align="middle" justify="space-between" style={{ marginBottom: '16px' }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              Upload Progress
            </Title>
            <Text type="secondary">
              {uploadedRequiredCount} of {requiredDocumentsCount} required documents uploaded
            </Text>
          </Col>
          <Col>
            <Progress 
              type="circle" 
              percent={Math.round((uploadedRequiredCount / requiredDocumentsCount) * 100)} 
              size={60}
              strokeColor={uploadedRequiredCount === requiredDocumentsCount ? "#52c41a" : "#1890ff"}
            />
          </Col>
        </Row>
      </Card>

      {/* Required Documents */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Title level={4} style={{ marginBottom: '16px' }}>
          Required Documents
        </Title>
        <List
          dataSource={requiredDocuments}
          renderItem={(doc) => {
            const uploadedDoc = uploadedDocuments.find(uploaded => uploaded.category === doc.id);
            const isUploaded = !!uploadedDoc;
            
            return (
              <List.Item
                actions={
                  isUploaded ? [
                    <Button 
                      type="text" 
                      icon={<DownloadOutlined />} 
                      size="small"
                      onClick={() => {
                        const url = URL.createObjectURL(uploadedDoc!.file);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = uploadedDoc!.name;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Download
                    </Button>,
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      size="small"
                      onClick={() => handleDeleteDocument(uploadedDoc!.id)}
                    >
                      Remove
                    </Button>
                  ] : [
                    <Button 
                      type="text" 
                      icon={<UploadOutlined />} 
                      size="small"
                      onClick={() => handleRequiredDocumentUpload(doc.id)}
                    >
                      Upload
                    </Button>
                  ]
                }
              >
                <List.Item.Meta
                  avatar={<FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Text strong>{doc.name}</Text>
                      <Tag color="red">Required</Tag>
                      {isUploaded && <Tag color="success" icon={<CheckCircleOutlined />}>Uploaded</Tag>}
                    </div>
                  }
                  description={
                    <div>
                      <Text type="secondary">{doc.description}</Text>
                      {isUploaded && (
                        <div style={{ marginTop: '4px' }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {uploadedDoc!.title} • {formatFileSize(uploadedDoc!.size)} • Uploaded {uploadedDoc!.uploadedAt.toLocaleDateString()}
                          </Text>
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      </Card>

      {/* Other Documents Upload */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Title level={4} style={{ marginBottom: '16px' }}>
          Other Documents
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: '24px' }}>
          Upload additional documents that support your EB1A application. You can add titles and descriptions to organize them.
        </Paragraph>
        
        <Dragger {...uploadProps} style={{ padding: '40px' }}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          </p>
          <p className="ant-upload-text">Click or drag files to this area to upload</p>
          <p className="ant-upload-hint">
            Add titles and descriptions to organize your documents
          </p>
          <Button type="primary" icon={<PlusOutlined />} size="large" style={{ marginTop: '16px' }}>
            Upload Documents
          </Button>
        </Dragger>
      </Card>

      {/* Uploaded Other Documents */}
      {otherDocuments.length > 0 && (
        <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            Uploaded Documents ({otherDocuments.length})
          </Title>
          <List
            dataSource={otherDocuments}
            renderItem={(doc) => (
              <List.Item
                actions={[
                  <Button 
                    type="text" 
                    icon={<DownloadOutlined />} 
                    size="small"
                    onClick={() => {
                      const url = URL.createObjectURL(doc.file);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = doc.name;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download
                  </Button>,
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                    size="small"
                    onClick={() => handleDeleteDocument(doc.id)}
                  >
                    Remove
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Text strong>{doc.title}</Text>
                      <Tag color="blue">{doc.category}</Tag>
                      <Tag color="success" icon={<CheckCircleOutlined />}>Uploaded</Tag>
                    </div>
                  }
                  description={
                    <div>
                      <Text type="secondary">{doc.description}</Text>
                      <div style={{ marginTop: '4px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {doc.name} • {formatFileSize(doc.size)} • Uploaded {doc.uploadedAt.toLocaleDateString()}
                        </Text>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Upload Modal */}
      <Modal
        title="Upload Documents"
        open={isUploadModalVisible}
        onOk={handleUpload}
        onCancel={() => {
          setIsUploadModalVisible(false);
          setSelectedFiles([]);
          uploadForm.resetFields();
        }}
        width={600}
        okText="Upload Documents"
        cancelText="Cancel"
      >
        <Form form={uploadForm} layout="vertical">
          <Form.Item
            name="title"
            label="Document Title"
            rules={[{ required: true, message: 'Please enter a title for the document' }]}
          >
            <Input placeholder="Enter a descriptive title for the document" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea 
              rows={3} 
              placeholder="Add a description or notes about this document"
            />
          </Form.Item>
          
          <Form.Item
            name="category"
            label="Document Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Input placeholder="Enter a category for this document (e.g., Awards, Publications, Media Coverage)" />
          </Form.Item>
          
          <Divider />
          
          <div>
            <Text strong>Selected Files:</Text>
            <div style={{ marginTop: '8px' }}>
              {selectedFiles.map((file, index) => (
                <div key={index} style={{ 
                  padding: '8px', 
                  border: '1px solid #d9d9d9', 
                  borderRadius: '4px', 
                  marginBottom: '4px',
                  backgroundColor: '#fafafa'
                }}>
                  <Text>{file.name} ({formatFileSize(file.size)})</Text>
                </div>
              ))}
            </div>
          </div>
        </Form>
      </Modal>

      {/* Tips */}
      <Card style={{ borderRadius: '12px' }}>
        <Title level={4} style={{ marginBottom: '16px' }}>
          Document Upload Tips
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card size="small" style={{ backgroundColor: '#f6ffed' }}>
              <Title level={5}>File Format</Title>
              <Text>Upload documents in PDF, JPG, or PNG format. Maximum file size: 10MB per file.</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card size="small" style={{ backgroundColor: '#fff7e6' }}>
              <Title level={5}>Document Quality</Title>
              <Text>Ensure all documents are clear, legible, and complete. Poor quality scans may be rejected.</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card size="small" style={{ backgroundColor: '#f0f9ff' }}>
              <Title level={5}>Organization</Title>
              <Text>Add descriptive titles and organize documents by category for easy reference.</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card size="small" style={{ backgroundColor: '#fef2f2' }}>
              <Title level={5}>Translation</Title>
              <Text>Documents not in English must be accompanied by certified translations.</Text>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DocumentsPage; 