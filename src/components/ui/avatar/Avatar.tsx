type AvatarProps = {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
};

export function Avatar({
  src = '/images/avatar-default.png',
  alt = 'Avatar',
  size = 40,
  className = '',
}: AvatarProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).src = '/images/avatar-default.png';
      }}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export default Avatar;