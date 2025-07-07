import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Input,
  Button,
  Space,
  Avatar,
  List,
  Badge,
  Empty,
  Tooltip
} from 'antd';
import {
  SendOutlined,
  PaperClipOutlined,
  UserOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  addMessage, 
  setCurrentConversation,
  markConversationAsRead 
} from '../store/slices/chatSlice';

const { Text } = Typography;
const { TextArea } = Input;

const ChatInterface: React.FC = () => {
  const dispatch = useAppDispatch();
  const { conversations, currentConversation, messages } = useAppSelector((state: any) => state.chat);
  const [inputMessage, setInputMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  const mockConversations = [
    {
      id: '1',
      participantIds: ['user1', 'case_manager1'],
      participantNames: ['John Doe', 'Sarah Johnson'],
      lastMessage: {
        id: 'msg1',
        senderId: 'case_manager1',
        senderName: 'Sarah Johnson',
        senderRole: 'case_manager' as const,
        content: "I've reviewed your EB1A criteria selection. You have a strong case with 4 criteria selected.",
        timestamp: '2024-01-15T10:30:00Z',
        isRead: false
      },
      unreadCount: 1,
      isActive: true
    },
    {
      id: '2',
      participantIds: ['user1', 'case_manager2'],
      participantNames: ['John Doe', 'Mike Chen'],
      lastMessage: {
        id: 'msg2',
        senderId: 'user1',
        senderName: 'John Doe',
        senderRole: 'applicant' as const,
        content: 'Thank you for the guidance on document preparation.',
        timestamp: '2024-01-14T15:45:00Z',
        isRead: true
      },
      unreadCount: 0,
      isActive: false
    }
  ];

  const mockMessages = {
    '1': [
      {
        id: 'msg1',
        senderId: 'case_manager1',
        senderName: 'Sarah Johnson',
        senderRole: 'case_manager' as const,
        content: "Hello John! I'm your assigned case manager for your EB1A application.",
        timestamp: '2024-01-15T09:00:00Z',
        isRead: true
      },
      {
        id: 'msg2',
        senderId: 'user1',
        senderName: 'John Doe',
        senderRole: 'applicant' as const,
        content: "Hi Sarah, thank you for reaching out. I'm excited to work with you on my EB1A application.",
        timestamp: '2024-01-15T09:05:00Z',
        isRead: true
      },
      {
        id: 'msg3',
        senderId: 'case_manager1',
        senderName: 'Sarah Johnson',
        senderRole: 'case_manager' as const,
        content: "I've reviewed your EB1A criteria selection. You have a strong case with 4 criteria selected.",
        timestamp: '2024-01-15T10:30:00Z',
        isRead: false
      }
    ],
    '2': [
      {
        id: 'msg1',
        senderId: 'case_manager2',
        senderName: 'Mike Chen',
        senderRole: 'case_manager' as const,
        content: "Hi John, I'm here to help you with document preparation for your EB1A application.",
        timestamp: '2024-01-14T14:00:00Z',
        isRead: true
      },
      {
        id: 'msg2',
        senderId: 'user1',
        senderName: 'John Doe',
        senderRole: 'applicant' as const,
        content: 'Thank you for the guidance on document preparation.',
        timestamp: '2024-01-14T15:45:00Z',
        isRead: true
      }
    ]
  };

  useEffect(() => {
    // Initialize with mock data
    if (conversations.length === 0) {
      // In a real app, this would be loaded from the backend
      console.log('Loading mock conversations');
    }
  }, [conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !currentConversation) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'user1',
      senderName: 'John Doe',
      senderRole: 'applicant' as const,
      content: inputMessage,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    dispatch(addMessage({ conversationId: currentConversation, message: newMessage }));
    setInputMessage('');
  };

  const handleConversationSelect = (conversationId: string) => {
    dispatch(setCurrentConversation(conversationId));
    dispatch(markConversationAsRead(conversationId));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentMessages = currentConversation ? (mockMessages as any)[currentConversation] || [] : [];
  const currentConversationData = mockConversations.find(c => c.id === currentConversation);

  return (
    <div style={{ height: 'calc(100vh - 200px)' }}>
      <Row gutter={16} style={{ height: '100%' }}>
        {/* Conversations List */}
        <Col xs={24} sm={8} style={{ height: '100%' }}>
          <Card 
            title={
              <Space>
                <MessageOutlined />
                <Text strong>Conversations</Text>
              </Space>
            }
            style={{ height: '100%', borderRadius: '12px' }}
            bodyStyle={{ padding: 0, height: 'calc(100% - 57px)' }}
          >
            <List
              dataSource={mockConversations}
              renderItem={(conversation) => (
                <List.Item
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    backgroundColor: currentConversation === conversation.id ? '#f0f8ff' : 'transparent',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                  onClick={() => handleConversationSelect(conversation.id)}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge count={conversation.unreadCount} size="small">
                        <Avatar icon={<UserOutlined />} />
                      </Badge>
                    }
                    title={
                      <Space>
                        <Text strong>{conversation.participantNames[1]}</Text>
                        {conversation.unreadCount > 0 && (
                          <Badge count={conversation.unreadCount} size="small" />
                        )}
                      </Space>
                    }
                    description={
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {conversation.lastMessage.content.length > 50 
                            ? conversation.lastMessage.content.substring(0, 50) + '...'
                            : conversation.lastMessage.content
                          }
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          {formatTime(conversation.lastMessage.timestamp)}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Chat Messages */}
        <Col xs={24} sm={16} style={{ height: '100%' }}>
          <Card 
            title={
              currentConversationData ? (
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <Text strong>{currentConversationData.participantNames[1]}</Text>
                  <Text type="secondary">Case Manager</Text>
                </Space>
              ) : (
                <Text strong>Select a conversation</Text>
              )
            }
            style={{ height: '100%', borderRadius: '12px' }}
            bodyStyle={{ 
              padding: 0, 
              height: 'calc(100% - 57px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {currentConversation ? (
              <>
                {/* Messages Area */}
                <div style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  padding: '16px',
                  backgroundColor: '#fafafa'
                }}>
                  {currentMessages.length > 0 ? (
                    <div>
                      {currentMessages.map((msg: any) => (
                        <div
                          key={msg.id}
                          style={{
                            marginBottom: '16px',
                            display: 'flex',
                            justifyContent: msg.senderRole === 'applicant' ? 'flex-end' : 'flex-start'
                          }}
                        >
                          <div
                            style={{
                              maxWidth: '70%',
                              backgroundColor: msg.senderRole === 'applicant' ? '#1890ff' : '#fff',
                              color: msg.senderRole === 'applicant' ? '#fff' : '#000',
                              padding: '12px 16px',
                              borderRadius: '12px',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                              position: 'relative'
                            }}
                          >
                            {msg.senderRole === 'case_manager' && (
                              <div style={{ marginBottom: '4px' }}>
                                <Text 
                                  strong 
                                  style={{ 
                                    fontSize: '12px',
                                    color: '#666'
                                  }}
                                >
                                  {msg.senderName}
                                </Text>
                              </div>
                            )}
                            <div>{msg.content}</div>
                            <div style={{ 
                              fontSize: '11px', 
                              opacity: 0.7,
                              marginTop: '4px',
                              textAlign: 'right'
                            }}>
                              {formatTime(msg.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <Empty 
                      description="No messages yet"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </div>

                {/* Input Area */}
                <div style={{ 
                  padding: '16px', 
                  borderTop: '1px solid #f0f0f0',
                  backgroundColor: '#fff'
                }}>
                  <Row gutter={[8, 8]} align="middle">
                    <Col flex="auto">
                      <TextArea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        autoSize={{ minRows: 1, maxRows: 4 }}
                        onPressEnter={(e) => {
                          if (!e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                    </Col>
                    <Col>
                      <Space>
                        <Tooltip title="Attach file">
                          <Button 
                            icon={<PaperClipOutlined />} 
                            type="text"
                            size="large"
                          />
                        </Tooltip>
                        <Tooltip title="Send message">
                          <Button 
                            type="primary" 
                            icon={<SendOutlined />}
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim()}
                            size="large"
                          />
                        </Tooltip>
                      </Space>
                    </Col>
                  </Row>
                </div>
              </>
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%'
              }}>
                <Empty 
                  description="Select a conversation to start chatting"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChatInterface; 