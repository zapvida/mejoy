import BrandLogo from './BrandLogo';

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
  return (
    <BrandLogo
      variant={variant === 'inverse' ? 'inverse' : 'default'}
      size="xl"
      priority={priority}
      className={className}
    />
  );
};

export default LogoLarge;
