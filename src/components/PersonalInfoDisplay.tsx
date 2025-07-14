import React from 'react';
import { Card, Typography, Row, Col, Descriptions, Tag, Empty, Spin } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  GlobalOutlined,
  BankOutlined,
  HeartOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import usePersonalInfo from '../hooks/usePersonalInfo';

const { Title, Text } = Typography;

const PersonalInfoDisplay: React.FC = () => {
  const {
    data,
    isLoading,
    error,
    basicInfo,
    currentStatus,
    currentAddress,
    familyLife,
    spouseInfo,
    occupation,
    employmentHistory,
  } = usePersonalInfo();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Loading personal information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <Empty
          description={error}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <Card>
        <Empty
          description="No personal information available. Please fill out your personal information form."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Personal Information Summary</Title>
      
      {/* Basic Information */}
      {basicInfo && (
        <Card
          title={
            <span>
              <UserOutlined style={{ marginRight: '8px' }} />
              Basic Information
            </span>
          }
          style={{ marginBottom: '24px' }}
        >
          <Descriptions column={2} bordered>
            <Descriptions.Item label="First Name">{basicInfo.firstName || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Last Name">{basicInfo.lastName || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Middle Name">{basicInfo.middleName || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Date of Birth">{basicInfo.dateOfBirth || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Place of Birth">{basicInfo.placeOfBirth || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Nationality">{basicInfo.nationality || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Passport Number">{basicInfo.passportNumber || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Passport Expiry">{basicInfo.passportExpiryDate || 'Not provided'}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Current Status */}
      {currentStatus && (
        <Card
          title={
            <span>
              <GlobalOutlined style={{ marginRight: '8px' }} />
              Current Immigration Status
            </span>
          }
          style={{ marginBottom: '24px' }}
        >
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Status">
              {currentStatus.status ? <Tag color="blue">{currentStatus.status}</Tag> : 'Not provided'}
            </Descriptions.Item>
            <Descriptions.Item label="Status Expiry">{currentStatus.statusExpiryDate || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="I-94 Number">{currentStatus.i94Number || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="SEVIS Number">{currentStatus.sevisNumber || 'Not provided'}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Current Address */}
      {currentAddress && (
        <Card
          title={
            <span>
              <HomeOutlined style={{ marginRight: '8px' }} />
              Current Address
            </span>
          }
          style={{ marginBottom: '24px' }}
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Street Address">{currentAddress.street || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="City">{currentAddress.city || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="State">{currentAddress.state || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Country">{currentAddress.country || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="ZIP Code">{currentAddress.zipCode || 'Not provided'}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Family Life */}
      {familyLife && (
        <Card
          title={
            <span>
              <HeartOutlined style={{ marginRight: '8px' }} />
              Family Information
            </span>
          }
          style={{ marginBottom: '24px' }}
        >
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Marital Status">
              {familyLife.maritalStatus ? <Tag color="green">{familyLife.maritalStatus}</Tag> : 'Not provided'}
            </Descriptions.Item>
            <Descriptions.Item label="Number of Children">{familyLife.childrenCount || 0}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Spouse Information */}
      {spouseInfo && familyLife?.maritalStatus === 'Married' && (
        <Card
          title={
            <span>
              <UserOutlined style={{ marginRight: '8px' }} />
              Spouse Information
            </span>
          }
          style={{ marginBottom: '24px' }}
        >
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Name">{spouseInfo.name || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Date of Birth">{spouseInfo.dateOfBirth || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Nationality">{spouseInfo.nationality || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Occupation">{spouseInfo.occupation || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Education" span={2}>{spouseInfo.education || 'Not provided'}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Current Occupation */}
      {occupation && (
        <Card
          title={
            <span>
              <BankOutlined style={{ marginRight: '8px' }} />
              Current Occupation
            </span>
          }
          style={{ marginBottom: '24px' }}
        >
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Job Title">{occupation.jobTitle || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Field">{occupation.field || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Years of Experience">{occupation.yearsOfExperience || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Current Employer">{occupation.currentEmployer || 'Not provided'}</Descriptions.Item>
            <Descriptions.Item label="Job Description" span={2}>
              {occupation.jobDescription || 'Not provided'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Employment History */}
      {employmentHistory && employmentHistory.length > 0 && (
        <Card
          title={
            <span>
              <FileTextOutlined style={{ marginRight: '8px' }} />
              Employment History
            </span>
          }
          style={{ marginBottom: '24px' }}
        >
          {employmentHistory.map((emp, index) => (
            <Card key={index} size="small" style={{ marginBottom: '16px' }}>
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Employer">{emp.employer || 'Not provided'}</Descriptions.Item>
                <Descriptions.Item label="Position">{emp.position || 'Not provided'}</Descriptions.Item>
                <Descriptions.Item label="Start Date">{emp.startDate || 'Not provided'}</Descriptions.Item>
                <Descriptions.Item label="End Date">{emp.endDate || 'Current'}</Descriptions.Item>
                <Descriptions.Item label="Description" span={2}>
                  {emp.description || 'Not provided'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          ))}
        </Card>
      )}
    </div>
  );
};

export default PersonalInfoDisplay;