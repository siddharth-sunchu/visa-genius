import React from 'react';
import VisaGeniusLogo from './VisaGeniusLogo';
import { APP_NAME } from '../utils/constants';

interface VisaGeniusTextLogoProps {
  iconSize?: number;
  fontSize?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  showIcon?: boolean;
}

const VisaGeniusTextLogo: React.FC<VisaGeniusTextLogoProps> = ({ 
  iconSize = 32,
  fontSize = 24,
  color = '#1890ff',
  className = '',
  style = {},
  showIcon = true
}) => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center',
        fontSize: `${fontSize}px`,
        fontWeight: 'bold',
        color: color,
        ...style
      }}
      className={className}
    >
      {showIcon && (
        <VisaGeniusLogo 
          size={iconSize} 
          style={{ marginRight: '12px' }} 
        />
      )}
      <span>{APP_NAME}</span>
    </div>
  );
};

export default VisaGeniusTextLogo; 