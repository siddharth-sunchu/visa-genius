import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Space,
  message,
  Collapse,
  InputNumber,
  Spin
} from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  HeartOutlined,
  GlobalOutlined,
  BankOutlined,
  FileTextOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateQuestionnaireData } from '../store/slices/applicationSlice';
import {
  fetchPersonalInfo,
  updateBasicInfo,
  updateCurrentStatus,
  updateCurrentAddress,
  updateFamilyLife,
  updateSpouseInfo,
  updateChildrenInfo,
  updateImmigrationHistory,
  updatePastUSVisits,
  updateOccupation,
  updateEmploymentHistory,
  clearAllErrors
} from '../store/slices/personalInfoSlice';


const { Title, Text } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;

const PersonalInfoForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { questionnaireData } = useAppSelector((state: any) => state.application);
  const { data, loading, error, sectionLoading, sectionErrors } = useAppSelector((state: any) => state.personalInfo);
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState(['basic_info']);

  // Load personal info on component mount
  useEffect(() => {
    dispatch(fetchPersonalInfo());
    return () => {
      dispatch(clearAllErrors());
    };
  }, [dispatch]);

  // Update form when data changes
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const formData = convertApiDataToFormData(data);
      form.setFieldsValue(formData);
    }
  }, [data, form]);

  // Helper function to convert API data to form data format
  const convertApiDataToFormData = (apiData: any) => {
    const formData: any = {};
    
    // Basic Info
    if (apiData.basicInfo) {
      formData.basicInfo = { ...apiData.basicInfo };
    }

    // Current Status
    if (apiData.currentStatus) {
      formData.currentStatus = { ...apiData.currentStatus };
    }

    // Other sections
    formData.currentAddress = apiData.currentAddress || {};
    formData.familyLife = apiData.familyLife || {};
    formData.spouseInfo = apiData.spouseInfo || {};
    formData.childrenInfo = apiData.childrenInfo || { children: [] };
    formData.immigrationHistory = apiData.immigrationHistory || {};
    formData.pastUSVisits = apiData.pastUSVisits || [];
    formData.occupation = apiData.occupation || {};
    formData.employmentHistory = apiData.employmentHistory || [];

    return formData;
  };

  // Helper function to convert form data to API format
  const convertFormDataToApiData = (formData: any) => {
    return { ...formData };
  };

  const onFinish = async (values: any) => {
    try {
      const apiData = convertFormDataToApiData(values);
      
      // Save all sections to API
      const savePromises = [];
      
      if (values.basicInfo) {
        savePromises.push(dispatch(updateBasicInfo(apiData.basicInfo)).unwrap());
      }
      if (values.currentStatus) {
        savePromises.push(dispatch(updateCurrentStatus(apiData.currentStatus)).unwrap());
      }
      if (values.currentAddress) {
        savePromises.push(dispatch(updateCurrentAddress(apiData.currentAddress)).unwrap());
      }
      if (values.familyLife) {
        savePromises.push(dispatch(updateFamilyLife(apiData.familyLife)).unwrap());
      }
      if (values.spouseInfo) {
        savePromises.push(dispatch(updateSpouseInfo(apiData.spouseInfo)).unwrap());
      }
      if (values.childrenInfo) {
        savePromises.push(dispatch(updateChildrenInfo(apiData.childrenInfo)).unwrap());
      }
      if (values.immigrationHistory) {
        savePromises.push(dispatch(updateImmigrationHistory(apiData.immigrationHistory)).unwrap());
      }
      if (values.pastUSVisits) {
        savePromises.push(dispatch(updatePastUSVisits(apiData.pastUSVisits)).unwrap());
      }
      if (values.occupation) {
        savePromises.push(dispatch(updateOccupation(apiData.occupation)).unwrap());
      }
      if (values.employmentHistory) {
        savePromises.push(dispatch(updateEmploymentHistory(apiData.employmentHistory)).unwrap());
      }

      await Promise.all(savePromises);
      
      // Also update legacy application slice for backward compatibility
      dispatch(updateQuestionnaireData({ section: 'personal_info', data: values }));
      
      message.success('Personal information saved successfully!');
    } catch (error: any) {
      message.error(error.message || 'Failed to save personal information. Please try again.');
    }
  };

  const handleSectionSave = async (section: string, sectionData: any) => {
    try {
      const apiData = convertFormDataToApiData({ [section]: sectionData });
      
      switch (section) {
        case 'basicInfo':
          await dispatch(updateBasicInfo(apiData.basicInfo)).unwrap();
          break;
        case 'currentStatus':
          await dispatch(updateCurrentStatus(apiData.currentStatus)).unwrap();
          break;
        case 'currentAddress':
          await dispatch(updateCurrentAddress(apiData.currentAddress)).unwrap();
          break;
        case 'familyLife':
          await dispatch(updateFamilyLife(apiData.familyLife)).unwrap();
          break;
        case 'spouseInfo':
          await dispatch(updateSpouseInfo(apiData.spouseInfo)).unwrap();
          break;
        case 'childrenInfo':
          await dispatch(updateChildrenInfo(apiData.childrenInfo)).unwrap();
          break;
        case 'immigrationHistory':
          await dispatch(updateImmigrationHistory(apiData.immigrationHistory)).unwrap();
          break;
        case 'pastUSVisits':
          await dispatch(updatePastUSVisits(apiData.pastUSVisits)).unwrap();
          break;
        case 'occupation':
          await dispatch(updateOccupation(apiData.occupation)).unwrap();
          break;
        case 'employmentHistory':
          await dispatch(updateEmploymentHistory(apiData.employmentHistory)).unwrap();
          break;
        default:
          throw new Error(`Unknown section: ${section}`);
      }
      
      message.success(`${section} updated successfully!`);
    } catch (error: any) {
      message.error(error.message || `Failed to update ${section}`);
    }
  };

  const handlePanelChange = (keys: string | string[]) => {
    setActiveKey(Array.isArray(keys) ? keys : [keys]);
  };

  // Display errors if any
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Loading personal information...</div>
      </div>
    );
  }

  return (
    <div>
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Title level={3}>
          <UserOutlined style={{ marginRight: '8px' }} />
          Personal Information
        </Title>
        <Text type="secondary">
          Complete all sections of your personal information. This information is crucial for your EB1A application.
        </Text>
      </Card>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={questionnaireData.personal_info || {}}
        size="large"
      >
        <Collapse
          activeKey={activeKey}
          onChange={handlePanelChange}
          style={{ marginBottom: '24px' }}
        >
          {/* Basic Information */}
          <Panel
            header={
              <Space>
                <UserOutlined />
                <Text strong>Basic Information</Text>
                {sectionErrors.basicInfo && (
                  <Text type="danger" style={{ fontSize: '12px' }}>
                    {sectionErrors.basicInfo}
                  </Text>
                )}
              </Space>
            }
            key="basic_info"
            extra={
              <Button
                type="link"
                size="small"
                loading={sectionLoading.basicInfo}
                onClick={(e) => {
                  e.stopPropagation();
                  const basicInfoData = form.getFieldValue('basicInfo');
                  if (basicInfoData) {
                    handleSectionSave('basicInfo', basicInfoData);
                  }
                }}
              >
                Save Section
              </Button>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['basicInfo', 'firstName']}
                  label="First Name"
                  rules={[{ required: true, message: 'Please enter your first name' }]}
                >
                  <Input placeholder="Enter your first name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['basicInfo', 'lastName']}
                  label="Last Name"
                  rules={[{ required: true, message: 'Please enter your last name' }]}
                >
                  <Input placeholder="Enter your last name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['basicInfo', 'middleName']}
                  label="Middle Name"
                >
                  <Input placeholder="Enter your middle name (optional)" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['basicInfo', 'dateOfBirth']}
                  label="Date of Birth"
                  rules={[{ required: true, message: 'Please select your date of birth' }]}
                >
                  <DatePicker style={{ width: '100%' }} placeholder="Select date of birth" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['basicInfo', 'placeOfBirth']}
                  label="Place of Birth"
                  rules={[{ required: true, message: 'Please enter your place of birth' }]}
                >
                  <Input placeholder="City, Country" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['basicInfo', 'nationality']}
                  label="Nationality"
                  rules={[{ required: true, message: 'Please enter your nationality' }]}
                >
                  <Input placeholder="Enter your nationality" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['basicInfo', 'passportNumber']}
                  label="Passport Number"
                >
                  <Input placeholder="Enter passport number (optional)" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['basicInfo', 'passportExpiryDate']}
                  label="Passport Expiry Date"
                >
                  <DatePicker style={{ width: '100%' }} placeholder="Select expiry date" />
                </Form.Item>
              </Col>
            </Row>
          </Panel>

          {/* Current Status */}
          <Panel
            header={
              <Space>
                <GlobalOutlined />
                <Text strong>Current Immigration Status</Text>
                {sectionErrors.currentStatus && (
                  <Text type="danger" style={{ fontSize: '12px' }}>
                    {sectionErrors.currentStatus}
                  </Text>
                )}
              </Space>
            }
            key="current_status"
            extra={
              <Button
                type="link"
                size="small"
                loading={sectionLoading.currentStatus}
                onClick={(e) => {
                  e.stopPropagation();
                  const currentStatusData = form.getFieldValue('currentStatus');
                  if (currentStatusData) {
                    handleSectionSave('currentStatus', currentStatusData);
                  }
                }}
              >
                Save Section
              </Button>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['currentStatus', 'status']}
                  label="Current Immigration Status"
                  rules={[{ required: true, message: 'Please select your current status' }]}
                >
                  <Select placeholder="Select your current status">
                    <Option value="H-1B">H-1B</Option>
                    <Option value="F-1">F-1</Option>
                    <Option value="L-1">L-1</Option>
                    <Option value="O-1">O-1</Option>
                    <Option value="J-1">J-1</Option>
                    <Option value="B-1/B-2">B-1/B-2</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['currentStatus', 'statusExpiryDate']}
                  label="Status Expiry Date"
                >
                  <DatePicker style={{ width: '100%' }} placeholder="Select expiry date" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['currentStatus', 'i94Number']}
                  label="I-94 Number"
                >
                  <Input placeholder="Enter I-94 number (optional)" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['currentStatus', 'sevisNumber']}
                  label="SEVIS Number (if applicable)"
                >
                  <Input placeholder="Enter SEVIS number" />
                </Form.Item>
              </Col>
            </Row>
          </Panel>

          {/* Current Address */}
          <Panel
            header={
              <Space>
                <HomeOutlined />
                <Text strong>Current Home Address</Text>
                {sectionErrors.currentAddress && (
                  <Text type="danger" style={{ fontSize: '12px' }}>
                    {sectionErrors.currentAddress}
                  </Text>
                )}
              </Space>
            }
            key="current_address"
            extra={
              <Button
                type="link"
                size="small"
                loading={sectionLoading.currentAddress}
                onClick={(e) => {
                  e.stopPropagation();
                  const currentAddressData = form.getFieldValue('currentAddress');
                  if (currentAddressData) {
                    handleSectionSave('currentAddress', currentAddressData);
                  }
                }}
              >
                Save Section
              </Button>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  name={['currentAddress', 'street']}
                  label="Street Address"
                  rules={[{ required: true, message: 'Please enter your street address' }]}
                >
                  <Input placeholder="Enter your street address" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['currentAddress', 'city']}
                  label="City"
                  rules={[{ required: true, message: 'Please enter your city' }]}
                >
                  <Input placeholder="Enter your city" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['currentAddress', 'state']}
                  label="State/Province"
                  rules={[{ required: true, message: 'Please enter your state/province' }]}
                >
                  <Input placeholder="Enter your state/province" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['currentAddress', 'country']}
                  label="Country"
                  rules={[{ required: true, message: 'Please enter your country' }]}
                >
                  <Input placeholder="Enter your country" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['currentAddress', 'zipCode']}
                  label="ZIP/Postal Code"
                  rules={[{ required: true, message: 'Please enter your ZIP/postal code' }]}
                >
                  <Input placeholder="Enter your ZIP/postal code" />
                </Form.Item>
              </Col>
            </Row>
          </Panel>

          {/* Family Life */}
          <Panel
            header={
              <Space>
                <HeartOutlined />
                <Text strong>Family Life</Text>
                {sectionErrors.familyLife && (
                  <Text type="danger" style={{ fontSize: '12px' }}>
                    {sectionErrors.familyLife}
                  </Text>
                )}
              </Space>
            }
            key="family_life"
            extra={
              <Button
                type="link"
                size="small"
                loading={sectionLoading.familyLife}
                onClick={(e) => {
                  e.stopPropagation();
                  const familyLifeData = form.getFieldValue('familyLife');
                  if (familyLifeData) {
                    handleSectionSave('familyLife', familyLifeData);
                  }
                }}
              >
                Save Section
              </Button>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['familyLife', 'maritalStatus']}
                  label="Marital Status"
                  rules={[{ required: true, message: 'Please select your marital status' }]}
                >
                  <Select placeholder="Select your marital status">
                    <Option value="Single">Single</Option>
                    <Option value="Married">Married</Option>
                    <Option value="Divorced">Divorced</Option>
                    <Option value="Widowed">Widowed</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['familyLife', 'childrenCount']}
                  label="Number of Children"
                >
                  <InputNumber
                    min={0}
                    max={20}
                    style={{ width: '100%' }}
                    placeholder="Enter number of children"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Panel>

          {/* Spouse Information */}
          <Panel
            header={
              <Space>
                <UserOutlined />
                <Text strong>Spouse Information</Text>
                {sectionErrors.spouseInfo && (
                  <Text type="danger" style={{ fontSize: '12px' }}>
                    {sectionErrors.spouseInfo}
                  </Text>
                )}
              </Space>
            }
            key="spouse_info"
            extra={
              <Button
                type="link"
                size="small"
                loading={sectionLoading.spouseInfo}
                onClick={(e) => {
                  e.stopPropagation();
                  const spouseInfoData = form.getFieldValue('spouseInfo');
                  if (spouseInfoData) {
                    handleSectionSave('spouseInfo', spouseInfoData);
                  }
                }}
              >
                Save Section
              </Button>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['spouseInfo', 'name']}
                  label="Spouse Full Name"
                >
                  <Input placeholder="Enter spouse's full name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['spouseInfo', 'dateOfBirth']}
                  label="Spouse Date of Birth"
                >
                  <DatePicker style={{ width: '100%' }} placeholder="Select date of birth" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['spouseInfo', 'nationality']}
                  label="Spouse Nationality"
                >
                  <Input placeholder="Enter spouse's nationality" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['spouseInfo', 'occupation']}
                  label="Spouse Occupation"
                >
                  <Input placeholder="Enter spouse's occupation" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name={['spouseInfo', 'education']}
                  label="Spouse Education"
                >
                  <TextArea rows={3} placeholder="Enter spouse's education details" />
                </Form.Item>
              </Col>
            </Row>
          </Panel>

          {/* Children and Dependents */}
          <Panel
            header={
              <Space>
                <HeartOutlined />
                <Text strong>Children and Dependents</Text>
                {sectionErrors.childrenInfo && (
                  <Text type="danger" style={{ fontSize: '12px' }}>
                    {sectionErrors.childrenInfo}
                  </Text>
                )}
              </Space>
            }
            key="children_info"
            extra={
              <Button
                type="link"
                size="small"
                loading={sectionLoading.childrenInfo}
                onClick={(e) => {
                  e.stopPropagation();
                  const childrenInfoData = form.getFieldValue('childrenInfo');
                  if (childrenInfoData) {
                    handleSectionSave('childrenInfo', childrenInfoData);
                  }
                }}
              >
                Save Section
              </Button>
            }
          >
            <Form.List name={['childrenInfo', 'children']}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card
                      key={key}
                      size="small"
                      style={{ marginBottom: '16px' }}
                      extra={
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        />
                      }
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            label="Child's Name"
                            rules={[{ required: true, message: 'Please enter child\'s name' }]}
                          >
                            <Input placeholder="Enter child's full name" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'dateOfBirth']}
                            label="Date of Birth"
                            rules={[{ required: true, message: 'Please select date of birth' }]}
                          >
                            <DatePicker style={{ width: '100%' }} placeholder="Select date of birth" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'nationality']}
                            label="Nationality"
                          >
                            <Input placeholder="Enter nationality" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'relationship']}
                            label="Relationship"
                          >
                            <Select placeholder="Select relationship">
                              <Option value="Son">Son</Option>
                              <Option value="Daughter">Daughter</Option>
                              <Option value="Step-son">Step-son</Option>
                              <Option value="Step-daughter">Step-daughter</Option>
                              <Option value="Other">Other</Option>
                            </Select>
                          </Form.Item>
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
                      Add Child
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Panel>

          {/* Immigration History */}
          <Panel
            header={
              <Space>
                <GlobalOutlined />
                <Text strong>Immigration History</Text>
                {sectionErrors.immigrationHistory && (
                  <Text type="danger" style={{ fontSize: '12px' }}>
                    {sectionErrors.immigrationHistory}
                  </Text>
                )}
              </Space>
            }
            key="immigration_history"
            extra={
              <Button
                type="link"
                size="small"
                loading={sectionLoading.immigrationHistory}
                onClick={(e) => {
                  e.stopPropagation();
                  const immigrationHistoryData = form.getFieldValue('immigrationHistory');
                  if (immigrationHistoryData) {
                    handleSectionSave('immigrationHistory', immigrationHistoryData);
                  }
                }}
              >
                Save Section
              </Button>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  name={['immigrationHistory', 'previousVisas']}
                  label="Previous Visa Types"
                >
                  <TextArea rows={3} placeholder="List all previous visa types you have held" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name={['immigrationHistory', 'previousPetitions']}
                  label="Previous Immigration Petitions"
                >
                  <TextArea rows={3} placeholder="List any previous immigration petitions filed on your behalf" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name={['immigrationHistory', 'previousDeportations']}
                  label="Previous Deportations or Removal Proceedings"
                >
                  <TextArea rows={3} placeholder="List any previous deportations or removal proceedings (if any)" />
                </Form.Item>
              </Col>
            </Row>
          </Panel>

          {/* Past US Visits */}
          <Panel
            header={
              <Space>
                <GlobalOutlined />
                <Text strong>Past US Visits</Text>
                {sectionErrors.pastUSVisits && (
                  <Text type="danger" style={{ fontSize: '12px' }}>
                    {sectionErrors.pastUSVisits}
                  </Text>
                )}
              </Space>
            }
            key="past_us_visits"
            extra={
              <Button
                type="link"
                size="small"
                loading={sectionLoading.pastUSVisits}
                onClick={(e) => {
                  e.stopPropagation();
                  const pastUSVisitsData = form.getFieldValue('pastUSVisits');
                  if (pastUSVisitsData) {
                    handleSectionSave('pastUSVisits', pastUSVisitsData);
                  }
                }}
              >
                Save Section
              </Button>
            }
          >
            <Form.List name="pastUSVisits">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card
                      key={key}
                      size="small"
                      style={{ marginBottom: '16px' }}
                      extra={
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        />
                      }
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'entryDate']}
                            label="Entry Date"
                          >
                            <DatePicker style={{ width: '100%' }} placeholder="Select entry date" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'exitDate']}
                            label="Exit Date"
                          >
                            <DatePicker style={{ width: '100%' }} placeholder="Select exit date" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'purpose']}
                            label="Purpose of Visit"
                          >
                            <Input placeholder="Business, Tourism, Study, etc." />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'visaType']}
                            label="Visa Type"
                          >
                            <Input placeholder="B-1, B-2, F-1, etc." />
                          </Form.Item>
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
                      Add US Visit
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Panel>

          {/* Occupation */}
          <Panel
            header={
              <Space>
                <BankOutlined />
                <Text strong>Occupation & Employment</Text>
                {sectionErrors.occupation && (
                  <Text type="danger" style={{ fontSize: '12px' }}>
                    {sectionErrors.occupation}
                  </Text>
                )}
              </Space>
            }
            key="occupation"
            extra={
              <Button
                type="link"
                size="small"
                loading={sectionLoading.occupation}
                onClick={(e) => {
                  e.stopPropagation();
                  const occupationData = form.getFieldValue('occupation');
                  if (occupationData) {
                    handleSectionSave('occupation', occupationData);
                  }
                }}
              >
                Save Section
              </Button>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['occupation', 'jobTitle']}
                  label="Current Job Title"
                  rules={[{ required: true, message: 'Please enter your job title' }]}
                >
                  <Input placeholder="Enter your current job title" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['occupation', 'field']}
                  label="Field of Work"
                  rules={[{ required: true, message: 'Please enter your field of work' }]}
                >
                  <Input placeholder="e.g., Technology, Medicine, Arts, etc." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['occupation', 'yearsOfExperience']}
                  label="Years of Experience"
                  rules={[{ required: true, message: 'Please enter years of experience' }]}
                >
                  <InputNumber
                    min={0}
                    max={50}
                    style={{ width: '100%' }}
                    placeholder="Enter years of experience"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name={['occupation', 'currentEmployer']}
                  label="Current Employer"
                  rules={[{ required: true, message: 'Please enter your current employer' }]}
                >
                  <Input placeholder="Enter your current employer" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name={['occupation', 'jobDescription']}
                  label="Job Description"
                  rules={[{ required: true, message: 'Please enter your job description' }]}
                >
                  <TextArea rows={4} placeholder="Describe your current role and responsibilities" />
                </Form.Item>
              </Col>
            </Row>
          </Panel>

          {/* Employment History */}
          <Panel
            header={
              <Space>
                <FileTextOutlined />
                <Text strong>Employment History</Text>
                {sectionErrors.employmentHistory && (
                  <Text type="danger" style={{ fontSize: '12px' }}>
                    {sectionErrors.employmentHistory}
                  </Text>
                )}
              </Space>
            }
            key="employment_history"
            extra={
              <Button
                type="link"
                size="small"
                loading={sectionLoading.employmentHistory}
                onClick={(e) => {
                  e.stopPropagation();
                  const employmentHistoryData = form.getFieldValue('employmentHistory');
                  if (employmentHistoryData) {
                    handleSectionSave('employmentHistory', employmentHistoryData);
                  }
                }}
              >
                Save Section
              </Button>
            }
          >
            <Form.List name="employmentHistory">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card
                      key={key}
                      size="small"
                      style={{ marginBottom: '16px' }}
                      extra={
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        />
                      }
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'employer']}
                            label="Employer"
                            rules={[{ required: true, message: 'Please enter employer name' }]}
                          >
                            <Input placeholder="Enter employer name" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'position']}
                            label="Position"
                            rules={[{ required: true, message: 'Please enter position' }]}
                          >
                            <Input placeholder="Enter your position" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'startDate']}
                            label="Start Date"
                            rules={[{ required: true, message: 'Please select start date' }]}
                          >
                            <DatePicker style={{ width: '100%' }} placeholder="Select start date" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'endDate']}
                            label="End Date"
                          >
                            <DatePicker style={{ width: '100%' }} placeholder="Select end date (if applicable)" />
                          </Form.Item>
                        </Col>
                        <Col xs={24}>
                          <Form.Item
                            {...restField}
                            name={[name, 'description']}
                            label="Job Description"
                          >
                            <TextArea rows={3} placeholder="Describe your role and responsibilities" />
                          </Form.Item>
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
                      Add Employment
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Panel>
        </Collapse>

        <Card style={{ borderRadius: '12px' }}>
          <Row justify="end">
            <Space>
              <Button size="large" onClick={() => form.resetFields()}>
                Reset
              </Button>
              <Button type="primary" size="large" htmlType="submit" icon={<SaveOutlined />}>
                Save Personal Information
              </Button>
            </Space>
          </Row>
        </Card>
      </Form>
    </div>
  );
};

export default PersonalInfoForm; 