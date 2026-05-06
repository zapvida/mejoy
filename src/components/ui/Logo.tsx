import Image from 'next/image';
import { useState } from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  priority?: boolean;
  variant?: 'primary' | 'inverse';
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  className = '', 
  priority = false,
  variant = 'primary',
}) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeMap = {
    small: { width: 40, height: 40 },
    medium: { width: 48, height: 48 },
    large: { width: 64, height: 64 }
  };
  
  const dimensions = sizeMap[size];
  
  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };
  
  if (imageError) {
    return (
      <div className={`flex items-center ${className}`}>
        <div
          className={`${sizeClasses[size]} flex items-center justify-center rounded-[1rem] ${
            variant === 'inverse' ? 'bg-white/15 text-white' : 'bg-black text-white'
          }`}
        >
          <span className="text-xs font-bold">Me</span>
        </div>
      </div>
    );
  }
  
  return (
    <Image
      src={variant === 'inverse' ? '/logosmejoy/me-mark-inverse.svg' : '/logosmejoy/me-mark.svg'}
      alt="MeJoy"
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      className={`object-contain ${className}`}
      onError={() => setImageError(true)}
    />
  );
};

export default Logo;
