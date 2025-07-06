import { ExperimentOutlined } from '@ant-design/icons';
import React from 'react';
import { GiMaterialsScience } from "react-icons/gi";

interface VisaGeniusAtomLogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const VisaGeniusAtomLogo: React.FC<VisaGeniusAtomLogoProps> = ({ 
  size = 32, 
  className = '', 
  style = {} 
}) => {
  const IconComponent = GiMaterialsScience as React.ComponentType<any>;
  return (
    <div 
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1890ff',
        fontSize: size * 0.6,
        boxShadow: '0 2px 8px rgba(24, 144, 255, 0.15)',
        ...style
      }}
      className={className}
    >
      {/* <IconComponent /> */}
      {<ExperimentOutlined /> as React.ReactElement}
    </div>
  );
};

export default VisaGeniusAtomLogo; 