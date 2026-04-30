import React, { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  sectionClassName?: string;
  children: ReactNode;
}

export default function Section({
  id,
  className = '',
  sectionClassName = '',
  children,
}: SectionProps) {
  return (
    <section id={id} className={`py-16 md:py-24 ${sectionClassName}`}>
      <div className={`container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
    </section>
  );
}
