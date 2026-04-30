import Image from 'next/image';
import { useState } from 'react';

interface LogoLargeProps {
  className?: string;
  priority?: boolean;
}

const LogoLarge: React.FC<LogoLargeProps> = ({ 
  className = '', 
  priority = false 
}) => {
  const [imageError, setImageError] = useState(false);
  
  if (imageError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-4xl font-bold text-brand">Me Joy</span>
      </div>
    );
  }
  
  return (
    <Image
      src="/logosmejoy/logomejoy.png"
      alt="Me Joy Farma"
      width={320}
      height={96}
      priority={priority}
      className={`object-contain ${className}`}
      onError={() => setImageError(true)}
    />
  );
};

export default LogoLarge;
