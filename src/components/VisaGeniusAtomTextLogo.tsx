import React from 'react';
import VisaGeniusAtomLogo from './VisaGeniusAtomLogo';
import { APP_NAME } from '../utils/constants';

interface VisaGeniusAtomTextLogoProps {
  iconSize?: number;
  fontSize?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  showIcon?: boolean;
}

const VisaGeniusAtomTextLogo: React.FC<VisaGeniusAtomTextLogoProps> = ({ 
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
        <VisaGeniusAtomLogo 
          size={iconSize} 
          style={{ marginRight: '12px' }} 
        />
      )}
      <span>{APP_NAME}</span>
    </div>
  );
};

export default VisaGeniusAtomTextLogo; 