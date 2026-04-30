import classNames from 'classnames';
import { ReactNode } from 'react';

interface CardPlanoProps {
  title: string;
  titleColor?: string;
  description: string;
  features: string[];
  borderColor?: string;
  children: ReactNode;
}

export default function CardPlano({
  title,
  titleColor = '',
  description,
  features,
  borderColor = 'border-white/20',
  children,
}: CardPlanoProps) {
  return (
    <div
      className={classNames(
        'flex flex-col justify-between rounded-3xl border p-6 md:p-8 bg-black/70 backdrop-blur-md hover:scale-[1.02] transition-transform duration-300',
        borderColor
      )}
    >
      <div>
        <h3 className={classNames('text-xl md:text-2xl font-bold mb-4', titleColor)}>
          {title}
        </h3>
        <p className="text-sm md:text-base text-white/70 mb-6">{description}</p>
        <ul className="space-y-2 mb-6">
          {features.map((item) => (
            <li key={item} className="text-white/80 text-sm md:text-base">
              ✅ {item}
            </li>
          ))}
        </ul>
      </div>
      <div>{children}</div>
    </div>
  );
}