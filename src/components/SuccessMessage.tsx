import React, { useEffect, useState } from 'react';
import { Result, Button, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface SuccessMessageProps {
  title: string;
  message?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  autoRedirect?: boolean;
  redirectDelay?: number;
  onAutoRedirect?: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title,
  message,
  buttonText = 'Continue',
  onButtonClick,
  autoRedirect = false,
  redirectDelay = 3000,
  onAutoRedirect
}) => {
  const [countdown, setCountdown] = useState(redirectDelay / 1000);

  useEffect(() => {
    if (autoRedirect) {
      const timer = setTimeout(() => {
        onAutoRedirect?.();
      }, redirectDelay);

      const countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownTimer);
      };
    }
  }, [autoRedirect, redirectDelay, onAutoRedirect]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '72px' }} />}
          title={title}
          subTitle={message}
          extra={[
            onButtonClick && (
              <Button type="primary" key="continue" onClick={onButtonClick}>
                {buttonText}
              </Button>
            ),
            autoRedirect && (
              <div key="countdown" style={{ marginTop: '16px' }}>
                <Text type="secondary">
                  Redirecting in {countdown} seconds...
                </Text>
              </div>
            )
          ].filter(Boolean)}
        />
      </div>
    </div>
  );
};

export default SuccessMessage;