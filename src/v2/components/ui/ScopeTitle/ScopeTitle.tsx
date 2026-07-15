import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type ScopeTitleProps = {
  icon?: ReactNode;
  count?: number;
  label: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
};

const ScopeTitle = ({ icon, count, label, as: Heading = 'h1', className }: ScopeTitleProps) => (
  <Heading className={twMerge('flex items-center gap-2 capitalize', className)}>
    {icon}
    {count !== undefined && <span>{count}</span>}
    <span>{label}</span>
  </Heading>
);

export default ScopeTitle;
