import Image from 'next/image';
import { useState } from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  priority?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  className = '', 
  priority = false 
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
        <div className={`${sizeClasses[size]} rounded-lg bg-brand/20 flex items-center justify-center`}>
          <span className="text-brand font-bold text-xs">Me</span>
        </div>
      </div>
    );
  }
  
  return (
    <Image
      src="/logosmejoy/faviconmejoy.png"
      alt="Me Joy Farma"
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      className={`object-contain ${className}`}
      onError={() => setImageError(true)}
    />
  );
};

export default Logo;
