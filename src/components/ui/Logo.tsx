import BrandLogo from './BrandLogo';

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
  return (
    <BrandLogo
      variant={variant === 'inverse' ? 'icon-inverse' : 'icon'}
      size={size === 'large' ? 'lg' : size === 'small' ? 'sm' : 'md'}
      priority={priority}
      className={className}
    />
  );
};

export default Logo;
