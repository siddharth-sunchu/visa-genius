import React from 'react';
import { Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

// Add CSS for smooth animations
const spinnerStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .loading-spinner-container {
    animation: fadeIn 0.3s ease-out;
  }
  
  .loading-spinner-text {
    animation: fadeIn 0.5s ease-out 0.2s both;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = spinnerStyles;
  document.head.appendChild(styleSheet);
}

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'default', 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  const customIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 48 : 24 }} spin />;
  
  const content = (
    <div className="loading-spinner-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '16px'
    }}>
      <Spin indicator={customIcon} size={size} />
      {message && (
        <Text className="loading-spinner-text" type="secondary" style={{ fontSize: size === 'large' ? '16px' : '14px' }}>
          {message}
        </Text>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999
      }}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;