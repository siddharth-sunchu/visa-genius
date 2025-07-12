import React from 'react';
import { Alert, Button, Typography } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ErrorMessageProps {
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
  showRetry?: boolean;
  onRetry?: () => void;
  retryText?: string;
  closable?: boolean;
  onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  type = 'error',
  showRetry = false,
  onRetry,
  retryText = 'Try Again',
  closable = false,
  onClose
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'info':
        return <ExclamationCircleOutlined style={{ color: '#1890ff' }} />;
      default:
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
    }
  };

  return (
    <Alert
      message={title}
      description={
        <div>
          <Text>{message}</Text>
          {showRetry && onRetry && (
            <div style={{ marginTop: '12px' }}>
              <Button
                type="primary"
                size="small"
                icon={<ReloadOutlined />}
                onClick={onRetry}
              >
                {retryText}
              </Button>
            </div>
          )}
        </div>
      }
      type={type}
      icon={getIcon()}
      closable={closable}
      onClose={onClose}
      style={{
        marginBottom: '16px',
        borderRadius: '8px'
      }}
    />
  );
};

export default ErrorMessage;