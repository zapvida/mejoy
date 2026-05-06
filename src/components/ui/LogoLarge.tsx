import Image from 'next/image';
import { useState } from 'react';

interface LogoLargeProps {
  className?: string;
  priority?: boolean;
  variant?: 'primary' | 'inverse';
}

const LogoLarge: React.FC<LogoLargeProps> = ({ 
  className = '', 
  priority = false,
  variant = 'primary',
}) => {
  const [imageError, setImageError] = useState(false);
  
  if (imageError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className={`text-4xl font-bold ${variant === 'inverse' ? 'text-white' : 'text-foreground'}`}>MeJoy</span>
      </div>
    );
  }
  
  return (
    <Image
      src={variant === 'inverse' ? '/logosmejoy/logomejoy-inverse.svg' : '/logosmejoy/logomejoy.svg'}
      alt="MeJoy"
      width={320}
      height={96}
      priority={priority}
      className={`object-contain ${className}`}
      onError={() => setImageError(true)}
    />
  );
};

export default LogoLarge;
