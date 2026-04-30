'use client';

type BadgeProps = {
  label: string;
  color?:
    | 'brand'
    | 'green'
    | 'red'
    | 'yellow'
    | 'blue'
    | 'gray'
    | string;
};

export default function Badge({ label, color = 'brand' }: BadgeProps) {
  const colorMap: Record<string, string> = {
    brand: 'bg-brand text-white',
    green: 'bg-brand text-white',
    red: 'bg-red-500 text-white',
    yellow: 'bg-yellow-500 text-black',
    blue: 'bg-blue-500 text-white',
    gray: 'bg-muted text-foreground',
  };

  const selectedColor = colorMap[color] || color;

  return (
    <span
      className={`${selectedColor} text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full text-white font-semibold whitespace-nowrap`}
    >
      {label}
    </span>
  );
}