import React from 'react';

interface VisaGeniusLogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const VisaGeniusLogo: React.FC<VisaGeniusLogoProps> = ({ 
  size = 32, 
  className = '', 
  style = {} 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Background circle */}
      <circle cx="16" cy="16" r="16" fill="#1890ff"/>
      
      {/* Brain with circuit patterns */}
      <g transform="translate(8, 6)">
        {/* Brain outline */}
        <path d="M8 4 C12 2, 16 2, 20 4 C22 6, 22 8, 20 10 C18 12, 14 12, 12 10 C10 8, 10 6, 12 4 C14 2, 16 2, 18 4" 
              stroke="#fbbf24" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        
        {/* Circuit patterns */}
        <path d="M6 6 L10 6 M14 6 L18 6 M8 8 L12 8 M16 8 L20 8" 
              stroke="#fbbf24" strokeWidth="1" strokeLinecap="round"/>
        
        {/* Visa card element */}
        <rect x="4" y="12" width="12" height="8" rx="1" fill="#1890ff" stroke="#fbbf24" strokeWidth="0.5"/>
        <rect x="5" y="13" width="10" height="1" rx="0.5" fill="white" opacity="0.8"/>
        <rect x="5" y="15" width="8" height="0.5" rx="0.25" fill="white" opacity="0.6"/>
      </g>
      
      {/* Genius sparkles */}
      <circle cx="6" cy="6" r="1" fill="#fbbf24"/>
      <circle cx="26" cy="8" r="0.8" fill="#fbbf24"/>
      <circle cx="24" cy="24" r="0.6" fill="#fbbf24"/>
    </svg>
  );
};

export default VisaGeniusLogo; 