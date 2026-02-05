import { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  className?: string;
}

const Chip = ({ children, className = 'bg-blue-500' }: ChipProps) => (
  <div
    className={`inline-flex items-center justify-center px-2 rounded-full text-sm font-light border-2 border-paper ${className}`}
  >
    {children}
  </div>
);

export default Chip;
